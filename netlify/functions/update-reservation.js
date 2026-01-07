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
        const { id, name, phone, time, party_size, notes, status, table_ids } = data;

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
            if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
                return {
                    statusCode: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({ success: false, error: 'Invalid status. Must be: pending, confirmed, or cancelled' })
                };
            }
            updateData.status = status;
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
            const timeIndex = VALID_TIMES.indexOf(finalTime);

            // Delete existing assignments
            await supabase
                .from('table_assignments')
                .delete()
                .eq('reservation_id', id);

            // Create new assignments if table_ids provided
            if (table_ids && Array.isArray(table_ids) && table_ids.length > 0 && timeIndex !== -1) {
                const assignmentInserts = [];
                
                table_ids.forEach(tableId => {
                    for (let i = 0; i < 3 && (timeIndex + i) < VALID_TIMES.length; i++) {
                        const slotTime = VALID_TIMES[timeIndex + i];
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
                    }
                });

                if (assignmentInserts.length > 0) {
                    const { error: assignmentError } = await supabase
                        .from('table_assignments')
                        .insert(assignmentInserts);

                    if (assignmentError) {
                        console.error('❌ Error creating table assignments:', assignmentError);
                    }
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

