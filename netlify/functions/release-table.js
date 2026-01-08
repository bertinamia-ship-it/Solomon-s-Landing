/**
 * Netlify Function: Release Table (Free Table)
 * Force-releases all 3 slot assignments for a specific table at a specific time
 * Used by hostess/admin to manually free a table
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
        return json(405, { ok: false, success: false, error: 'Method not allowed' });
    }

    // Simple auth check
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader) {
        return json(401, { ok: false, success: false, error: 'Unauthorized' });
    }

    try {
        const data = JSON.parse(event.body);
        const { date, time, table_id, area } = data;

        if (!date || !time || !table_id) {
            return json(400, { 
                ok: false, 
                success: false, 
                error: 'Missing required fields: date, time, table_id' 
            });
        }

        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return json(500, { ok: false, success: false, error: 'Server configuration error' });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Calculate the 3 time slots (T, T+30, T+60)
        const [hours, minutes] = time.split(':').map(Number);
        const timeSlots = [time];
        
        // T+30
        let nextMinutes = minutes + 30;
        let nextHours = hours;
        if (nextMinutes >= 60) {
            nextMinutes -= 60;
            nextHours = (nextHours + 1) % 24;
        }
        timeSlots.push(`${String(nextHours).padStart(2, '0')}:${String(nextMinutes).padStart(2, '0')}`);
        
        // T+60
        nextMinutes = minutes + 60;
        nextHours = hours;
        if (nextMinutes >= 60) {
            nextMinutes -= 60;
            nextHours = (nextHours + 1) % 24;
        }
        timeSlots.push(`${String(nextHours).padStart(2, '0')}:${String(nextMinutes).padStart(2, '0')}`);

        console.log(`🔓 Releasing table ${table_id} at ${date} for slots: ${timeSlots.join(', ')}`);

        // First, find any reservations linked to these assignments
        const { data: linkedAssignments, error: fetchError } = await supabase
            .from('table_assignments')
            .select('reservation_id')
            .eq('table_id', table_id)
            .eq('date', date)
            .in('time', timeSlots)
            .in('status', ['reserved', 'blocked', 'unavailable'])
            .not('reservation_id', 'is', null);

        const reservationIds = new Set();
        if (linkedAssignments) {
            linkedAssignments.forEach(a => {
                if (a.reservation_id) reservationIds.add(a.reservation_id);
            });
        }

        // Delete all assignments for this table at these 3 time slots on this date
        const { data: deletedAssignments, error: deleteError } = await supabase
            .from('table_assignments')
            .delete()
            .eq('table_id', table_id)
            .eq('date', date)
            .in('time', timeSlots)
            .in('status', ['reserved', 'blocked', 'unavailable'])
            .select();

        if (deleteError) {
            console.error('❌ Error releasing table assignments:', deleteError);
            throw deleteError;
        }

        const deletedCount = deletedAssignments?.length || 0;
        console.log(`✅ Released ${deletedCount} assignment(s) for table ${table_id}`);

        // Update linked reservations to "completed" status (free table = guests finished)
        let updatedReservations = 0;
        if (reservationIds.size > 0) {
            const { data: updated, error: updateError } = await supabase
                .from('reservations')
                .update({ status: 'completed' })
                .in('id', Array.from(reservationIds))
                .in('status', ['pending', 'confirmed', 'seated'])
                .select();

            if (updateError) {
                console.error('⚠️ Warning: Could not update reservation statuses:', updateError);
            } else {
                updatedReservations = updated?.length || 0;
                console.log(`✅ Updated ${updatedReservations} reservation(s) to "completed" status`);
            }
        }

        return json(200, {
            ok: true,
            success: true,
            deletedCount: deletedCount,
            updatedReservations: updatedReservations,
            message: `Table freed: ${deletedCount} assignment(s) released${updatedReservations > 0 ? `, ${updatedReservations} reservation(s) marked completed` : ''}`,
            timeSlots: timeSlots
        });

    } catch (err) {
        console.error('FUNCTION ERROR:', err);
        return json(500, {
            ok: false,
            success: false,
            error: String(err?.message || err),
            stack: err?.stack || null
        });
    }
};

