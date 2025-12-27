/**
 * Netlify Function: Send Reservation Email
 * 
 * Sends reservation emails to contact@solomonslanding.com.mx
 * Uses Nodemailer with SMTP (Gmail/Google Workspace/Zoho/Outlook)
 * 
 * Environment Variables Required:
 * - SMTP_HOST (e.g., smtp.gmail.com)
 * - SMTP_PORT (e.g., 587)
 * - SMTP_USER (email address)
 * - SMTP_PASS (app password or account password)
 * - RESERVATION_EMAIL (contact@solomonslanding.com.mx)
 */

const nodemailer = require('nodemailer');

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

        // Get environment variables
        const smtpHost = process.env.SMTP_HOST;
        const smtpPort = parseInt(process.env.SMTP_PORT || '587');
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;
        const reservationEmail = process.env.RESERVATION_EMAIL || 'contact@solomonslanding.com.mx';

        // Validate SMTP configuration
        if (!smtpHost || !smtpUser || !smtpPass) {
            console.error('❌ SMTP configuration missing');
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

        // Format date for display
        const dateObj = new Date(data.date + 'T00:00:00');
        const formattedDate = dateObj.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        // Create transporter
        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465,
            auth: {
                user: smtpUser,
                pass: smtpPass
            }
        });

        // Verify connection
        await transporter.verify();

        // Build email HTML
        const emailHTML = `
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
                        ${data.confirmationCode ? `<div class="info-row"><span class="label">Confirmation Code:</span> ${data.confirmationCode}</div>` : ''}
                        ${data.confirmUrl ? `<div class="info-row"><span class="label">Confirmation Link:</span> <a href="${data.confirmUrl}">${data.confirmUrl}</a></div>` : ''}
                        ${data.customerLanguage ? `<div class="info-row"><span class="label">Customer Language:</span> ${data.customerLanguage}</div>` : ''}
                    </div>
                    <div class="footer">
                        <p>This is an automated email from Solomon's Landing reservation system.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Email text version
        const emailText = `
New Reservation Request

Customer Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Date: ${formattedDate}
Time: ${data.time}
Party Size: ${data.guests} guests
${data.notes ? `Special Requests: ${data.notes}` : ''}
${data.confirmationCode ? `Confirmation Code: ${data.confirmationCode}` : ''}
${data.confirmUrl ? `Confirmation Link: ${data.confirmUrl}` : ''}
${data.customerLanguage ? `Customer Language: ${data.customerLanguage}` : ''}
        `.trim();

        // Send email
        const mailOptions = {
            from: `"Solomon's Landing" <${smtpUser}>`,
            to: reservationEmail,
            replyTo: data.email,
            subject: `New Reservation Request - ${data.name} - ${formattedDate} at ${data.time}`,
            text: emailText,
            html: emailHTML
        };

        const info = await transporter.sendMail(mailOptions);

        console.log('✅ Reservation email sent:', info.messageId);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                success: true, 
                messageId: info.messageId,
                message: 'Reservation email sent successfully' 
            })
        };

    } catch (error) {
        console.error('❌ Error sending reservation email:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                success: false, 
                error: error.message || 'Failed to send reservation email. Please try again.' 
            })
        };
    }
};

