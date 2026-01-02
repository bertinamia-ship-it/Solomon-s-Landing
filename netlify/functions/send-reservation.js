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
        // Get environment variables and initialize Supabase client ONCE at the start
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        
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

        // Initialize Supabase client once at function scope
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Parse request body
        const data = JSON.parse(event.body);

        // Determine language (default to 'en' if not provided)
        const headerLang = event.headers?.['accept-language']?.slice(0, 2);
        const userLang = (data.lang || data.language || headerLang || 'en').toLowerCase();
        const langCode = userLang === 'es' ? 'es' : 'en';
        const isSpanish = langCode === 'es';

        // Language translations object
        const lang = {
            newReservation: isSpanish ? 'Nueva Reservación' : 'New Reservation',
            confirmationCode: isSpanish ? 'Código de Confirmación' : 'Confirmation Code',
            customerName: isSpanish ? 'Nombre del Cliente' : 'Customer Name',
            date: isSpanish ? 'Fecha' : 'Date',
            time: isSpanish ? 'Hora' : 'Time',
            partySize: isSpanish ? 'Comensales' : 'Party Size',
            assignedTables: isSpanish ? 'Mesas Asignadas' : 'Assigned Tables',
            staying: isSpanish ? 'Hospedaje' : 'Staying',
            specialRequests: isSpanish ? 'Solicitudes Especiales' : 'Special Requests',
            paymentHold: isSpanish ? 'Depósito Temporal' : 'Payment Hold',
            yes: isSpanish ? 'Sí' : 'Yes',
            language: isSpanish ? 'Idioma' : 'Language',
            status: isSpanish ? 'Estado' : 'Status',
            reservationReceived: isSpanish ? 'Solicitud de Reservación Recibida' : 'Reservation Request Received',
            thankYou: isSpanish ? 'Gracias por tu solicitud de reservación en Solomon\'s Landing. Hemos recibido tu solicitud y confirmaremos tu reservación en las próximas 2 horas.' : 'Thank you for your reservation request at Solomon\'s Landing. We have received your request and will confirm your reservation within 2 hours.',
            confirmationNote: isSpanish ? 'Recibirás un correo de confirmación una vez que tu mesa sea confirmada.' : 'You will receive a confirmation email once your table is confirmed.',
            questions: isSpanish ? 'Si tienes alguna pregunta, por favor contáctanos al +52 624 219 3228 o responde a este correo.' : 'If you have any questions, please contact us at +52 624 219 3228 or reply to this email.'
        };

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
        // VALID_TIMES already declared above, reuse it
        
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

        // Check availability using supabase (already initialized above)
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

        // Validate email environment variables
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
        // Use America/Mazatlan timezone (same as Los Cabos)
        const dateObj = new Date(data.date + 'T00:00:00');
        const formattedDate = dateObj.toLocaleDateString(langCode === 'es' ? 'es-MX' : 'en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            timeZone: 'America/Mazatlan'
        });

        // Find available tables before creating reservation (inline logic)
        const RESERVATION_DURATION_MINUTES = 90;
        function getEndDatetime(dt) {
            const start = new Date(dt);
            const end = new Date(start.getTime() + RESERVATION_DURATION_MINUTES * 60 * 1000);
            return end.toISOString().slice(0, 16).replace('T', 'T');
        }

        function findTableCombination(partySize, availableTables) {
            // Helper to map table to result format
            const mapTable = (t) => ({
                table_id: t.id,
                table_number: t.table_number,
                capacity: t.capacity,
                name: t.name,
                area: t.area
            });

            // Prefer exact fit
            const exactFit = availableTables.find(t => t.capacity === partySize);
            if (exactFit) {
                return [mapTable(exactFit)];
            }
            if (partySize <= 4) {
                const tables2 = availableTables.filter(t => t.capacity === 2).slice(0, 2);
                if (tables2.length === 2 && tables2[0].capacity * 2 >= partySize) {
                    return tables2.map(mapTable);
                }
            }
            if (partySize <= 6) {
                const table6 = availableTables.find(t => t.capacity === 6);
                if (table6) return [mapTable(table6)];
                const table4 = availableTables.find(t => t.capacity === 4);
                const table2 = availableTables.find(t => t.capacity === 2);
                if (table4 && table2 && table4.capacity + table2.capacity >= partySize) {
                    return [mapTable(table4), mapTable(table2)];
                }
            }
            if (partySize <= 8) {
                const tables4 = availableTables.filter(t => t.capacity === 4).slice(0, 2);
                if (tables4.length === 2) {
                    return tables4.map(mapTable);
                }
            }
            if (partySize <= 10) {
                const table6 = availableTables.find(t => t.capacity === 6);
                const table4 = availableTables.find(t => t.capacity === 4);
                if (table6 && table4) {
                    return [mapTable(table6), mapTable(table4)];
                }
            }
            if (partySize <= 12) {
                const tables6 = availableTables.filter(t => t.capacity === 6).slice(0, 2);
                if (tables6.length === 2) {
                    return tables6.map(mapTable);
                }
            }
            const tables4 = availableTables.filter(t => t.capacity === 4);
            const needed = Math.ceil(partySize / 4);
            if (tables4.length >= needed) {
                return tables4.slice(0, needed).map(mapTable);
            }
            return null;
        }

        // Get all active tables
        const { data: allTables, error: tablesError } = await supabase
            .from('tables')
            .select('id, name, table_number, area, capacity')
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

        // Generate confirmation code (6-8 chars: uppercase letters + numbers)
        function generateConfirmationCode() {
            const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars (0, O, I, 1)
            let code = '';
            for (let i = 0; i < 7; i++) {
                code += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return code;
        }
        const confirmationCode = generateConfirmationCode();

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
                    language: langCode,
                    source: data.source || 'web',
                    status: 'pending',
                    payment_intent_id: data.payment_intent_id || null,
                    datetime_iso: datetimeIso,
                    confirmation_code: confirmationCode
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
                date: data.date,
                time: data.time,
                datetime_iso: datetimeIso,
                duration_minutes: 90,
                table_id: table.table_id,
                reservation_id: reservation.id,
                source: data.source || 'web',
                status: 'active',
                notes: null
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

        // Get assigned table names for email
        let assignedTablesText = 'Not assigned yet';
        if (tableAssignments.length > 0) {
            assignedTablesText = tableAssignments.map(t => `${t.name || `Table ${t.table_number}`} (${t.area})`).join(', ');
        }

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
${lang.newReservation}

${lang.confirmationCode}: ${confirmationCode}
${lang.customerName}: ${fullName}
Email: ${data.email}
Phone: ${data.phone}
${lang.date}: ${formattedDate}
${lang.time}: ${data.time}
${lang.partySize}: ${partySize} ${isSpanish ? 'comensales' : 'guests'}
${lang.assignedTables}: ${assignedTablesText}
${data.staying_place ? `${lang.staying}: ${data.staying_place}` : ''}
${data.notes ? `${lang.specialRequests}: ${data.notes}` : ''}
${data.payment_intent_id ? `${lang.paymentHold}: ${lang.yes}` : ''}
${lang.language}: ${data.language === 'es' ? 'Español' : 'English'}
${lang.status}: Pending

Reservation ID: ${reservation.id}
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
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
                    .email-wrapper { max-width: 600px; margin: 0 auto; background: white; }
                    .header { background: linear-gradient(135deg, #004A9F 0%, #0066CC 100%); color: white; padding: 40px 20px; text-align: center; }
                    .logo { font-size: 28px; font-weight: 700; margin-bottom: 10px; letter-spacing: 1px; }
                    .header-subtitle { font-size: 14px; opacity: 0.9; }
                    .content { padding: 40px 30px; background: #ffffff; }
                    .code-box { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 25px; border-radius: 12px; text-align: center; margin: 20px 0; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3); }
                    .code-label { font-size: 12px; color: #78350f; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
                    .code-value { font-size: 36px; font-weight: bold; color: #ffffff; font-family: 'Courier New', monospace; letter-spacing: 4px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); }
                    .info-row { margin: 18px 0; padding: 15px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #004A9F; }
                    .label { font-weight: 600; color: #004A9F; display: inline-block; min-width: 140px; font-size: 14px; }
                    .value { color: #1e293b; font-size: 14px; }
                    .greeting { font-size: 16px; margin-bottom: 20px; color: #1e293b; }
                    .message { margin: 20px 0; color: #4b5563; line-height: 1.8; }
                    .footer { text-align: center; padding: 30px; background: #f9fafb; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
                    .footer p { margin: 5px 0; }
                    .contact-info { margin-top: 25px; padding: 20px; background: #eff6ff; border-radius: 8px; text-align: center; }
                    .contact-info strong { color: #004A9F; }
                </style>
            </head>
            <body>
                <div class="email-wrapper">
                    <div class="header">
                        <div class="logo">SOLOMON'S LANDING</div>
                        <div class="header-subtitle">${lang.reservationReceived}</div>
                    </div>
                    <div class="content">
                        <div class="greeting">${isSpanish ? 'Estimado/a' : 'Dear'} ${fullName},</div>
                        <div class="message">${lang.thankYou}</div>
                        <div class="code-box">
                            <div class="code-label">${lang.confirmationCode}</div>
                            <div class="code-value">${confirmationCode}</div>
                        </div>
                        <div class="info-row">
                            <span class="label">${lang.date}:</span>
                            <span class="value">${formattedDate}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">${lang.time}:</span>
                            <span class="value">${data.time}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">${lang.partySize}:</span>
                            <span class="value">${partySize} ${isSpanish ? 'comensales' : 'guests'}</span>
                        </div>
                        ${assignedTablesText !== 'Not assigned yet' ? `<div class="info-row"><span class="label">${lang.assignedTables}:</span><span class="value">${assignedTablesText}</span></div>` : ''}
                        ${data.staying_place ? `<div class="info-row"><span class="label">${lang.staying}:</span><span class="value">${data.staying_place}</span></div>` : ''}
                        ${data.notes ? `<div class="info-row"><span class="label">${lang.specialRequests}:</span><span class="value">${data.notes}</span></div>` : ''}
                        <div class="message">${lang.confirmationNote}</div>
                        <div class="contact-info">
                            <strong>${isSpanish ? '¿Preguntas?' : 'Questions?'}</strong><br>
                            ${lang.questions}
                        </div>
                    </div>
                    <div class="footer">
                        <p><strong>Solomon's Landing Restaurant</strong></p>
                        <p>Marina Cabo San Lucas, Baja California Sur, México</p>
                        <p>+52 624 219 3228</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const customerEmailText = `
${lang.reservationReceived}

${isSpanish ? 'Estimado/a' : 'Dear'} ${fullName},

${lang.thankYou}

${lang.confirmationCode}: ${confirmationCode}
${lang.date}: ${formattedDate}
${lang.time}: ${data.time}
${lang.partySize}: ${partySize} ${isSpanish ? 'comensales' : 'guests'}
${assignedTablesText !== 'Not assigned yet' ? `${lang.assignedTables}: ${assignedTablesText}` : ''}
${data.staying_place ? `${lang.staying}: ${data.staying_place}` : ''}
${data.notes ? `${lang.specialRequests}: ${data.notes}` : ''}

${lang.confirmationNote}

${lang.questions}

Solomon's Landing Restaurant
Marina Cabo San Lucas, Baja California Sur, México
+52 624 219 3228
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
