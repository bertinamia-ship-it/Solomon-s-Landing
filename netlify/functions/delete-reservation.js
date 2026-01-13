/**
 * Netlify Function: Delete Reservation (Permanent)
 * Permanently deletes a reservation and all its table assignments
 */

const { createClient } = require('@supabase/supabase-js');

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
        return {
            statusCode: 405,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ success: false, error: 'Method not allowed' })
        };
    }

    // Simple auth check
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader) {
        return {
            statusCode: 401,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ success: false, error: 'Unauthorized' })
        };
    }

    try {
        const data = JSON.parse(event.body);
        const { id } = data;

        if (!id) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ success: false, error: 'Reservation ID required' })
            };
        }

        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return {
                statusCode: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ success: false, error: 'Server configuration error' })
            };
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Verify reservation exists
        const { data: existingReservation, error: fetchError } = await supabase
            .from('reservations')
            .select('id')
            .eq('id', id)
            .single();

        if (fetchError || !existingReservation) {
            return {
                statusCode: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ success: false, error: 'Reservation not found' })
            };
        }

        // Step 1: Delete all table assignments for this reservation
        const { data: deletedAssignments, error: deleteAssignmentsError } = await supabase
            .from('table_assignments')
            .delete()
            .eq('reservation_id', id)
            .select();

        if (deleteAssignmentsError) {
            console.error('❌ Error deleting table assignments:', deleteAssignmentsError);
            throw deleteAssignmentsError;
        }

        const deletedAssignmentsCount = deletedAssignments?.length || 0;
        console.log(`✅ Deleted ${deletedAssignmentsCount} table assignment(s) for reservation ${id}`);

        // Step 2: Delete the reservation itself (hard delete)
        const { error: deleteReservationError } = await supabase
            .from('reservations')
            .delete()
            .eq('id', id);

        if (deleteReservationError) {
            console.error('❌ Error deleting reservation:', deleteReservationError);
            throw deleteReservationError;
        }

        console.log(`✅ Reservation ${id} permanently deleted.`);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                success: true, 
                ok: true,
                deletedAssignments: deletedAssignmentsCount,
                message: `Reservation permanently deleted. ${deletedAssignmentsCount} table assignment(s) removed.`
            })
        };

    } catch (error) {
        console.error('❌ Error deleting reservation:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ success: false, error: error.message || 'Internal server error' })
        };
    }
};

