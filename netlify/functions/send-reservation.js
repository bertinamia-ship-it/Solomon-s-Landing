/**
 * Netlify Function: Send Reservation Email
 * 
 * Handles reservation submissions:
 * 1. Validates inputs
 * 2. Writes to Supabase database
 * 3. Sends email to restaurant via Resend
 * 4. Optionally sends confirmation email to customer
 * 
 * Environment Variables Required:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - RESEND_API_KEY
 * - RESERVATIONS_TO_EMAIL (recipient email, e.g., contact@solomonslanding.com.mx)
 * - RESEND_FROM_EMAIL (Resend verified sender, e.g., onboarding@resend.dev)
 */

const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify({ 
                success: false, 
                error: 'Method not allowed. Use POST.' 
            })
        };
    }

    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }

    try {
        // Parse request body
        const data = JSON.parse(event.body);

        // Validate required fields (accept both old and new field names for backward compatibility)
        const fullName = data.full_name || data.name;
        const partySize = data.party_size || data.guests;
        const requiredFields = ['email', 'phone', 'date', 'time'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (!fullName) missingFields.push('full_name/name');
        if (!partySize) missingFields.push('party_size/guests');
        
        if (missingFields.length > 0) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ 
                    success: false, 
                    error: `Missing required fields: ${missingFields.join(', ')}` 
                })
            };
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ 
                    success: false, 
                    error: 'Invalid email address' 
                })
            };
        }

        // Validate date format (YYYY-MM-DD)
        if (!data.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ 
                    success: false, 
                    error: 'Invalid date format. Expected YYYY-MM-DD' 
                })
            };
        }

        // Validate time format (HH:MM) and is valid reservation time
        const VALID_TIMES = ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];
        if (!data.time.match(/^\d{2}:\d{2}$/) || !VALID_TIMES.includes(data.time)) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ 
                    success: false, 
                    error: `Invalid time. Must be one of: ${VALID_TIMES.join(', ')}` 
                })
            };
        }

        // Server-side availability check (reuse check-availability logic)
        // Import the availability check logic directly
        const TOTAL_SEATS = 106;
        const RESERVATION_WINDOW_SLOTS = 3;
        const VALID_TIMES = ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];
        
        function getOccupiedSlots(time) {
            const timeIndex = VALID_TIMES.indexOf(time);
            if (timeIndex === -1) return [];
            const slots = [];
            for (let i = 0; i < RESERVATION_WINDOW_SLOTS && (timeIndex + i) < VALID_TIMES.length; i++) {
                slots.push(VALID_TIMES[timeIndex + i]);
            }
            return slots;
        }

        function calculateSeatsNeeded(partySize) {
            if (partySize <= 2) return 2;
            if (partySize <= 4) return 4;
            if (partySize <= 6) return 6;
            if (partySize <= 8) return 8;
            if (partySize <= 10) return 10;
            if (partySize <= 12) return 12;
            return Math.ceil(partySize / 4) * 4;
        }

        // Check availability server-side
        const occupiedSlots = getOccupiedSlots(data.time);
        const seatsNeeded = calculateSeatsNeeded(parseInt(partySize));

        // Initialize Supabase client early for availability check
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (supabaseUrl && supabaseKey) {
            const supabase = createClient(supabaseUrl, supabaseKey);
            
            for (const slotTime of occupiedSlots) {
                // Get existing reservations
                const { data: reservations } = await supabase
                    .from('reservations')
                    .select('party_size, status')
                    .eq('date', data.date)
                    .eq('time', slotTime)
                    .in('status', ['pending', 'confirmed']);

                let seatsUsed = 0;
                if (reservations) {
                    reservations.forEach(res => {
                        seatsUsed += calculateSeatsNeeded(res.party_size);
                    });
                }

                // Get blocked seats
                const { data: blocks } = await supabase
                    .from('blocked_slots')
                    .select('seats_blocked')
                    .eq('date', data.date)
                    .eq('time', slotTime);

                let seatsBlocked = 0;
                if (blocks) {
                    blocks.forEach(block => {
                        seatsBlocked += block.seats_blocked || 0;
                    });
                }

                const seatsAvailable = TOTAL_SEATS - seatsUsed - seatsBlocked;
                if (seatsAvailable < seatsNeeded) {
                    return {
                        statusCode: 400,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        body: JSON.stringify({ 
                            success: false, 
                            error: `No availability for ${slotTime}. Only ${seatsAvailable} seats available, need ${seatsNeeded}.` 
                        })
                    };
                }
            }
        }

        // Validate ISO datetime if provided, or build it
        let datetimeIso = null;
        if (data.datetime_iso) {
            const parsedDate = new Date(data.datetime_iso);
            if (Number.isNaN(parsedDate.getTime())) {
                return {
                    statusCode: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({ 
                        success: false, 
                        error: 'Invalid datetime_iso format' 
                    })
                };
            }
            datetimeIso = data.datetime_iso;
        } else {
            // Build ISO datetime from date and time
            datetimeIso = `${data.date}T${data.time}:00`;
        }

        // Validate date is today or in the future
        const reservationDate = new Date(data.date + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (reservationDate < today) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ 
                    success: false, 
                    error: 'Reservation date must be today or in the future' 
                })
            };
        }

        // Get environment variables for email
        const resendApiKey = process.env.RESEND_API_KEY;
        const emailRestaurant = process.env.RESERVATIONS_TO_EMAIL || process.env.EMAIL_RESTAURANT || 'contact@solomonslanding.com.mx';
        const emailFrom = process.env.RESEND_FROM_EMAIL || process.env.EMAIL_FROM;

        // Log environment variable status (without exposing secrets)
        console.log('🔍 Environment Variables Check:');
        console.log('  SUPABASE_URL:', !!supabaseUrl ? '✅ Set' : '❌ Missing');
        console.log('  SUPABASE_SERVICE_ROLE_KEY:', !!supabaseKey ? '✅ Set' : '❌ Missing');
        console.log('  RESEND_API_KEY:', !!resendApiKey ? '✅ Set' : '❌ Missing');
        console.log('  RESERVATIONS_TO_EMAIL:', !!process.env.RESERVATIONS_TO_EMAIL ? '✅ Set' : '❌ Missing');
        console.log('  RESEND_FROM_EMAIL:', !!process.env.RESEND_FROM_EMAIL ? '✅ Set' : '❌ Missing');
        console.log('  Using emailFrom:', emailFrom || 'NOT SET');
        console.log('  Using emailRestaurant:', emailRestaurant);

        // Validate environment variables
        if (!supabaseUrl || !supabaseKey) {
            console.error('❌ Supabase configuration missing');
            return {
                statusCode: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ 
                    success: false, 
                    error: 'Server configuration error. Please contact support.' 
                })
            };
        }

        if (!resendApiKey || !emailFrom) {
            console.error('❌ Resend configuration missing');
            console.error('  RESEND_API_KEY:', !!resendApiKey ? 'Set' : 'MISSING');
            console.error('  RESEND_FROM_EMAIL:', !!process.env.RESEND_FROM_EMAIL ? 'Set' : 'MISSING');
            console.error('  EMAIL_FROM (fallback):', !!process.env.EMAIL_FROM ? 'Set' : 'MISSING');
            return {
                statusCode: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ 
                    success: false, 
                    error: 'Email service configuration error. Please contact support.' 
                })
            };
        }

        // Format date for display (supabase already initialized above)
        const dateObj = new Date(data.date + 'T00:00:00');
        const formattedDate = dateObj.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        // Find available tables before creating reservation (inline logic)
        const RESERVATION_DURATION_MINUTES = 90;
        function getEndDatetime(dt) {
            const start = new Date(dt);
            const end = new Date(start.getTime() + RESERVATION_DURATION_MINUTES * 60 * 1000);
            return end.toISOString().slice(0, 16).replace('T', 'T');
        }

        function findTableCombination(partySize, availableTables) {
            // Prefer exact fit
            const exactFit = availableTables.find(t => t.capacity === partySize);
            if (exactFit) {
                return [{ table_id: exactFit.id, table_number: exactFit.table_number, capacity: exactFit.capacity }];
            }
            if (partySize <= 4) {
                const tables2 = availableTables.filter(t => t.capacity === 2).slice(0, 2);
                if (tables2.length === 2 && tables2[0].capacity * 2 >= partySize) {
                    return tables2.map(t => ({ table_id: t.id, table_number: t.table_number, capacity: t.capacity }));
                }
            }
            if (partySize <= 6) {
                const table6 = availableTables.find(t => t.capacity === 6);
                if (table6) return [{ table_id: table6.id, table_number: table6.table_number, capacity: table6.capacity }];
                const table4 = availableTables.find(t => t.capacity === 4);
                const table2 = availableTables.find(t => t.capacity === 2);
                if (table4 && table2 && table4.capacity + table2.capacity >= partySize) {
                    return [
                        { table_id: table4.id, table_number: table4.table_number, capacity: table4.capacity },
                        { table_id: table2.id, table_number: table2.table_number, capacity: table2.capacity }
                    ];
                }
            }
            if (partySize <= 8) {
                const tables4 = availableTables.filter(t => t.capacity === 4).slice(0, 2);
                if (tables4.length === 2) {
                    return tables4.map(t => ({ table_id: t.id, table_number: t.table_number, capacity: t.capacity }));
                }
            }
            if (partySize <= 10) {
                const table6 = availableTables.find(t => t.capacity === 6);
                const table4 = availableTables.find(t => t.capacity === 4);
                if (table6 && table4) {
                    return [
                        { table_id: table6.id, table_number: table6.table_number, capacity: table6.capacity },
                        { table_id: table4.id, table_number: table4.table_number, capacity: table4.capacity }
                    ];
                }
            }
            if (partySize <= 12) {
                const tables6 = availableTables.filter(t => t.capacity === 6).slice(0, 2);
                if (tables6.length === 2) {
                    return tables6.map(t => ({ table_id: t.id, table_number: t.table_number, capacity: t.capacity }));
                }
            }
            const tables4 = availableTables.filter(t => t.capacity === 4);
            const needed = Math.ceil(partySize / 4);
            if (tables4.length >= needed) {
                return tables4.slice(0, needed).map(t => ({ table_id: t.id, table_number: t.table_number, capacity: t.capacity }));
            }
            return null;
        }

        // Get all active tables
        const { data: allTables, error: tablesError } = await supabase
            .from('tables')
            .select('id, table_number, capacity')
            .eq('is_active', true)
            .order('capacity', { ascending: true });

        let tableAssignments = [];
        if (!tablesError && allTables && allTables.length > 0) {
            // Get tables that are already assigned during this time window
            const endDatetime = getEndDatetime(datetimeIso);
            const { data: assignments } = await supabase
                .from('table_assignments')
                .select('table_id, datetime_iso')
                .eq('status', 'active')
                .gte('datetime_iso', datetimeIso)
                .lt('datetime_iso', endDatetime);

            // Get list of occupied table IDs
            const occupiedTableIds = new Set();
            if (assignments) {
                assignments.forEach(assignment => {
                    const assignmentStart = new Date(assignment.datetime_iso);
                    const assignmentEnd = new Date(assignmentStart.getTime() + RESERVATION_DURATION_MINUTES * 60 * 1000);
                    const ourStart = new Date(datetimeIso);
                    const ourEnd = new Date(endDatetime);
                    if (assignmentStart < ourEnd && assignmentEnd > ourStart) {
                        occupiedTableIds.add(assignment.table_id);
                    }
                });
            }

            // Filter out occupied tables
            const availableTables = allTables.filter(t => !occupiedTableIds.has(t.id));

            // Find best table combination
            const tableCombination = findTableCombination(parseInt(partySize), availableTables);
            if (!tableCombination) {
                return {
                    statusCode: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({ 
                        success: false, 
                        error: 'No available tables for this party size and time' 
                    })
                };
            }
            tableAssignments = tableCombination;
        }

        // Insert reservation into database (datetimeIso already validated above)
        const { data: reservation, error: dbError } = await supabase
            .from('reservations')
            .insert([
                {
                    name: fullName,
                    email: data.email,
                    phone: data.phone,
                    date: data.date,
                    time: data.time,
                    party_size: parseInt(partySize),
                    staying_place: data.staying_place || null,
                    notes: data.notes || null,
                    language: data.language || 'en',
                    source: data.source || 'web',
                    status: 'pending',
                    payment_intent_id: data.payment_intent_id || null,
                    datetime_iso: datetimeIso
                }
            ])
            .select()
            .single();

        if (dbError) {
            console.error('❌ Database error:', dbError);
            return {
                statusCode: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ 
                    success: false, 
                    error: 'Failed to save reservation. Please try again.' 
                })
            };
        }

        console.log('✅ Reservation saved to database:', reservation.id);

        // Create table assignments
        if (tableAssignments.length > 0) {
            const assignmentInserts = tableAssignments.map(table => ({
                reservation_id: reservation.id,
                table_id: table.table_id,
                datetime_iso: datetimeIso,
                duration_minutes: 90,
                source: data.source || 'web',
                status: 'active'
            }));

            const { error: assignmentError } = await supabase
                .from('table_assignments')
                .insert(assignmentInserts);

            if (assignmentError) {
                console.error('❌ Error creating table assignments:', assignmentError);
                // Don't fail the reservation, but log the error
            } else {
                console.log('✅ Table assignments created:', assignmentInserts.length);
            }
        }

        if (dbError) {
            console.error('❌ Database error:', dbError);
            return {
                statusCode: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ 
                    success: false, 
                    error: 'Failed to save reservation. Please try again.' 
                })
            };
        }

        console.log('✅ Reservation saved to database:', reservation.id);

        // Initialize Resend
        const resend = new Resend(resendApiKey);

        // Send email to restaurant
        const restaurantEmailHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #004A9F, #0066CC); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                    .info-row { margin: 15px 0; padding: 10px; background: white; border-radius: 5px; }
                    .label { font-weight: bold; color: #004A9F; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>New Reservation Request</h2>
                    </div>
                    <div class="content">
                        <div class="info-row">
                            <span class="label">Reservation ID:</span> ${reservation.id}
                        </div>
                        <div class="info-row">
                            <span class="label">Customer Name:</span> ${fullName}
                        </div>
                        <div class="info-row">
                            <span class="label">Email:</span> ${data.email}
                        </div>
                        <div class="info-row">
                            <span class="label">Phone:</span> ${data.phone}
                        </div>
                        <div class="info-row">
                            <span class="label">Date:</span> ${formattedDate}
                        </div>
                        <div class="info-row">
                            <span class="label">Time:</span> ${data.time}
                        </div>
                        <div class="info-row">
                            <span class="label">Party Size:</span> ${partySize} guests
                        </div>
                        ${data.staying_place ? `<div class="info-row"><span class="label">Staying:</span> ${data.staying_place}</div>` : ''}
                        ${data.notes ? `<div class="info-row"><span class="label">Special Requests:</span> ${data.notes}</div>` : ''}
                        <div class="info-row">
                            <span class="label">Language:</span> ${data.language === 'es' ? 'Español' : 'English'}
                        </div>
                        <div class="info-row">
                            <span class="label">Status:</span> Pending
                        </div>
                    </div>
                    <div class="footer">
                        <p>This is an automated email from Solomon's Landing reservation system.</p>
                        <p>Reservation ID: ${reservation.id}</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const restaurantEmailText = `
New Reservation Request

Reservation ID: ${reservation.id}
Customer Name: ${fullName}
Email: ${data.email}
Phone: ${data.phone}
Date: ${formattedDate}
Time: ${data.time}
Party Size: ${partySize} guests
${data.staying_place ? `Staying: ${data.staying_place}` : ''}
${data.notes ? `Special Requests: ${data.notes}` : ''}
Language: ${data.language === 'es' ? 'Español' : 'English'}
Status: Pending
        `.trim();

        try {
            console.log('📧 Sending restaurant email...');
            console.log('  From:', emailFrom);
            console.log('  To:', emailRestaurant);
            console.log('  Subject: New Reservation -', fullName);
            
            const emailResult = await resend.emails.send({
                from: emailFrom,
                to: emailRestaurant,
                replyTo: data.email,
                subject: `New Reservation - ${fullName} - ${formattedDate} at ${data.time}`,
                html: restaurantEmailHTML,
                text: restaurantEmailText
            });

            console.log('✅ Restaurant email sent successfully');
            console.log('  Email ID:', emailResult.data?.id);
            console.log('  Response:', JSON.stringify(emailResult, null, 2));
        } catch (emailError) {
            console.error('❌ Error sending restaurant email:', emailError);
            console.error('  Error message:', emailError.message);
            console.error('  Error details:', JSON.stringify(emailError, null, 2));
            // Don't fail the request if email fails - reservation is already saved
        }

        // Send confirmation email to customer (optional but recommended)
        const customerEmailHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #004A9F, #0066CC); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                    .info-row { margin: 15px 0; padding: 10px; background: white; border-radius: 5px; }
                    .label { font-weight: bold; color: #004A9F; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Reservation Request Received</h2>
                    </div>
                    <div class="content">
                        <p>Dear ${fullName},</p>
                        <p>Thank you for your reservation request at Solomon's Landing!</p>
                        <div class="info-row">
                            <span class="label">Reservation ID:</span> ${reservation.id}
                        </div>
                        <div class="info-row">
                            <span class="label">Date:</span> ${formattedDate}
                        </div>
                        <div class="info-row">
                            <span class="label">Time:</span> ${data.time}
                        </div>
                        <div class="info-row">
                            <span class="label">Party Size:</span> ${partySize} guests
                        </div>
                        <p style="margin-top: 20px;">We have received your request and will confirm your reservation within 2 hours. You will receive a confirmation email once your table is confirmed.</p>
                        <p>If you have any questions, please contact us at +52 624 219 3228 or reply to this email.</p>
                    </div>
                    <div class="footer">
                        <p>Solomon's Landing Restaurant<br>Marina Cabo San Lucas</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const customerEmailText = `
Reservation Request Received

Dear ${fullName},

Thank you for your reservation request at Solomon's Landing!

Reservation ID: ${reservation.id}
Date: ${formattedDate}
Time: ${data.time}
Party Size: ${partySize} guests

We have received your request and will confirm your reservation within 2 hours. You will receive a confirmation email once your table is confirmed.

If you have any questions, please contact us at +52 624 219 3228 or reply to this email.

Solomon's Landing Restaurant
Marina Cabo San Lucas
        `.trim();

        try {
            console.log('📧 Sending customer confirmation email...');
            console.log('  From:', emailFrom);
            console.log('  To:', data.email);
            console.log('  Subject: Reservation Request Received');
            
            const customerEmailResult = await resend.emails.send({
                from: emailFrom,
                to: data.email,
                subject: `Reservation Request Received - ${formattedDate} at ${data.time}`,
                html: customerEmailHTML,
                text: customerEmailText
            });

            console.log('✅ Customer confirmation email sent successfully');
            console.log('  Email ID:', customerEmailResult.data?.id);
            console.log('  Response:', JSON.stringify(customerEmailResult, null, 2));
        } catch (emailError) {
            console.error('❌ Error sending customer email:', emailError);
            console.error('  Error message:', emailError.message);
            console.error('  Error details:', JSON.stringify(emailError, null, 2));
            // Don't fail the request if email fails
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                success: true, 
                reservationId: reservation.id,
                message: 'Reservation request received successfully' 
            })
        };

    } catch (error) {
        console.error('❌ Error processing reservation:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                success: false, 
                error: error.message || 'Failed to process reservation. Please try again.' 
            })
        };
    }
};
