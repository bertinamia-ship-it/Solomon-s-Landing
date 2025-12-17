# 📧 GUÍA COMPLETA: Nuevo Sistema de Emails - 3 Pasos

## 🎯 Flujo Completo del Sistema

```
1️⃣ CLIENTE HACE RESERVACIÓN
    └─→ Email #1: RESTAURANTE recibe alerta urgente
    └─→ Chatbot muestra link de pago al cliente
    └─→ Cliente NO recibe email todavía

2️⃣ RESTAURANTE CONFIRMA
    └─→ Click en botón "CONFIRMAR RESERVACIÓN"
    └─→ Email #2: CLIENTE recibe pre-confirmación con link de pago
    └─→ Cliente hace click y paga el hold

3️⃣ CLIENTE COMPLETA PAGO
    └─→ Stripe procesa el hold
    └─→ Email #3: CLIENTE recibe confirmación final
    └─→ ✅ Reservación 100% confirmada
```

---

## 📧 Los 3 Emails Nuevos

### **Email #1: Alerta al Restaurante**
**Archivo:** `1-restaurante-nueva-reservacion.html`
**Cuándo:** Inmediatamente cuando cliente hace reservación
**Para:** solomonslanding@gmail.com

**Diseño:**
- ❤️ Header rojo urgente con gradiente
- 🟡 ID de reservación en amarillo
- 👤 Info del cliente en tarjeta azul
- 📅 Detalles de reservación en tarjeta amarilla
- ✅ Checklist de pasos a seguir
- 🟢 Botón VERDE GIGANTE "CONFIRMAR RESERVACIÓN"

**Variables necesarias:**
```
{{reservation_id}}       - #123
{{customer_name}}        - "Juan Pérez"
{{customer_email}}       - "juan@email.com"
{{customer_phone}}       - "+52 624 123 4567"
{{date}}                 - "2025-12-20"
{{time}}                 - "7:00 PM"
{{guests}}               - "4"
{{hotel}}                - "Grand Resort Cabo"
{{special_requests}}     - "Mesa con vista"
{{hold_amount}}          - "80"
{{confirmation_link}}    - "http://localhost:3000/api/reservations/confirm/123"
```

---

### **Email #2: Pre-Confirmación al Cliente**
**Archivo:** `2-cliente-pre-confirmacion-con-pago.html`
**Cuándo:** Cuando restaurante hace click en "CONFIRMAR"
**Para:** Email del cliente

**Diseño:**
- 🔵 Header azul con logo Solomon's Landing
- ✅ Badge verde "Aprobada por el Restaurante"
- 📋 Tarjeta con todos los detalles
- 🟡 Sección de PAGO muy destacada (naranja/amarillo)
- 💳 Botón "COMPLETAR PAGO AHORA"
- ℹ️ Explicación del hold
- 📍 Ubicación y contacto

**Variables necesarias:**
```
{{to_name}}              - "Juan"
{{reservation_date}}     - "December 20, 2025"
{{reservation_time}}     - "7:00 PM"
{{guests}}               - "4"
{{hotel}}                - "Grand Resort Cabo"
{{special_requests}}     - "Mesa con vista"
{{hold_amount}}          - "80"
{{payment_link}}         - "http://localhost:8005/payment.html?reservation_id=123"
```

---

### **Email #3: Confirmación Final**
**Archivo:** `3-cliente-confirmacion-final-pago-completado.html`
**Cuándo:** Cuando cliente completa el pago del hold
**Para:** Email del cliente

**Diseño:**
- 🟢 Header verde con check gigante ✓
- 🏆 Badge de confirmación
- 🟡 Número de confirmación en amarillo
- 📋 Resumen completo (tarjeta morada)
- ✅ Estado del pago (verde)
- 🌟 Qué esperar al llegar
- 📍 Cómo llegar + Google Maps
- ⚠️ Políticas de cancelación

**Variables necesarias:**
```
{{to_name}}              - "Juan"
{{confirmation_number}}  - "SL-2025-123"
{{reservation_date}}     - "December 20, 2025"
{{reservation_time}}     - "7:00 PM"
{{guests}}               - "4"
{{hold_amount}}          - "80"
```

---

## 🔧 Configuración en EmailJS

### **Paso 1: Crear Template #1 (Restaurante)**

1. Ve a https://dashboard.emailjs.com/admin/templates
2. Click "Create New Template"
3. **Template Name:** `template_restaurante_nueva`
4. **Subject:** 
   ```
   🚨 NUEVA RESERVACIÓN #{{reservation_id}} - {{customer_name}}
   ```
5. **Content:** Copia TODO de `1-restaurante-nueva-reservacion.html`
6. **Save Template**
7. Copia el **Template ID** (ej: `template_abc123`)

---

### **Paso 2: Crear Template #2 (Pre-Confirmación Cliente)**

1. Click "Create New Template"
2. **Template Name:** `template_cliente_preconfirmacion`
3. **Subject:**
   ```
   ✓ Reservación Aprobada - Completa tu Pago | Solomon's Landing
   ```
4. **Content:** Copia TODO de `2-cliente-pre-confirmacion-con-pago.html`
5. **Save Template**
6. Copia el **Template ID**

---

### **Paso 3: Crear Template #3 (Confirmación Final Cliente)**

1. Click "Create New Template"
2. **Template Name:** `template_cliente_confirmacion_final`
3. **Subject:**
   ```
   🎉 ¡CONFIRMADO! Tu reservación en Solomon's Landing
   ```
