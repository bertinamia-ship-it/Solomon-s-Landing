/**
 * Netlify Function: Block Table
 * Blocks a table for a time range (applies to all 3 slots automatically)
 */

const { createClient } = require('@supabase/supabase-js');

const VALID_TIMES = ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];

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
        const { table_id, date, time, status, notes } = data;

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
        if (!['blocked', 'unavailable'].includes(status)) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ success: false, error: 'Invalid status. Must be: blocked or unavailable' })
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

        // Get the 3 slots for this time
        const timeIndex = VALID_TIMES.indexOf(time);
        
        if (timeIndex === -1) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ success: false, error: 'Invalid time slot' })
            };
        }

        // Check for conflicts (can't block if already reserved)
        for (let i = 0; i < 3 && (timeIndex + i) < VALID_TIMES.length; i++) {
            const slotTime = VALID_TIMES[timeIndex + i];
            const slotDatetimeIso = `${date}T${slotTime}:00`;
            
            const { data: conflicts, error: conflictError } = await supabase
                .from('table_assignments')
                .select('id, reservation_id, status')
                .eq('table_id', table_id)
                .eq('datetime_iso', slotDatetimeIso)
                .eq('status', 'reserved');

            if (conflictError) throw conflictError;

            if (conflicts && conflicts.length > 0) {
                return {
                    statusCode: 409,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({ success: false, error: `Table is already reserved for slot ${slotTime}. Cancel the reservation first.` })
                };
            }
        }

        // Delete existing blocks for this table/time (replace them)
        await supabase
            .from('table_assignments')
            .delete()
            .eq('table_id', table_id)
            .eq('date', date)
            .in('time', VALID_TIMES.slice(timeIndex, timeIndex + 3))
            .in('status', ['blocked', 'unavailable']);

        // Create assignments for all 3 slots
        const assignmentInserts = [];
        for (let i = 0; i < 3 && (timeIndex + i) < VALID_TIMES.length; i++) {
            const slotTime = VALID_TIMES[timeIndex + i];
            const slotDatetimeIso = `${date}T${slotTime}:00`;
            
            assignmentInserts.push({
                table_id: table_id,
                reservation_id: null, // Blocks don't have reservation_id
                date: date,
                time: slotTime,
                datetime_iso: slotDatetimeIso,
                duration_minutes: 30,
                status: status,
                source: 'manual',
                notes: notes || `Table ${status}`
            });
        }

        // Insert all assignments
        const { data: inserted, error } = await supabase
            .from('table_assignments')
            .insert(assignmentInserts)
            .select();

        if (error) throw error;

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ success: true, assignments: inserted, count: inserted.length })
        };

    } catch (error) {
        console.error('❌ Error blocking table:', error);
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

