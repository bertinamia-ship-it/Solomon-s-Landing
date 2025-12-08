# 📧 Configuración del Sistema de Correo Electrónico para el Chatbot

## 🎯 Objetivo
Este documento explica cómo configurar el envío de correos electrónicos automáticos cuando un cliente hace una reservación a través del chatbot.

---

## 📋 Opción 1: EmailJS (Recomendado - Gratis y Fácil)

### Paso 1: Crear Cuenta en EmailJS

1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Haz clic en "Sign Up" (Registrarse)
3. Crea una cuenta gratuita (permite 200 emails al mes gratis)

### Paso 2: Conectar tu Correo

1. Una vez dentro, ve a **Email Services**
2. Haz clic en **Add New Service**
3. Selecciona **Gmail** (o el proveedor que uses)
4. Sigue las instrucciones para autorizar tu correo `solomonslanding@gmail.com`
5. Guarda el **Service ID** que te da (ejemplo: `service_abc123`)

### Paso 3: Crear Template para Cliente

1. Ve a **Email Templates**
2. Haz clic en **Create New Template**
3. Nombre: `customer_reservation_confirmation`
4. Copia y pega este contenido:

**Subject:**
```
Reservation Confirmation - Solomon's Landing
```

**HTML Content:**
```html
<h1 style="color: #8B4513;">🌊 Solomon's Landing</h1>
<h2>Thank you, {{customer_name}}! 🎉</h2>

<p>Your reservation request has been received. We're excited to serve you!</p>

<div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
    <h3>Reservation Details:</h3>
    <p><strong>📅 Date:</strong> {{reservation_date}}</p>
    <p><strong>⏰ Time:</strong> {{reservation_time}}</p>
    <p><strong>👥 Number of Guests:</strong> {{num_guests}}</p>
    <p><strong>📝 Special Requests:</strong> {{special_requests}}</p>
</div>

<p><strong>Contact Information:</strong><br>
Name: {{customer_name}}<br>
Email: {{customer_email}}<br>
Phone: {{customer_phone}}</p>

<p><strong>We will confirm your reservation within 2 hours.</strong></p>

<p><strong>Location:</strong><br>
Blvd. Paseo de la Marina Centro<br>
23450 Cabo San Lucas, B.C.S., Mexico</p>

<p><strong>Contact:</strong><br>
Phone: +52 624 219 3228<br>
Email: contact@solomonslanding.com.mx</p>

<hr>
<p style="font-size: 12px; color: #666;">
Solomon's Landing - Cabo San Lucas Marina<br>
Open 7 days a week | 8:00 AM - 11:00 PM
</p>
```

5. Guarda el **Template ID** (ejemplo: `template_xyz789`)

### Paso 4: Crear Template para Restaurante

1. Crea otro template nuevo
2. Nombre: `restaurant_new_reservation`
3. Subject: `🔔 Nueva Reservación - Solomon's Landing`

**HTML Content:**
```html
<h2 style="color: #8B4513;">🔔 Nueva Reservación</h2>

<div style="background: #fff3cd; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0;">
    <strong>⏰ Acción Requerida:</strong> Por favor confirmar esta reservación dentro de 2 horas.
</div>

<h3>Detalles de la Reservación:</h3>
<table style="width: 100%; border-collapse: collapse;">
    <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 10px; font-weight: bold;">Nombre:</td>
        <td style="padding: 10px;">{{customer_name}}</td>
    </tr>
    <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 10px; font-weight: bold;">Email:</td>
        <td style="padding: 10px;">{{customer_email}}</td>
    </tr>
    <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 10px; font-weight: bold;">Teléfono:</td>
        <td style="padding: 10px;">{{customer_phone}}</td>
    </tr>
    <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 10px; font-weight: bold;">Fecha:</td>
        <td style="padding: 10px;">{{reservation_date}}</td>
    </tr>
    <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 10px; font-weight: bold;">Hora:</td>
        <td style="padding: 10px;">{{reservation_time}}</td>
    </tr>
    <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 10px; font-weight: bold;">Comensales:</td>
        <td style="padding: 10px;">{{num_guests}} personas</td>
    </tr>
    <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 10px; font-weight: bold;">Solicitudes Especiales:</td>
        <td style="padding: 10px;">{{special_requests}}</td>
    </tr>
</table>

<p><strong>Hora de solicitud:</strong> {{request_time}}</p>
```

4. Guarda el **Template ID**

### Paso 5: Obtener Public Key

1. Ve a **Account** → **General**
2. Copia tu **Public Key** (ejemplo: `pubkey_abc123xyz`)

### Paso 6: Actualizar el Código

Abre el archivo donde está el chatbot (`index.html`) y busca esta sección al final del código del chatbot:

```javascript
// Override email sending function
chatbot.sendReservationEmails = async function() {
    console.log('=== RESERVATION CONFIRMATION ===');
    // ...
```

**Reemplázala con esto:**

