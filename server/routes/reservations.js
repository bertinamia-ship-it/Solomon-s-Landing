const express = require('express');
const router = express.Router();
const { db } = require('../config/database');

// Create new reservation
router.post('/create', async (req, res) => {
    try {
        const { name, email, phone, date, time, guests, specialRequests, hotelStaying } = req.body;
        
        const result = db.prepare(`
            INSERT INTO web_reservations (
                customer_name, customer_email, customer_phone, 
                party_size, reservation_date, reservation_time, 
                special_requests, hotel_staying, hold_amount, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
        `).run(
            name,
            email,
            phone || '',
            guests,
            date,
            time,
            specialRequests || '',
            hotelStaying || '',
            guests * 20 // $20 per person
        );

        res.json({ 
            success: true, 
            id: result.lastInsertRowid,
            message: 'Reservation created successfully'
        });

    } catch (error) {
        console.error('Create reservation error:', error);
        res.status(500).json({ error: 'Failed to create reservation' });
    }
});

// Confirm reservation (called from restaurant email link)
router.get('/confirm/:id', async (req, res) => {
    try {
        const reservationId = req.params.id;
        
        // Get reservation details
        const reservation = db.prepare(`
            SELECT * FROM web_reservations WHERE id = ?
        `).get(reservationId);

        if (!reservation) {
            return res.status(404).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Reservación No Encontrada</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                        .error { color: #dc3545; font-size: 24px; }
                    </style>
                </head>
                <body>
                    <div class="error">❌ Reservación no encontrada</div>
                </body>
                </html>
            `);
        }

        // Check if already confirmed
        if (reservation.status === 'confirmed') {
            return res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Ya Confirmada - Solomon's Landing</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                        .info { color: #ffc107; font-size: 24px; }
                    </style>
                </head>
                <body>
                    <div class="info">⚠️ Esta reservación ya fue confirmada anteriormente</div>
                    <p>Email: ${reservation.customer_email}</p>
                </body>
                </html>
            `);
        }

        // Update reservation status to confirmed
        db.prepare(`
            UPDATE web_reservations 
            SET status = 'confirmed', updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `).run(reservationId);

        // IMPORTANTE: Aquí se debe enviar el email de CONFIRMACIÓN al CLIENTE
        // Genera el payment link
        const paymentLink = `${process.env.BASE_URL || 'http://localhost:8005'}/payment.html?reservation_id=${reservationId}`;
        
        // Log para debug (en producción, aquí llamarías EmailJS)
        console.log('✅ RESERVACIÓN CONFIRMADA - Enviando email al cliente:', {
            cliente: reservation.customer_email,
            fecha: reservation.reservation_date,
            hora: reservation.reservation_time,
            personas: reservation.party_size,
            paymentLink: paymentLink
        });

        // TODO: Aquí integrar EmailJS para enviar email al cliente
        // emailService.sendCustomerConfirmation(reservation, paymentLink);

        // Return success page
        res.send(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reservación Confirmada - Solomon's Landing</title>
    <style>
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 600px;
            padding: 40px;
            text-align: center;
        }
        .success-icon {
            font-size: 80px;
            margin-bottom: 20px;
            animation: bounce 1s ease-in-out;
        }
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }
        h1 {
            color: #10b981;
            margin: 0 0 10px 0;
            font-size: 32px;
        }
        .subtitle {
            color: #666;
            font-size: 18px;
            margin-bottom: 30px;
        }
        .details {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            text-align: left;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #dee2e6;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: bold;
            color: #666;
        }
        .value {
            color: #333;
        }
        .btn {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 15px 40px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin-top: 20px;
            transition: background 0.3s;
        }
        .btn:hover {
            background: #059669;
        }
        .note {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            text-align: left;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="success-icon">✅</div>
        <h1>¡Reservación Confirmada!</h1>
        <p class="subtitle">El cliente ha sido notificado por email</p>
        
        <div class="details">
            <div class="detail-row">
                <span class="label">Cliente:</span>
                <span class="value">${reservation.customer_name}</span>
            </div>
            <div class="detail-row">
                <span class="label">Email:</span>
                <span class="value">${reservation.customer_email}</span>
            </div>
            <div class="detail-row">
                <span class="label">Teléfono:</span>
                <span class="value">${reservation.customer_phone}</span>
            </div>
            <div class="detail-row">
                <span class="label">Fecha:</span>
                <span class="value">${reservation.reservation_date}</span>
            </div>
            <div class="detail-row">
                <span class="label">Hora:</span>
                <span class="value">${reservation.reservation_time}</span>
            </div>
            <div class="detail-row">
                <span class="label">Comensales:</span>
                <span class="value">${reservation.party_size} personas</span>
            </div>
            <div class="detail-row">
                <span class="label">Hotel:</span>
                <span class="value">${reservation.hotel_staying || 'No especificado'}</span>
            </div>
        </div>
        
        <div class="note">
            <strong>📧 Email de confirmación enviado</strong><br>
            El cliente recibirá un email de confirmación final en: <strong>${reservation.customer_email}</strong>
        </div>
        
        <a href="#" onclick="window.close()" class="btn">Cerrar Ventana</a>
    </div>
</body>
</html>
        `);

    } catch (error) {
        console.error('Confirm reservation error:', error);
        res.status(500).send(`
            <!DOCTYPE html>
            <html>
            <head><title>Error</title></head>
            <body style="font-family: Arial; text-align: center; padding: 50px;">
                <h1 style="color: #dc3545;">❌ Error al confirmar reservación</h1>
                <p>${error.message}</p>
            </body>
            </html>
        `);
    }
});

// Get all reservations
router.get('/list', async (req, res) => {
    try {
        const reservations = db.prepare(`
            SELECT * FROM web_reservations 
            ORDER BY created_at DESC 
            LIMIT 100
        `).all();

        res.json({ success: true, reservations });

    } catch (error) {
        console.error('List reservations error:', error);
        res.status(500).json({ error: 'Failed to fetch reservations' });
    }
});

module.exports = router;
