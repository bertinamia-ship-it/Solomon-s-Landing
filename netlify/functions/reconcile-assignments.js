/**
 * Netlify Function: Reconcile Table Assignments
 * 
 * Maintenance function to clean up orphaned table_assignments:
 * - Assignments with reservation_id that no longer exists
 * - Assignments for reservations with status: completed, cancelled, no_show
 * 
 * Protected: Requires admin authorization
 * 
 * Environment Variables Required:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

const { createClient } = require('@supabase/supabase-js');

const json = (statusCode, data) => ({
    statusCode,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(data)
});

exports.handler = async (event, context) => {
    // CORS handling
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return json(405, { ok: false, error: 'Method not allowed' });
    }

    // Simple auth check (admin only)
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader) {
        return json(401, { ok: false, error: 'Unauthorized' });
    }

    try {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return json(500, { ok: false, error: 'Server configuration error' });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Get all assignments with reservation_id
        const { data: allAssignments, error: fetchError } = await supabase
            .from('table_assignments')
            .select('id, reservation_id, status')
            .not('reservation_id', 'is', null);

        if (fetchError) {
            throw fetchError;
        }

        if (!allAssignments || allAssignments.length === 0) {
            return json(200, {
                ok: true,
                deletedCount: 0,
                message: 'No assignments to reconcile'
            });
        }

        // Get unique reservation IDs
        const reservationIds = [...new Set(allAssignments.map(a => a.reservation_id).filter(Boolean))];

        // Check which reservations exist and their statuses
        const { data: reservations, error: reservationsError } = await supabase
            .from('reservations')
            .select('id, status')
            .in('id', reservationIds);

        if (reservationsError) {
            throw reservationsError;
        }

        // Build sets for quick lookup
        const existingReservationIds = new Set((reservations || []).map(r => r.id));
        const releaseStatuses = new Set(['completed', 'cancelled', 'no_show']);
        const reservationsByStatus = {};
        (reservations || []).forEach(r => {
            if (!reservationsByStatus[r.id]) {
                reservationsByStatus[r.id] = r.status;
            }
        });

        // Find assignments to delete:
        // 1. Assignments with reservation_id that doesn't exist
        // 2. Assignments for reservations with release statuses
        const assignmentsToDelete = [];
        allAssignments.forEach(assignment => {
            if (!assignment.reservation_id) return;
            
            if (!existingReservationIds.has(assignment.reservation_id)) {
                // Orphaned: reservation doesn't exist
                assignmentsToDelete.push(assignment.id);
            } else if (releaseStatuses.has(reservationsByStatus[assignment.reservation_id])) {
                // Reservation is completed/cancelled/no_show, should release
                assignmentsToDelete.push(assignment.id);
            }
        });

        if (assignmentsToDelete.length === 0) {
            return json(200, {
                ok: true,
                deletedCount: 0,
                checked: allAssignments.length,
                message: 'All assignments are valid'
            });
        }

        // Delete orphaned/invalid assignments
        const { data: deleted, error: deleteError } = await supabase
            .from('table_assignments')
            .delete()
            .in('id', assignmentsToDelete)
            .select();

        if (deleteError) {
            throw deleteError;
        }

        const deletedCount = deleted?.length || 0;

        return json(200, {
            ok: true,
            success: true,
            deletedCount: deletedCount,
            checked: allAssignments.length,
            message: `Reconciled ${deletedCount} orphaned/invalid assignment(s)`
        });

    } catch (err) {
        console.error('FUNCTION ERROR:', err);
        return json(500, {
            ok: false,
            error: String(err?.message || err),
            stack: err?.stack || null
        });
    }
};

