/**
 * Netlify Function: Set Table Assignment
 * Hostess function to assign a table to a reservation or block a table
 */

const { createClient } = require('@supabase/supabase-js');

const RESERVATION_DURATION_MINUTES = 90;

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
        const { table_id, reservation_id, date, time, status, notes } = data;

        // Validate required fields
        if (!table_id || !date || !time || !status) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ success: false, error: 'Missing required fields: table_id, date, time, status' })
            };
        }

        // Validate status
        if (!['reserved', 'blocked', 'unavailable'].includes(status)) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ success: false, error: 'Invalid status. Must be: reserved, blocked, or unavailable' })
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

        // Build datetime_iso
        const datetimeIso = `${date}T${time}:00`;
        const startDatetime = new Date(datetimeIso);
        if (Number.isNaN(startDatetime.getTime())) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ success: false, error: 'Invalid date or time format' })
            };
        }

        // Check for conflicts (if status is 'reserved', check for overlapping reservations)
        if (status === 'reserved') {
            const endDatetime = new Date(startDatetime.getTime() + RESERVATION_DURATION_MINUTES * 60 * 1000);
            const { data: conflicts, error: conflictError } = await supabase
                .from('table_assignments')
                .select('id, reservation_id, status')
                .eq('table_id', table_id)
                .eq('status', 'reserved')
                .lte('datetime_iso', endDatetime.toISOString())
                .gte('datetime_iso', startDatetime.toISOString());

            if (conflictError) throw conflictError;

            if (conflicts && conflicts.length > 0 && !conflicts.some(c => c.reservation_id === reservation_id)) {
                return {
                    statusCode: 409,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({ success: false, error: 'Table is already reserved for this time slot' })
                };
            }
        }

        // Insert or update assignment
        const assignmentData = {
            table_id: table_id,
            reservation_id: reservation_id || null,
            date: date,
            time: time,
            datetime_iso: datetimeIso,
            duration_minutes: RESERVATION_DURATION_MINUTES,
            status: status,
            source: 'manual',
            notes: notes || null
        };

        // If reservation_id provided and status is 'reserved', update existing or insert
        if (reservation_id && status === 'reserved') {
            const { data: existing } = await supabase
                .from('table_assignments')
                .select('id')
                .eq('reservation_id', reservation_id)
                .eq('table_id', table_id)
                .eq('date', date)
                .eq('time', time)
                .single();

            if (existing) {
                // Update existing
                const { data: updated, error } = await supabase
                    .from('table_assignments')
                    .update(assignmentData)
                    .eq('id', existing.id)
                    .select()
                    .single();

                if (error) throw error;

                return {
                    statusCode: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({ success: true, assignment: updated })
                };
            }
        }

        // Insert new assignment
        const { data: inserted, error } = await supabase
            .from('table_assignments')
            .insert([assignmentData])
            .select()
            .single();

        if (error) throw error;

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ success: true, assignment: inserted })
        };

    } catch (error) {
        console.error('❌ Error setting assignment:', error);
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

