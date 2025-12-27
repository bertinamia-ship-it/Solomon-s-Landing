/**
 * Netlify Function: Send Catering Email
 * 
 * Sends catering quote requests via Resend
 * 
 * Environment Variables Required:
 * - RESEND_API_KEY
 * - EMAIL_FROM (Resend verified sender)
 * - CATERING_TO_EMAIL (samantha@solomonslanding.com.mx or testing email)
 */

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
        const requiredFields = ['name', 'email', 'phone', 'eventDate', 'guestCount', 'eventType'];
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
        const resendApiKey = process.env.RESEND_API_KEY;
        const emailFrom = process.env.EMAIL_FROM;
        const cateringEmail = process.env.CATERING_TO_EMAIL || process.env.CATERING_EMAIL || 'samantha@solomonslanding.com.mx';

        // Validate configuration
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

        // Format date for display
        const dateObj = new Date(data.eventDate + 'T00:00:00');
        const formattedDate = dateObj.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        // Initialize Resend
        const resend = new Resend(resendApiKey);

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
                    .message-box { margin: 15px 0; padding: 15px; background: white; border-left: 4px solid #004A9F; border-radius: 5px; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>New Catering Quote Request</h2>
                    </div>
                    <div class="content">
                        <div class="info-row">
                            <span class="label">Contact Name:</span> ${data.name}
                        </div>
                        <div class="info-row">
                            <span class="label">Email:</span> ${data.email}
                        </div>
                        <div class="info-row">
                            <span class="label">Phone:</span> ${data.phone}
                        </div>
                        <div class="info-row">
                            <span class="label">Event Date:</span> ${formattedDate}
                        </div>
                        <div class="info-row">
                            <span class="label">Guest Count:</span> ${data.guestCount} guests
                        </div>
                        <div class="info-row">
                            <span class="label">Event Type:</span> ${data.eventType}
                        </div>
                        ${data.message ? `
                        <div class="message-box">
                            <span class="label">Additional Details:</span><br>
                            ${data.message}
                        </div>
                        ` : ''}
                    </div>
                    <div class="footer">
                        <p>This is an automated email from Solomon's Landing catering system.</p>
                        <p>Please respond to: <a href="mailto:${data.email}">${data.email}</a></p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Email text version
        const emailText = `
New Catering Quote Request

Contact Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Event Date: ${formattedDate}
Guest Count: ${data.guestCount} guests
Event Type: ${data.eventType}
${data.message ? `Additional Details:\n${data.message}` : ''}
        `.trim();

        // Send email
        const emailResult = await resend.emails.send({
            from: emailFrom,
            to: cateringEmail,
            replyTo: data.email,
            subject: `Catering Quote Request - ${data.name} - ${data.eventType} on ${formattedDate}`,
            html: emailHTML,
            text: emailText
        });

        console.log('✅ Catering email sent:', emailResult.data?.id);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                success: true, 
                messageId: emailResult.data?.id,
                message: 'Catering quote request sent successfully' 
            })
        };

    } catch (error) {
        console.error('❌ Error sending catering email:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                success: false, 
                error: error.message || 'Failed to send catering request. Please try again.' 
            })
        };
    }
};
