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
        const { table_id, reservation_id, date, time, status, notes, force_override } = data;

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

        // CRITICAL: If status is 'reserved', reservation_id is REQUIRED
        if (status === 'reserved' && !reservation_id) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ success: false, error: 'Missing required field: reservation_id (required for reserved status)' })
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

        // Get the 3 slots for this reservation (T, T+30, T+60)
        const VALID_TIMES = ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];
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

        // Check for conflicts (if status is 'reserved', check for overlapping reservations)
        // Admin can force-override conflicts
        if (status === 'reserved' && !force_override) {
            // Check all 3 slots for conflicts
            for (let i = 0; i < 3 && (timeIndex + i) < VALID_TIMES.length; i++) {
                const slotTime = VALID_TIMES[timeIndex + i];
                const slotDatetimeIso = `${date}T${slotTime}:00`;
                
                const { data: conflicts, error: conflictError } = await supabase
                    .from('table_assignments')
                    .select('id, reservation_id, status')
                    .eq('table_id', table_id)
                    .eq('datetime_iso', slotDatetimeIso)
                    .in('status', ['reserved', 'blocked', 'unavailable']);

                if (conflictError) throw conflictError;

                if (conflicts && conflicts.length > 0 && !conflicts.some(c => c.reservation_id === reservation_id)) {
                    return {
                        statusCode: 409,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        body: JSON.stringify({ success: false, error: `Table is already ${conflicts[0].status} for slot ${slotTime}` })
                    };
                }
            }
        }

        // CRITICAL: If status is 'reserved', validate reservation exists
        if (status === 'reserved' && reservation_id) {
            const { data: reservation, error: reservationError } = await supabase
                .from('reservations')
                .select('id, status')
                .eq('id', reservation_id)
                .single();

            if (reservationError || !reservation) {
                return {
                    statusCode: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({ success: false, error: 'Reservation not found' })
                };
            }
        }

        // If force_override is true (admin), delete existing conflicting assignments first
        if (force_override && status === 'reserved') {
            // Calculate the 3 time slots
            const [hours, minutes] = time.split(':').map(Number);
            const timeSlots = [time];
            
            let nextMinutes = minutes + 30;
            let nextHours = hours;
            if (nextMinutes >= 60) {
                nextMinutes -= 60;
                nextHours = (nextHours + 1) % 24;
            }
            timeSlots.push(`${String(nextHours).padStart(2, '0')}:${String(nextMinutes).padStart(2, '0')}`);
            
            nextMinutes = minutes + 60;
            nextHours = hours;
            if (nextMinutes >= 60) {
                nextMinutes -= 60;
                nextHours = (nextHours + 1) % 24;
            }
            timeSlots.push(`${String(nextHours).padStart(2, '0')}:${String(nextMinutes).padStart(2, '0')}`);

            // Delete conflicting assignments
            const { error: deleteError } = await supabase
                .from('table_assignments')
                .delete()
                .eq('table_id', table_id)
                .eq('date', date)
                .in('time', timeSlots)
                .in('status', ['reserved', 'blocked', 'unavailable']);

            if (deleteError) {
                console.error('Error deleting conflicting assignments:', deleteError);
                // Continue anyway - we'll create new assignments
            } else {
                console.log(`Admin override: Deleted conflicting assignments for table ${table_id} at ${date} ${time}`);
            }
        }

        // CRITICAL: If status is 'reserved', delete ALL existing assignments for this reservation for this date
        // This prevents leaving the previous table reserved when reassigning
        if (status === 'reserved' && reservation_id) {
            const { error: deleteError } = await supabase
                .from('table_assignments')
                .delete()
                .eq('reservation_id', reservation_id)
                .eq('date', date);

            if (deleteError) {
                console.error('Error deleting existing assignments for reservation:', deleteError);
                throw deleteError; // Fail if we can't clean up old assignments
            }
            console.log(`✅ Deleted all existing assignments for reservation ${reservation_id} on ${date} before reassigning`);
        }

        // Create assignments for all 3 slots (T, T+30, T+60)
        const assignmentInserts = [];
        
        // Calculate the 3 time slots
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
        
        timeSlots.forEach(slotTime => {
            const slotDatetimeIso = `${date}T${slotTime}:00`;
            assignmentInserts.push({
                table_id: table_id,
                reservation_id: reservation_id || null,
                date: date,
                time: slotTime,
                datetime_iso: slotDatetimeIso,
                duration_minutes: 30, // Each slot is 30 minutes
                status: status,
                source: 'manual',
                notes: notes || null
            });
        });

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

