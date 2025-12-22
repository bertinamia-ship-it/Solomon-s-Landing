// ============================================
// BACKEND DE RESERVACIONES - SOLOMON'S LANDING
// Usando Gmail (condecorporation@gmail.com)
// ============================================

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Permitir peticiones desde tu sitio web

// Configuración del transporter de Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'condecorporation@gmail.com',
    pass: 'AQUI_TU_APP_PASSWORD' // Reemplazar con tu App Password de Gmail
  }
});

// Verificar conexión al iniciar
transporter.verify(function(error, success) {
  if (error) {
    console.error('Error al conectar con Gmail:', error);
  } else {
    console.log('✓ Servidor listo para enviar emails');
  }
});

// Endpoint para crear reservación
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
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email inválido'
      });
    }
    
    // Generar ID único
    const reservationId = 'SOL-' + Date.now();
    
    // Formatear fecha
    const [year, month, day] = date.split('-');
    const fechaFormateada = `${day}/${month}/${year}`;
    
    // ============================================
    // EMAIL 1: AL RESTAURANTE (condecorporation@gmail.com)
    // ============================================
    const emailRestaurante = {
      from: '"Solomon\'s Landing" <condecorporation@gmail.com>',
      to: 'condecorporation@gmail.com',
      subject: `🔔 Nueva Reservación - ${name} - ${fechaFormateada}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #002654, #004A9F); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 20px; margin: 15px 0; border-left: 4px solid #FFC93C; border-radius: 5px; }
            .label { font-weight: bold; color: #004A9F; }
            .value { margin-left: 10px; }
            .alert { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 NUEVA RESERVACIÓN</h1>
              <p style="margin: 0; font-size: 18px;">ID: ${reservationId}</p>
            </div>
            
            <div class="content">
              <div class="alert">
                <strong>⚠️ ACCIÓN REQUERIDA:</strong><br>
                Verificar disponibilidad y confirmar con el cliente en las próximas 2 horas.
              </div>
              
              <div class="info-box">
                <h2 style="color: #004A9F; margin-top: 0;">📅 Detalles de la Reservación</h2>
                <p><span class="label">Fecha:</span><span class="value">${fechaFormateada}</span></p>
                <p><span class="label">Hora:</span><span class="value">${time}</span></p>
                <p><span class="label">Número de Personas:</span><span class="value">${guests}</span></p>
              </div>
              
              <div class="info-box">
                <h2 style="color: #004A9F; margin-top: 0;">👤 Información del Cliente</h2>
                <p><span class="label">Nombre:</span><span class="value">${name}</span></p>
                <p><span class="label">Email:</span><span class="value"><a href="mailto:${email}">${email}</a></span></p>
                <p><span class="label">Teléfono:</span><span class="value"><a href="tel:${phone}">${phone || 'No proporcionado'}</a></span></p>
              </div>
              
              ${notes ? `
              <div class="info-box">
                <h2 style="color: #004A9F; margin-top: 0;">📝 Notas Especiales</h2>
                <p>${notes}</p>
              </div>
              ` : ''}
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #666; font-size: 14px;">
                  Para confirmar o modificar esta reservación, contacta al cliente directamente.
                </p>
              </div>
            </div>
            
            <div class="footer">
              <p>Solomon's Landing - Cabo San Lucas Marina</p>
              <p>Sistema de Reservaciones Automático</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    // ============================================
    // EMAIL 2: AL CLIENTE
    // ============================================
    const emailCliente = {
      from: '"Solomon\'s Landing" <condecorporation@gmail.com>',
      to: email,
      subject: `✓ Confirmación de Solicitud - Solomon's Landing`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #002654, #004A9F); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .reservation-box { background: white; padding: 25px; margin: 20px 0; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .detail-row { padding: 10px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; }
            .detail-row:last-child { border-bottom: none; }
            .label { font-weight: bold; color: #004A9F; }
            .value { color: #333; }
            .confirmation-id { background: #FFC93C; color: #002654; padding: 10px 20px; border-radius: 5px; display: inline-block; font-weight: bold; margin: 15px 0; }
            .next-steps { background: #e3f2fd; border-left: 4px solid #2196F3; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .contact-info { background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Gracias por tu Solicitud!</h1>
              <p style="margin: 0; font-size: 16px;">Solomon's Landing</p>
            </div>
            
            <div class="content">
              <p style="font-size: 18px; text-align: center;">Hola <strong>${name}</strong>,</p>
              
              <p style="text-align: center;">
                Hemos recibido tu solicitud de reservación en Solomon's Landing.
              </p>
              
              <div style="text-align: center;">
                <div class="confirmation-id">
                  ID: ${reservationId}
                </div>
              </div>
              
              <div class="reservation-box">
                <h2 style="color: #004A9F; margin-top: 0; text-align: center;">📋 Detalles de tu Reservación</h2>
                
                <div class="detail-row">
                  <span class="label">📅 Fecha</span>
                  <span class="value">${fechaFormateada}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">🕐 Hora</span>
                  <span class="value">${time}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">👥 Personas</span>
                  <span class="value">${guests}</span>
                </div>
                
                ${notes ? `
                <div class="detail-row">
                  <span class="label">📝 Notas</span>
                  <span class="value">${notes}</span>
                </div>
                ` : ''}
              </div>
              
              <div class="next-steps">
                <h3 style="margin-top: 0; color: #2196F3;">⏱️ Próximos Pasos</h3>
                <p>
                  Nuestro equipo verificará la disponibilidad y te <strong>confirmará tu reservación 
                  por correo electrónico o teléfono en las próximas 2 horas</strong>.
                </p>
                <p style="margin: 0;">
                  Por favor, mantén tu teléfono disponible.
                </p>
              </div>
              
              <div class="contact-info">
                <h3 style="color: #004A9F; margin-top: 0;">📞 ¿Necesitas Ayuda?</h3>
                <p style="margin: 5px 0;">
                  <strong>Teléfono:</strong> <a href="tel:+526242193228" style="color: #004A9F; text-decoration: none;">+52 624 219 3228</a>
                </p>
                <p style="margin: 5px 0;">
                  <strong>Email:</strong> <a href="mailto:condecorporation@gmail.com" style="color: #004A9F; text-decoration: none;">condecorporation@gmail.com</a>
                </p>
                <p style="margin: 15px 0 5px 0; color: #666; font-size: 14px;">
                  Abierto 7 días a la semana<br>
                  8:00 AM - 11:00 PM
                </p>
              </div>
              
              <p style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
                ¡Esperamos verte pronto en Solomon's Landing!<br>
                <em>Tu experiencia culinaria en la Marina de Cabo San Lucas</em>
              </p>
            </div>
            
            <div class="footer">
              <p><strong>Solomon's Landing</strong></p>
              <p>Blvd. Paseo de la Marina Centro, Marina<br>23450 Cabo San Lucas, B.C.S., México</p>
              <p style="margin-top: 15px;">
                <a href="https://www.instagram.com/solomonslanding/" style="color: #004A9F; text-decoration: none; margin: 0 10px;">Instagram</a>
                <a href="https://www.facebook.com/SolomonsLandingLosCabos" style="color: #004A9F; text-decoration: none; margin: 0 10px;">Facebook</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    // Enviar ambos emails
    console.log('Enviando email al restaurante...');
    await transporter.sendMail(emailRestaurante);
    console.log('✓ Email enviado al restaurante');
    
    console.log('Enviando email al cliente...');
    await transporter.sendMail(emailCliente);
    console.log('✓ Email enviado al cliente');
    
    // Respuesta exitosa
    res.json({
      success: true,
      reservationId,
      message: 'Reservation request sent successfully'
    });
    
    // Log para debugging
    console.log(`✓ Reservación creada: ${reservationId} - ${name} - ${fechaFormateada}`);
    
  } catch (error) {
    console.error('Error al procesar reservación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar la reservación. Por favor intenta de nuevo.'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Solomon\'s Landing Reservations' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════╗
║   SOLOMON'S LANDING - Sistema de Reservas   ║
║   Servidor corriendo en puerto ${PORT}        ║
║   Email: condecorporation@gmail.com          ║
╚══════════════════════════════════════════════╝
  `);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (error) => {
  console.error('Error no manejado:', error);
});