4. **Content:** Copia TODO de `3-cliente-confirmacion-final-pago-completado.html`
5. **Save Template**
6. Copia el **Template ID**

---

## 📝 Actualizar Configuración

Edita `email-config.js`:

```javascript
const EMAIL_CONFIG = {
    USER_ID: 'gCsJYvChpOqVACgUr',
    SERVICE_ID: 'service_u021fxi',
    
    TEMPLATES: {
        // Email #1: Alerta al restaurante
        RESTAURANT_ALERT: 'template_restaurante_nueva',
        
        // Email #2: Pre-confirmación al cliente
        CUSTOMER_PRE_CONFIRMATION: 'template_cliente_preconfirmacion',
        
        // Email #3: Confirmación final
        CUSTOMER_FINAL_CONFIRMATION: 'template_cliente_confirmacion_final'
    }
};
```

---

## 🚀 Integración con el Código

### **1. Cuando cliente hace reservación** (`chatbot.js`)
```javascript
// Enviar Email #1 al restaurante
await emailService.sendRestaurantAlert({
    name: this.reservationData.name,
    email: this.reservationData.email,
    phone: this.reservationData.phone,
    date: this.reservationData.date,
    time: this.reservationData.time,
    guests: this.reservationData.guests,
    hotelStaying: this.reservationData.hotelStaying,
    specialRequests: this.reservationData.specialRequests
}, reservationId);
```

### **2. Cuando restaurante confirma** (`server/routes/reservations.js`)
```javascript
// GET /api/reservations/confirm/:id
// Enviar Email #2 al cliente
await emailService.sendCustomerPreConfirmation({
    customer_email: reservation.customer_email,
    customer_name: reservation.customer_name,
    reservation_date: reservation.reservation_date,
    reservation_time: reservation.reservation_time,
    party_size: reservation.party_size,
    hotel_staying: reservation.hotel_staying,
    special_requests: reservation.special_requests,
    hold_amount: reservation.hold_amount
}, paymentLink);
```

### **3. Cuando cliente paga** (`server/routes/stripe.js`)
```javascript
// POST /api/stripe/webhook (Stripe webhook)
if (event.type === 'payment_intent.succeeded') {
    // Enviar Email #3 al cliente
    await emailService.sendCustomerFinalConfirmation({
        customer_email: reservation.customer_email,
        customer_name: reservation.customer_name,
        confirmation_number: `SL-${reservationId}`,
        reservation_date: reservation.reservation_date,
        reservation_time: reservation.reservation_time,
        party_size: reservation.party_size,
        hold_amount: reservation.hold_amount
    });
}
```

---

## ✅ Checklist de Implementación

- [ ] Crear los 3 templates en EmailJS
- [ ] Copiar los Template IDs
- [ ] Actualizar `email-config.js` con los nuevos IDs
- [ ] Actualizar `chatbot.js` para Email #1
- [ ] Actualizar `server/routes/reservations.js` para Email #2
- [ ] Crear webhook de Stripe para Email #3
- [ ] Probar flujo completo

---

## 🧪 Probar el Sistema

### Test Email #1 (Restaurante):
1. Abre http://localhost:8005
2. Haz una reservación en el chatbot
3. Verifica que llegue email al restaurante
4. Email debe tener botón verde "CONFIRMAR"

### Test Email #2 (Pre-Confirmación):
1. Click en "CONFIRMAR RESERVACIÓN" del email
2. Verifica que cliente reciba email
3. Email debe tener botón naranja "COMPLETAR PAGO"

### Test Email #3 (Confirmación Final):
1. Cliente hace click en link de pago
2. Completa pago con tarjeta de prueba: 4242 4242 4242 4242
3. Verifica que cliente reciba email de confirmación
4. Email debe mostrar número de confirmación

---

## 📊 Resumen Visual

```
┌─────────────────────────────────────┐
│  CLIENTE HACE RESERVACIÓN           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  📧 EMAIL #1: RESTAURANTE           │
│  • Diseño rojo urgente              │
│  • Toda la info del cliente         │
│  • Botón CONFIRMAR                  │
└──────────────┬──────────────────────┘
               │ Click en botón
               ▼
┌─────────────────────────────────────┐
│  📧 EMAIL #2: CLIENTE               │
│  • Diseño azul profesional          │
│  • "Aprobada por restaurante"       │
│  • Botón PAGAR (naranja)            │
└──────────────┬──────────────────────┘
               │ Cliente paga
               ▼
┌─────────────────────────────────────┐
│  📧 EMAIL #3: CLIENTE               │
│  • Diseño verde éxito ✓             │
│  • Número de confirmación           │
│  • Toda la info + cómo llegar       │
└─────────────────────────────────────┘
```

---

## 🎨 Características de los Diseños

**Email #1 (Restaurante):**
- ❤️ Rojo urgente para llamar atención
- 🔔 "Acción Requerida" destacado
- 📋 Info muy organizada y clara
- 🟢 Botón confirmar imposible de perder

**Email #2 (Cliente Pre-Conf):**
- 🔵 Azul confianza y profesionalismo
- ✅ Badge "Aprobada" para tranquilidad
- 🟡 Sección pago muy destacada
- ℹ️ Explicación clara del hold

**Email #3 (Cliente Final):**
- 🟢 Verde éxito y celebración
- ✓ Check gigante animado
- 🏆 Número de confirmación destacado
- 📍 Toda la info para llegar

---

**¡Sistema de emails profesional de 3 pasos completamente listo! 🎉**
