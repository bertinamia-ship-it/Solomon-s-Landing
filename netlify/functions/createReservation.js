/**
 * Netlify Function: Create Reservation
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
 * - EMAIL_RESTAURANT (contact@solomonslanding.com.mx)
 * - EMAIL_FROM (Resend verified sender)
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

        // Validate required fields
        const requiredFields = ['name', 'email', 'phone', 'date', 'time', 'guests'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
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

        // Validate date is in the future
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
                    error: 'Reservation date must be in the future' 
                })
            };
        }

        // Get environment variables
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const resendApiKey = process.env.RESEND_API_KEY;
        const emailRestaurant = process.env.EMAIL_RESTAURANT || 'contact@solomonslanding.com.mx';
        const emailFrom = process.env.EMAIL_FROM;

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

        // Initialize Supabase client
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Format date for display
        const dateObj = new Date(data.date + 'T00:00:00');
        const formattedDate = dateObj.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        // Insert reservation into database
        const { data: reservation, error: dbError } = await supabase
            .from('reservations')
            .insert([
                {
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    date: data.date,
                    time: data.time,
                    party_size: parseInt(data.guests),
                    notes: data.notes || null,
                    language: data.language || 'en',
                    source: 'web',
                    status: 'pending'
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
                            <span class="label">Customer Name:</span> ${data.name}
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
                            <span class="label">Party Size:</span> ${data.guests} guests
                        </div>
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
Customer Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Date: ${formattedDate}
Time: ${data.time}
Party Size: ${data.guests} guests
${data.notes ? `Special Requests: ${data.notes}` : ''}
Language: ${data.language === 'es' ? 'Español' : 'English'}
Status: Pending
        `.trim();

        try {
            const emailResult = await resend.emails.send({
                from: emailFrom,
                to: emailRestaurant,
                replyTo: data.email,
                subject: `New Reservation - ${data.name} - ${formattedDate} at ${data.time}`,
                html: restaurantEmailHTML,
                text: restaurantEmailText
            });

            console.log('✅ Restaurant email sent:', emailResult.data?.id);
        } catch (emailError) {
            console.error('❌ Error sending restaurant email:', emailError);
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
                        <p>Dear ${data.name},</p>
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
                            <span class="label">Party Size:</span> ${data.guests} guests
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

Dear ${data.name},

Thank you for your reservation request at Solomon's Landing!

Reservation ID: ${reservation.id}
Date: ${formattedDate}
Time: ${data.time}
Party Size: ${data.guests} guests

We have received your request and will confirm your reservation within 2 hours. You will receive a confirmation email once your table is confirmed.

If you have any questions, please contact us at +52 624 219 3228 or reply to this email.

Solomon's Landing Restaurant
Marina Cabo San Lucas
        `.trim();

        try {
            const customerEmailResult = await resend.emails.send({
                from: emailFrom,
                to: data.email,
                subject: `Reservation Request Received - ${formattedDate} at ${data.time}`,
                html: customerEmailHTML,
                text: customerEmailText
            });

            console.log('✅ Customer confirmation email sent:', customerEmailResult.data?.id);
        } catch (emailError) {
            console.error('❌ Error sending customer email:', emailError);
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

