/**
 * Netlify Function: Cancel Reservation
 * Cancels a reservation and releases all table assignments
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

        // Get existing reservation
        const { data: existingReservation, error: fetchError } = await supabase
            .from('reservations')
            .select('*')
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

        // Delete all table assignments for this reservation (releases all 3 slots)
        const { data: deletedAssignments, error: deleteAssignmentsError } = await supabase
            .from('table_assignments')
            .delete()
            .eq('reservation_id', id)
            .select();

        if (deleteAssignmentsError) {
            console.error('❌ Error deleting table assignments:', deleteAssignmentsError);
            throw deleteAssignmentsError;
        }

        const deletedCount = deletedAssignments?.length || 0;
        console.log(`✅ Released ${deletedCount} table assignment(s) for reservation ${id}`);

        // Update reservation status to cancelled
        const { data: updatedReservation, error: updateError } = await supabase
            .from('reservations')
            .update({ status: 'cancelled' })
            .eq('id', id)
            .select()
            .single();

        if (updateError) throw updateError;

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                success: true, 
                ok: true,
                reservation: updatedReservation,
                releasedAssignments: deletedCount,
                message: `Reservation cancelled and ${deletedCount} table assignment(s) released`
            })
        };

    } catch (error) {
        console.error('❌ Error cancelling reservation:', error);
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

