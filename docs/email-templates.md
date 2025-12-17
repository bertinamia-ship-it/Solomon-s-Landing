# 📧 Plantillas de Email Profesionales para EmailJS

## 📋 Instrucciones de Uso

1. Ve a [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Ve a **Email Templates**
3. Crea dos templates nuevos usando el código HTML de abajo

---

## 🎯 TEMPLATE 1: Confirmación para el Cliente

### Configuración del Template:

**Template Name:** `customer_reservation_confirmation`

**Subject:**
```
🌊 Reservation Confirmation - Solomon's Landing
```

**Content (Copia todo el código HTML de abajo):**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f7fa;
            color: #333;
        }
        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background: linear-gradient(135deg, #8B4513 0%, #D4AF37 50%, #8B4513 100%);
            padding: 40px 20px;
            text-align: center;
            color: white;
        }
        .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 300;
            letter-spacing: 2px;
        }
        .header .subtitle {
            margin-top: 10px;
            font-size: 14px;
            opacity: 0.9;
            letter-spacing: 1px;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 24px;
            color: #8B4513;
            margin-bottom: 20px;
            font-weight: 600;
        }
        .message {
            font-size: 16px;
            line-height: 1.8;
            color: #555;
            margin-bottom: 30px;
        }
        .reservation-card {
            background: linear-gradient(135deg, #faf9f7 0%, #fff 100%);
            border-left: 4px solid #D4AF37;
            border-radius: 8px;
            padding: 25px;
            margin: 30px 0;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        }
        .reservation-card h2 {
            color: #8B4513;
            font-size: 20px;
            margin-top: 0;
            margin-bottom: 20px;
            font-weight: 600;
        }
        .detail-row {
            display: flex;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #eee;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-icon {
            font-size: 20px;
            width: 40px;
            flex-shrink: 0;
        }
        .detail-label {
            font-weight: 600;
            color: #8B4513;
            width: 140px;
            flex-shrink: 0;
        }
        .detail-value {
            color: #333;
            flex-grow: 1;
        }
        .highlight-box {
            background: linear-gradient(135deg, #fff8e1 0%, #fff 100%);
            border: 2px solid #D4AF37;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            text-align: center;
        }
        .highlight-box strong {
            color: #8B4513;
            font-size: 18px;
        }
        .info-section {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }
        .info-section h3 {
            color: #8B4513;
            font-size: 16px;
            margin-top: 0;
            margin-bottom: 15px;
            font-weight: 600;
        }
        .info-section p {
            margin: 8px 0;
            font-size: 14px;
            line-height: 1.6;
            color: #555;
        }
        .location-link {
            display: inline-block;
            background: linear-gradient(135deg, #8B4513, #D4AF37);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: 600;
            margin-top: 15px;
            transition: transform 0.2s;
        }
        .location-link:hover {
            transform: scale(1.05);
        }
        .footer {
            background: #2d2d2d;
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .footer-logo {
            font-size: 24px;
            font-weight: 300;
            letter-spacing: 2px;
            margin-bottom: 15px;
            color: #D4AF37;
        }
        .footer-info {
            font-size: 13px;
            line-height: 1.8;
            opacity: 0.8;
            margin: 10px 0;
        }
        .social-links {
            margin-top: 20px;
        }
        .social-links a {
            color: #D4AF37;
            text-decoration: none;
            margin: 0 10px;
            font-size: 14px;
        }
        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, #D4AF37, transparent);
            margin: 25px 0;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <!-- Header -->
        <div class="header">
            <img src="https://raw.githubusercontent.com/bertinamia-ship-it/Solomon-s-Landing/main/logo%20solomons.png" alt="Solomon's Landing Logo" style="max-width: 120px; height: auto; margin-bottom: 15px; filter: brightness(0) invert(1);">
            <h1>🌊 SOLOMON'S LANDING</h1>
            <div class="subtitle">CABO SAN LUCAS MARINA</div>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">
                Thank you, {{customer_name}}! 🎉
            </div>

            <div class="message">
                We're thrilled to confirm your reservation at Solomon's Landing. Get ready for an unforgettable dining experience with breathtaking marina views and exceptional cuisine!
            </div>

            <!-- Reservation Details Card -->
            <div class="reservation-card">
                <h2>📋 Your Reservation Details</h2>
                
                <div class="detail-row">
                    <div class="detail-icon">📅</div>
                    <div class="detail-label">Date:</div>
                    <div class="detail-value">{{reservation_date}}</div>
                </div>

                <div class="detail-row">
                    <div class="detail-icon">⏰</div>
                    <div class="detail-label">Time:</div>
                    <div class="detail-value">{{reservation_time}}</div>
                </div>

                <div class="detail-row">
                    <div class="detail-icon">👥</div>
                    <div class="detail-label">Party Size:</div>
                    <div class="detail-value">{{num_guests}} guests</div>
                </div>

                <div class="detail-row">
                    <div class="detail-icon">📧</div>
                    <div class="detail-label">Email:</div>
                    <div class="detail-value">{{customer_email}}</div>
                </div>

                <div class="detail-row">
                    <div class="detail-icon">📱</div>
                    <div class="detail-label">Phone:</div>
                    <div class="detail-value">{{customer_phone}}</div>
                </div>

                <div class="detail-row">
                    <div class="detail-icon">📝</div>
                    <div class="detail-label">Special Requests:</div>
                    <div class="detail-value">{{special_requests}}</div>
                </div>
            </div>

            <!-- Confirmation Notice -->
            <div class="highlight-box">
                <strong>✅ We will confirm your reservation within 2 hours</strong>
                <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">
                    You'll receive a confirmation call or email shortly
                </p>
            </div>

            <div class="divider"></div>

            <!-- Location Info -->
            <div class="info-section">
                <h3>📍 How to Find Us</h3>
                <p><strong>Address:</strong><br>
                Blvd. Paseo de la Marina Centro<br>
                Centro, Marina<br>
                23450 Cabo San Lucas, B.C.S.<br>
                México</p>
                
                <p style="margin-top: 15px;">
                    <strong>🅿️ Parking:</strong> Free parking available at the Marina
                </p>
                
                <center>
                    <a href="https://goo.gl/maps/your-location" class="location-link">
                        📍 Get Directions
                    </a>
                </center>
            </div>

            <!-- Contact Info -->
            <div class="info-section">
                <h3>📞 Contact Us</h3>
                <p><strong>Phone:</strong> <a href="tel:+526242193228" style="color: #8B4513; text-decoration: none;">+52 624 219 3228</a></p>
                <p><strong>Email:</strong> <a href="mailto:contact@solomonslanding.com.mx" style="color: #8B4513; text-decoration: none;">contact@solomonslanding.com.mx</a></p>
            </div>

            <div class="message" style="margin-top: 30px;">
                <strong>Need to modify or cancel?</strong><br>
                Please contact us at least 24 hours in advance at the phone number above.
            </div>

            <div class="message" style="font-style: italic; color: #8B4513; text-align: center; margin-top: 30px;">
                "We look forward to serving you at the beautiful Cabo San Lucas Marina!"
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-logo">SOLOMON'S LANDING</div>
            <div class="footer-info">
                International Cuisine • Fresh Seafood • Marina Views<br>
                Open 7 days a week | 8:00 AM - 11:00 PM
            </div>
            <div class="social-links">
                <a href="https://www.instagram.com/solomonslanding/">Instagram</a> •
                <a href="https://www.facebook.com/SolomonsLandingLosCabos">Facebook</a> •
                <a href="https://www.tripadvisor.com.mx/Restaurant_Review-g152515-d878292">TripAdvisor</a>
            </div>
            <div class="footer-info" style="margin-top: 20px; font-size: 11px;">
                © 2025 Solomon's Landing. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>
```

**Variables que necesitas en EmailJS:**
- `{{customer_name}}`
- `{{customer_email}}`
- `{{customer_phone}}`
- `{{reservation_date}}`
- `{{reservation_time}}`
- `{{num_guests}}`
- `{{special_requests}}`

---

## 🔔 TEMPLATE 2: Restaurant Notification

### Configuración del Template:

**Template Name:** `restaurant_new_reservation`

**Subject:**
```
🔔 New Reservation - Solomon's Landing
```

**Content (Copia todo el código HTML de abajo):**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f7fa;
            color: #333;
        }
        .email-wrapper {
            max-width: 650px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background: linear-gradient(135deg, #8B4513 0%, #D4AF37 100%);
            padding: 30px 20px;
            text-align: center;
            color: white;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .alert-box {
            background: linear-gradient(135deg, #fff3cd 0%, #fffaeb 100%);
            border-left: 5px solid #ff9800;
            padding: 20px;
            margin: 20px;
            border-radius: 8px;
        }
        .alert-box strong {
            color: #d84315;
            font-size: 18px;
            display: block;
            margin-bottom: 10px;
        }
        .alert-box p {
            margin: 5px 0;
            color: #666;
            font-size: 14px;
        }
        .content {
            padding: 20px 30px;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        }
        .info-table tr {
            border-bottom: 1px solid #e0e0e0;
        }
        .info-table tr:last-child {
            border-bottom: none;
        }
        .info-table td {
            padding: 15px 20px;
            font-size: 15px;
        }
        .info-table td:first-child {
            font-weight: 700;
            color: #8B4513;
            width: 180px;
            background: #fafafa;
        }
        .info-table td:last-child {
            color: #333;
        }
        .highlight {
            background: linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%);
            padding: 15px 20px;
            border-left: 4px solid #2196f3;
            margin: 20px 0;
            border-radius: 4px;
        }
        .special-requests {
            background: #fff8e1;
            border: 2px dashed #ffa726;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .special-requests h3 {
            color: #f57c00;
            margin-top: 0;
            font-size: 16px;
        }
        .quick-actions {
            display: flex;
            gap: 15px;
            margin: 25px 0;
            flex-wrap: wrap;
        }
        .action-button {
            flex: 1;
            min-width: 150px;
            padding: 15px 20px;
            text-align: center;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            transition: transform 0.2s;
        }
        .action-button:hover {
            transform: translateY(-2px);
        }
        .btn-confirm {
            background: linear-gradient(135deg, #4caf50, #66bb6a);
            color: white;
        }
        .btn-call {
            background: linear-gradient(135deg, #2196f3, #42a5f5);
            color: white;
        }
        .btn-email {
            background: linear-gradient(135deg, #ff9800, #ffa726);
            color: white;
        }
        .timestamp {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
            font-size: 13px;
            color: #666;
        }
        .footer {
            background: #2d2d2d;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 12px;
        }
        .priority-icon {
            font-size: 24px;
            display: inline-block;
            margin-right: 10px;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <!-- Header -->
        <div class="header">
            <img src="https://raw.githubusercontent.com/bertinamia-ship-it/Solomon-s-Landing/main/logo%20solomons.png" alt="Solomon's Landing Logo" style="max-width: 100px; height: auto; margin-bottom: 15px; filter: brightness(0) invert(1);">
            <h1>🔔 New Reservation Received</h1>
        </div>

        <!-- Alert Box -->
        <div class="alert-box">
            <strong>⏰ ACTION REQUIRED</strong>
            <p>Please confirm this reservation within the next <strong>2 hours</strong></p>
            <p>An automatic confirmation email has been sent to the customer</p>
        </div>

        <!-- Content -->
        <div class="content">
            <h2 style="color: #8B4513; margin-top: 0;">📋 Reservation Details</h2>

            <!-- Customer Info Table -->
            <table class="info-table">
                <tr>
                    <td><span class="priority-icon">👤</span> Full Name</td>
                    <td><strong>{{customer_name}}</strong></td>
                </tr>
                <tr>
                    <td><span class="priority-icon">📧</span> Email</td>
                    <td><a href="mailto:{{customer_email}}" style="color: #2196f3; text-decoration: none;">{{customer_email}}</a></td>
                </tr>
                <tr>
                    <td><span class="priority-icon">📱</span> Phone</td>
                    <td><a href="tel:{{customer_phone}}" style="color: #2196f3; text-decoration: none;">{{customer_phone}}</a></td>
                </tr>
                <tr>
                    <td><span class="priority-icon">📅</span> Date</td>
                    <td><strong style="font-size: 16px; color: #d84315;">{{reservation_date}}</strong></td>
                </tr>
                <tr>
                    <td><span class="priority-icon">⏰</span> Time</td>
                    <td><strong style="font-size: 16px; color: #d84315;">{{reservation_time}}</strong></td>
                </tr>
                <tr>
                    <td><span class="priority-icon">👥</span> Party Size</td>
                    <td><strong style="font-size: 16px;">{{num_guests}} guests</strong></td>
                </tr>
            </table>

            <!-- Special Requests -->
            <div class="special-requests">
                <h3>📝 Special Requests / Notes</h3>
                <p style="margin: 0; font-size: 15px; line-height: 1.6;">
                    {{special_requests}}
                </p>
            </div>

            <!-- Quick Actions -->
            <h3 style="color: #8B4513; margin-top: 30px;">⚡ Quick Actions</h3>
            <div class="quick-actions">
                <a href="tel:{{customer_phone}}" class="action-button btn-call">
                    📞 Call Customer
                </a>
                <a href="mailto:{{customer_email}}" class="action-button btn-email">
                    📧 Send Email
                </a>
                <a href="#" class="action-button btn-confirm">
                    ✅ Confirm Reservation
                </a>
            </div>

            <!-- Important Reminders -->
            <div class="highlight">
                <h3 style="color: #1976d2; margin-top: 0; font-size: 16px;">💡 Important Reminders</h3>
                <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8; font-size: 14px;">
                    <li>Verify availability in the system</li>
                    <li>Confirm with customer by phone or email</li>
                    <li>Review special requests and prepare accordingly</li>
                    <li>Update reservation book</li>
                    <li>If special occasion, prepare decoration/details</li>
                </ul>
            </div>

            <!-- Timestamp -->
            <div class="timestamp">
                <strong>📅 Request Received:</strong> {{request_time}}<br>
                <strong>🌐 Source:</strong> Website Chatbot (Automatic)
            </div>

            <!-- Customer Summary -->
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 25px;">
                <h3 style="color: #8B4513; margin-top: 0; font-size: 14px;">📊 SUMMARY FOR RECORD</h3>
                <p style="font-size: 13px; line-height: 1.8; margin: 5px 0; color: #555;">
                    <strong>{{customer_name}}</strong> | {{reservation_date}} @ {{reservation_time}} | {{num_guests}} PAX | Tel: {{customer_phone}}
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            Solomon's Landing - Reservation System<br>
            This is an automatic email generated by the website chatbot<br>
            © 2025 Solomon's Landing
        </div>
    </div>
</body>
</html>
```

**Variables que necesitas en EmailJS:**
- `{{customer_name}}`
- `{{customer_email}}`
- `{{customer_phone}}`
- `{{reservation_date}}`
- `{{reservation_time}}`
- `{{num_guests}}`
- `{{special_requests}}`
- `{{request_time}}`

---

## 🚀 Pasos para Crear los Templates en EmailJS

### 1. Ir a EmailJS Dashboard
- Entra a https://dashboard.emailjs.com/
- Ve a **Email Templates**

### 2. Crear Template para Clientes

1. Click en **Create New Template**
2. **Template Name:** `customer_reservation_confirmation`
3. **Subject:** `🌊 Reservation Confirmation - Solomon's Landing`
4. En el editor, cambia a vista **HTML** (botón arriba a la derecha)
5. **Borra todo** el contenido que está por defecto
6. **Copia y pega** todo el HTML del TEMPLATE 1 de arriba
7. Click en **Save**
8. **Copia el Template ID** que aparece (ejemplo: `template_abc123`)

### 3. Crear Template para Restaurante

1. Click en **Create New Template**
2. **Template Name:** `restaurant_new_reservation`
3. **Subject:** `🔔 Nueva Reservación - Solomon's Landing`
4. En el editor, cambia a vista **HTML**
5. **Borra todo** el contenido
6. **Copia y pega** todo el HTML del TEMPLATE 2 de arriba
7. Click en **Save**
8. **Copia el Template ID** que aparece

### 4. Obtener tu Public Key

1. Ve a **Account** → **General**
2. Copia tu **Public Key** (ejemplo: `abc123xyz`)

---

## ✅ Siguiente Paso

Una vez que hayas creado los templates en EmailJS, dame:

1. ✅ Service ID: `service_u021fxi` (Ya lo tengo)
2. ❓ Template ID para clientes (el del TEMPLATE 1)
3. ❓ Template ID para restaurante (el del TEMPLATE 2)
4. ❓ Public Key

Y actualizaré el código automáticamente! 🎉
