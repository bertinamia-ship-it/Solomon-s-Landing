# Sistema de Reservaciones - Configuración del Backend

## Descripción General
Este documento describe cómo implementar el sistema de reservaciones propio para Solomon's Landing que enviará correos electrónicos en lugar de usar OpenTable.

## Endpoint Necesario

### POST /api/reservations/create

**Descripción:** Crea una nueva reservación y envía correo de confirmación.

**Request Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "phone": "+52 624 123 4567",
  "date": "2025-12-15",
  "time": "19:00",
  "guests": "4",
  "notes": "Mesa junto a la ventana, cumpleaños",
  "source": "website"
}
```

**Response (Success):**
```json
{
  "success": true,
  "reservationId": "SOL-1234567890",
  "message": "Reservation request sent successfully"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Error description"
}
```

## Configuración de Email

### Email del Restaurante
**Correo principal:** condecorporation@gmail.com

### Emails a Enviar

#### 1. Email al Restaurante (condecorporation@gmail.com)
- **Para:** condecorporation@gmail.com
- **Asunto:** Nueva Reservación - [Nombre] - [Fecha]
- **Contenido:**
  ```
  NUEVA RESERVACIÓN RECIBIDA
  
  ID de Reservación: SOL-1234567890
  Fecha y Hora: [date] a las [time]
  
  DATOS DEL CLIENTE:
  Nombre: [name]
  Email: [email]
  Teléfono: [phone]
  Número de Personas: [guests]
  
  NOTAS ESPECIALES:
  [notes]
  
  ACCIÓN REQUERIDA:
  - Verificar disponibilidad
  - Confirmar o proponer horario alternativo
  - Responder al cliente dentro de 2 horas
  ```

#### 2. Email al Cliente
- **Para:** [email del cliente]
- **Asunto:** Solicitud de Reservación - Solomon's Landing
- **Contenido:**
  ```
  Estimado/a [name],
  
  Hemos recibido tu solicitud de reservación en Solomon's Landing.
  
  DETALLES DE TU RESERVACIÓN:
  - Fecha: [date]
  - Hora: [time]
  - Número de Personas: [guests]
  - ID de Reservación: SOL-1234567890
  
  PRÓXIMOS PASOS:
  Nuestro equipo verificará la disponibilidad y te confirmará tu reservación 
  por correo o teléfono en las próximas 2 horas.
  
  Si tienes alguna pregunta, no dudes en contactarnos:
  Teléfono: +52 624 219 3228
  Email: condecorporation@gmail.com
  
  ¡Esperamos verte pronto!
  
  Saludos,
  El equipo de Solomon's Landing
  ```

## Implementación Recomendada

### Tecnologías Sugeridas

#### Opción 1: Node.js + Express + Nodemailer
```javascript
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json());

// Configurar transporter de email
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'condecorporation@gmail.com',
    pass: 'tu-contraseña-de-aplicación' // Usar App Password de Gmail
  }
});

app.post('/api/reservations/create', async (req, res) => {
  try {
    const { name, email, phone, date, time, guests, notes } = req.body;
    
    // Validaciones
    if (!name || !email || !date || !time || !guests) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos'
      });
    }
    
    const reservationId = 'SOL-' + Date.now();
    
    // Email al restaurante (condecorporation@gmail.com)
    await transporter.sendMail({
      from: 'Solomon\'s Landing <condecorporation@gmail.com>',
      to: 'condecorporation@gmail.com',
      subject: `Nueva Reservación - ${name} - ${date}`,
      html: `
        <h2>NUEVA RESERVACIÓN RECIBIDA</h2>
        <p><strong>ID:</strong> ${reservationId}</p>
        <p><strong>Fecha:</strong> ${date} a las ${time}</p>
        <h3>Datos del Cliente:</h3>
        <ul>
          <li><strong>Nombre:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Teléfono:</strong> ${phone}</li>
          <li><strong>Personas:</strong> ${guests}</li>
        </ul>
        <p><strong>Notas:</strong> ${notes || 'Ninguna'}</p>
      `
    });
    
    // Email al cliente
    await transporter.sendMail({
      from: 'Solomon\'s Landing <condecorporation@gmail.com>',
      to: email,
      subject: 'Confirmación de Solicitud - Solomon\'s Landing',
      html: `
        <h2>Estimado/a ${name},</h2>
        <p>Hemos recibido tu solicitud de reservación.</p>
        <h3>Detalles:</h3>
        <ul>
          <li>Fecha: ${date}</li>
          <li>Hora: ${time}</li>
          <li>Personas: ${guests}</li>
          <li>ID: ${reservationId}</li>
        </ul>
        <p>Te confirmaremos en las próximas 2 horas.</p>
        <p><strong>Teléfono:</strong> +52 624 219 3228</p>
        <p><strong>Email:</strong> condecorporation@gmail.com</p>
      `
    });
    
    // Guardar en base de datos (opcional)
    // await saveReservation({ reservationId, name, email, phone, date, time, guests, notes });
    
    res.json({
      success: true,
      reservationId,
      message: 'Reservation request sent successfully'
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar la reservación'
    });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

