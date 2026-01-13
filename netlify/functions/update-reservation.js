/**
 * Netlify Function: Update Reservation
 * Allows hostess/admin to edit reservation details and reassign tables
 */

const { createClient } = require('@supabase/supabase-js');

const RESERVATION_DURATION_MINUTES = 90;
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
        const { id, name, phone, time, party_size, notes, status, table_ids, force_override } = data;

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

        // Build update object
        const updateData = {};
        if (name !== undefined && name.trim()) {
            updateData.name = name.trim();
        }
        if (phone !== undefined && phone.trim()) {
            updateData.phone = phone.trim();
        }
        if (time !== undefined) {
            if (!VALID_TIMES.includes(time)) {
                return {
                    statusCode: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({ success: false, error: 'Invalid time slot' })
                };
            }
            updateData.time = time;
            updateData.datetime_iso = `${existingReservation.date}T${time}:00`;
        }
        if (party_size !== undefined) {
            updateData.party_size = parseInt(party_size);
        }
        if (notes !== undefined) {
            updateData.notes = notes;
        }
        if (status !== undefined) {
            const validStatuses = ['pending', 'confirmed', 'seated', 'completed', 'no_show', 'cancelled'];
            if (!validStatuses.includes(status)) {
                return {
                    statusCode: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({ success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` })
                };
            }
            updateData.status = status;
            
            // If status changes to completed/cancelled/no_show, release table assignments (REQUIRED)
            const releaseStatuses = ['completed', 'cancelled', 'no_show'];
            if (releaseStatuses.includes(status) && existingReservation.status !== status) {
                const { error: deleteAssignmentsError } = await supabase
                    .from('table_assignments')
                    .delete()
                    .eq('reservation_id', id);
                
                if (deleteAssignmentsError) {
                    console.error('❌ Error releasing assignments on status change:', deleteAssignmentsError);
                    // CRITICAL: Throw and fail the request if assignment deletion fails
                    throw deleteAssignmentsError;
                } else {
                    console.log(`✅ Released table assignments for reservation ${id} (status: ${status})`);
                }
            }
        }

        // Update reservation
        const { data: updatedReservation, error: updateError } = await supabase
            .from('reservations')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (updateError) throw updateError;

        // If time changed or table_ids provided, update table assignments
        if (time !== undefined || table_ids !== undefined) {
            const finalTime = time || existingReservation.time;
            const finalDate = existingReservation.date;

            // Delete existing assignments FIRST (all 3 slots)
            const { error: deleteError } = await supabase
                .from('table_assignments')
                .delete()
                .eq('reservation_id', id);

            if (deleteError) {
                console.error('❌ Error deleting old assignments:', deleteError);
                throw deleteError;
            }

            // Create new assignments if table_ids provided (all 3 slots: T, T+30, T+60)
            if (table_ids && Array.isArray(table_ids) && table_ids.length > 0) {
                const assignmentInserts = [];
                
                // Calculate the 3 time slots (T, T+30, T+60)
                const [hours, minutes] = finalTime.split(':').map(Number);
                const timeSlots = [finalTime];
                
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
                
                // If force_override (admin), delete conflicting assignments for these tables first
                if (force_override) {
                    for (const tableId of table_ids) {
                        const { error: deleteConflictError } = await supabase
                            .from('table_assignments')
                            .delete()
                            .eq('table_id', tableId)
                            .eq('date', finalDate)
                            .in('time', timeSlots)
                            .in('status', ['reserved', 'blocked', 'unavailable']);

                        if (deleteConflictError) {
                            console.error(`Error deleting conflicting assignments for table ${tableId}:`, deleteConflictError);
                        } else {
                            console.log(`Admin override: Deleted conflicting assignments for table ${tableId} at ${finalDate} ${finalTime}`);
                        }
                    }
                }

                table_ids.forEach(tableId => {
                    timeSlots.forEach(slotTime => {
                        const slotDatetimeIso = `${finalDate}T${slotTime}:00`;
                        assignmentInserts.push({
                            date: finalDate,
                            time: slotTime,
                            datetime_iso: slotDatetimeIso,
                            duration_minutes: 30,
                            table_id: tableId,
                            reservation_id: id,
                            source: existingReservation.source || 'manual',
                            status: 'reserved',
                            notes: null
                        });
                    });
                });

                if (assignmentInserts.length > 0) {
                    const { error: assignmentError } = await supabase
                        .from('table_assignments')
                        .insert(assignmentInserts);

                    if (assignmentError) {
                        console.error('❌ Error creating table assignments:', assignmentError);
                        throw assignmentError; // Fail if we can't create new assignments
                    }
                    console.log(`✅ Created ${assignmentInserts.length} new assignment(s) for reservation ${id}`);
                }
            }
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ success: true, reservation: updatedReservation })
        };

    } catch (error) {
        console.error('❌ Error updating reservation:', error);
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