```javascript
// EmailJS Configuration
const EMAILJS_CONFIG = {
    publicKey: 'TU_PUBLIC_KEY_AQUI',  // Paso 5
    serviceID: 'TU_SERVICE_ID_AQUI',  // Paso 2
    customerTemplateID: 'TU_CUSTOMER_TEMPLATE_ID_AQUI',  // Paso 3
    restaurantTemplateID: 'TU_RESTAURANT_TEMPLATE_ID_AQUI'  // Paso 4
};

// Initialize EmailJS
emailjs.init(EMAILJS_CONFIG.publicKey);

// Override email sending function
chatbot.sendReservationEmails = async function() {
    try {
        const now = new Date();
        
        // Prepare data for customer email
        const customerParams = {
            customer_name: this.reservationData.name,
            customer_email: this.reservationData.email,
            customer_phone: this.reservationData.phone,
            reservation_date: this.reservationData.date,
            reservation_time: this.reservationData.time,
            num_guests: this.reservationData.guests,
            special_requests: this.reservationData.specialRequests || 'None',
            to_email: this.reservationData.email
        };
        
        // Send to customer
        await emailjs.send(
            EMAILJS_CONFIG.serviceID,
            EMAILJS_CONFIG.customerTemplateID,
            customerParams
        );
        
        // Prepare data for restaurant email
        const restaurantParams = {
            ...customerParams,
            request_time: now.toLocaleString(),
            to_email: 'solomonslanding@gmail.com'  // Tu correo
        };
        
        // Send to restaurant
        await emailjs.send(
            EMAILJS_CONFIG.serviceID,
            EMAILJS_CONFIG.restaurantTemplateID,
            restaurantParams
        );
        
        console.log('✅ Emails sent successfully!');
        return Promise.resolve();
    } catch (error) {
        console.error('❌ Error sending emails:', error);
        return Promise.reject(error);
    }
};
```

### Paso 7: Agregar EmailJS SDK

Asegúrate que esta línea esté ANTES del script del chatbot en tu HTML:

```html
<!-- EmailJS SDK -->
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

<!-- Chatbot Scripts -->
<script src="chatbot.js"></script>
```

---

## 🧪 Probar el Sistema

1. Abre tu página web
2. Haz clic en el chatbot 💬
3. Di "make a reservation" o "hacer reservación"
4. Completa todos los datos
5. Confirma la reservación
6. **Revisa ambos correos:**
   - El cliente recibirá confirmación en su email
   - Tú recibirás la notificación en `solomonslanding@gmail.com`

---

## 📱 Opción 2: Backend Propio (Avanzado)

Si prefieres tener más control, puedes crear un backend con Node.js:

### Requisitos:
- Servidor Node.js
- Nodemailer
- API REST

### Estructura básica:

```javascript
// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json());

// Configurar transporter de Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'solomonslanding@gmail.com',
        pass: 'tu_app_password'  // Crear en Google Account
    }
});

// Endpoint para enviar reservación
app.post('/api/send-reservation', async (req, res) => {
    const { reservation } = req.body;
    
    try {
        // Email al cliente
        await transporter.sendMail({
            from: 'Solomon\'s Landing <solomonslanding@gmail.com>',
            to: reservation.email,
            subject: 'Reservation Confirmation',
            html: generateCustomerEmail(reservation)
        });
        
        // Email al restaurante
        await transporter.sendMail({
            from: 'Solomon\'s Landing <solomonslanding@gmail.com>',
            to: 'solomonslanding@gmail.com',
            subject: 'Nueva Reservación',
            html: generateRestaurantEmail(reservation)
        });
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000);
```

---

## 🔐 Seguridad

⚠️ **IMPORTANTE:**
- Nunca expongas tus credenciales en el código del frontend
- EmailJS maneja esto de forma segura
- Si usas backend propio, usa variables de entorno
- Activa autenticación de 2 factores en tu Gmail
- Usa "App Passwords" de Google, no tu contraseña principal

---

## 💡 Consejos

1. **Prueba primero con tu propio email** antes de publicar
2. **Límite de EmailJS gratis:** 200 emails/mes (suficiente para empezar)
3. **Upgrade si necesitas más:** $7/mes para 1,000 emails
4. **Revisa spam:** Los primeros emails pueden caer en spam
5. **Personaliza los templates** con tu branding

---

## 🆘 Solución de Problemas

### "EmailJS is not defined"
- Verifica que el script SDK esté cargado antes del chatbot
- Revisa la consola del navegador

### "Service not found"
- Verifica que el Service ID sea correcto
- Asegúrate de haber conectado tu cuenta de Gmail

### "Template not found"
- Verifica el Template ID
- Asegúrate de haber guardado el template

### Los emails no llegan
- Revisa la carpeta de spam
- Verifica que el correo del cliente sea válido
- Revisa los logs en EmailJS dashboard

---

## 📞 Contacto

Si tienes problemas, contacta:
- EmailJS Support: https://www.emailjs.com/docs/
- Google App Passwords: https://support.google.com/accounts/answer/185833

---

¡Listo! Con esto tendrás un sistema completo de reservaciones con confirmación por email automática. 🎉