#### Opción 2: PHP + PHPMailer
```php
<?php
require 'vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $name = $data['name'];
    $email = $data['email'];
    $phone = $data['phone'];
    $date = $data['date'];
    $time = $data['time'];
    $guests = $data['guests'];
    $notes = $data['notes'] ?? '';
    
    $reservationId = 'SOL-' . time();
    
    $mail = new PHPMailer(true);
    
    try {
        // Configuración SMTP
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'condecorporation@gmail.com';
        $mail->Password = 'tu-contraseña-de-aplicación';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        
        // Email al restaurante
        $mail->setFrom('condecorporation@gmail.com', 'Solomon\'s Landing');
        $mail->addAddress('condecorporation@gmail.com');
        $mail->Subject = "Nueva Reservación - $name - $date";
        $mail->Body = "ID: $reservationId\nNombre: $name\nEmail: $email\n...";
        $mail->send();
        
        // Email al cliente
        // ... similar al anterior
        
        echo json_encode([
            'success' => true,
            'reservationId' => $reservationId,
            'message' => 'Reservation request sent successfully'
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error: ' . $mail->ErrorInfo
        ]);
    }
}
?>
```

#### Opción 3: Servicio de Email (SendGrid, AWS SES, etc.)
```javascript
// Usando SendGrid
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/api/reservations/create', async (req, res) => {
  const { name, email, phone, date, time, guests, notes } = req.body;
  const reservationId = 'SOL-' + Date.now();
  
  try {
    // Email al restaurante
    await sgMail.send({
      to: 'condecorporation@gmail.com',
      from: 'condecorporation@gmail.com', // Debe estar verificado en SendGrid
      subject: `Nueva Reservación - ${name} - ${date}`,
      html: `<!-- Template HTML -->`
    });
    
    // Email al cliente
    await sgMail.send({
      to: email,
      from: 'condecorporation@gmail.com',
      subject: 'Confirmación de Solicitud - Solomon\'s Landing',
      html: `<!-- Template HTML -->`
    });
    
    res.json({ success: true, reservationId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

## Base de Datos (Opcional pero Recomendado)

### Tabla: reservations
```sql
CREATE TABLE reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reservation_id VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  guest_count INT NOT NULL,
  special_notes TEXT,
  status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
  source VARCHAR(50) DEFAULT 'website',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Seguridad

### Validaciones Necesarias
1. **Rate Limiting:** Limitar a 5 reservaciones por IP por hora
2. **Validación de Email:** Verificar formato válido
3. **Validación de Fecha:** Solo permitir fechas futuras
4. **Sanitización:** Limpiar todos los inputs para prevenir XSS
5. **CORS:** Configurar solo para tu dominio

### Ejemplo de Rate Limiting (Express)
```javascript
const rateLimit = require('express-rate-limit');

const reservationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // 5 solicitudes
  message: 'Demasiadas solicitudes, intenta más tarde'
});

app.post('/api/reservations/create', reservationLimiter, async (req, res) => {
  // ... código de reservación
});
```

## Configuración DNS y Email

### Opción 1: Usar Gmail Directamente (Más Fácil)

Para enviar emails desde `condecorporation@gmail.com`:

1. **Habilitar "App Passwords" en Google:**
   - Ve a tu cuenta de Google: https://myaccount.google.com/
   - Seguridad → Verificación en 2 pasos (debes habilitarla)
   - Contraseñas de aplicaciones → Selecciona "Correo" y "Otro"
   - Copia la contraseña de 16 caracteres generada
   - Usa esta contraseña en tu código (NO uses tu contraseña normal)

2. **Configuración SMTP para Gmail:**
   ```
   Host: smtp.gmail.com
   Port: 587
   Secure: STARTTLS
   Usuario: condecorporation@gmail.com
   Contraseña: [tu app password de 16 caracteres]
   ```

3. **Límites de Gmail:**
   - Máximo 500 emails por día
   - Máximo 100 destinatarios por mensaje
   - Suficiente para un restaurante

### Opción 2: Configurar Dominio Propio (Profesional)

Para enviar emails desde tu dominio:

1. **Registros SPF:**
   ```
   TXT @ "v=spf1 include:_spf.tu-servidor.com ~all"
   ```

2. **Registros DKIM:** Configurar según tu proveedor de email

3. **Registro DMARC:**
   ```
   TXT _dmarc "v=DMARC1; p=quarantine; rua=mailto:admin@solomonslanding.com.mx"
   ```

## Testing

### Prueba Manual
```bash
curl -X POST http://localhost:3000/api/reservations/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+52 624 123 4567",
    "date": "2025-12-20",
    "time": "19:00",
    "guests": "4",
    "notes": "Test reservation"
  }'
```

## Despliegue

### Opciones de Hosting
1. **Vercel/Netlify:** Para funciones serverless
2. **DigitalOcean/AWS:** Para servidor dedicado
3. **Heroku:** Para deployment rápido
4. **VPS compartido:** Con tu hosting actual

## Monitoreo

- Configurar alertas si un email falla
- Log de todas las reservaciones
- Dashboard para ver reservaciones pendientes
- Notificaciones push/SMS opcionales

## Próximos Pasos

1. Elegir tecnología backend (Node.js, PHP, Python, etc.)
2. Configurar servicio de email
3. Implementar endpoint /api/reservations/create
4. Probar envío de emails
5. Configurar dominio y DNS
6. Deploy a producción
7. Monitoreo y mantenimiento
