# 🔄 Actualizar Templates de EmailJS - Solomon's Landing

## ⚡ Ya Tienes EmailJS Configurado

**Tus credenciales actuales:**
- ✅ Service ID: `service_u021fxi`
- ✅ Public Key: `gCsJYvChpOqVACgUr`
- ✅ Template Cliente: `template_swvqncq` 
- ✅ Template Restaurante: `template_ij3p83j`

---

## 🎨 Mejoras Implementadas

### **ANTES:**
- Emails básicos con información simple
- Cliente recibía email inmediatamente
- Sin flujo de confirmación del restaurante

### **AHORA:**
- ✅ Emails super profesionales con diseño premium
- ✅ Cliente NO recibe email hasta que restaurante confirme
- ✅ Restaurante recibe alerta urgente con botón confirmar
- ✅ Flujo de aprobación completo

---

## 📧 Pasos para Actualizar

### **Paso 1: Actualizar Template del Restaurante**

1. Ve a [EmailJS Dashboard](https://dashboard.emailjs.com/admin/templates)
2. Busca el template `template_ij3p83j`
3. Click en **"Edit"**
4. **Subject** (cambiar a):
   ```
   🚨 NUEVA RESERVACIÓN #{{reservation_id}} - {{customer_name}}
   ```

5. **Content** (reemplazar TODO el HTML con):
   - Abre el archivo `/email-templates/restaurant-alert.html`
   - Copia TODO el contenido (Ctrl+A, Ctrl+C)
   - Pega en EmailJS (reemplaza todo lo que hay)

6. Click en **"Save"**

7. **Test el template** con estos datos:
   ```
   reservation_id: 123
   customer_name: Juan Pérez
   customer_email: test@email.com
   customer_phone: +52 624 123 4567
   date: 2025-12-20
   time: 7:00 PM
   guests: 4
   hotel: Grand Resort Cabo
   special_requests: Mesa con vista al mar
   hold_amount: 80
   confirmation_link: http://localhost:3000/api/reservations/confirm/123
   ```

8. Revisa el email de prueba - debe verse así:
   - 🔴 Header rojo urgente
   - 🟡 ID de reservación en amarillo
   - 📋 Información organizada en tarjetas
   - 🟢 Botón verde gigante "CONFIRMAR RESERVACIÓN"

---

### **Paso 2: Actualizar Template del Cliente**

1. En [EmailJS Dashboard](https://dashboard.emailjs.com/admin/templates)
2. Busca el template `template_swvqncq`
3. Click en **"Edit"**
4. **Subject** (cambiar a):
   ```
   ✓ Reservación Confirmada - Solomon's Landing
   ```

5. **Content** (reemplazar TODO el HTML con):
   - Abre el archivo `/email-templates/customer-confirmation.html`
   - Copia TODO el contenido (Ctrl+A, Ctrl+C)
   - Pega en EmailJS (reemplaza todo)

6. Click en **"Save"**

7. **Test el template** con estos datos:
   ```
   to_name: María
   reservation_date: December 20, 2025
   reservation_time: 7:00 PM
   guests: 4
   hotel: Grand Resort Cabo
   special_requests: Window seat please
   hold_amount: 80
   payment_link: http://localhost:8005/payment.html?reservation_id=123
   ```

8. Revisa el email - debe verse así:
   - 🔵 Header azul profesional
   - ✓ Badge verde "Confirmed by Restaurant"
   - 💎 Diseño premium
   - 💳 Sección de pago destacada

---

### **Paso 3: Actualizar Variables en Template Restaurante**

En el template `template_ij3p83j`, asegúrate de tener TODAS estas variables:

```
{{reservation_id}}       ← Nuevo
{{customer_name}}        ← Ya existe
{{customer_email}}       ← Ya existe
{{customer_phone}}       ← Ya existe
{{date}}                 ← Ya existe
{{time}}                 ← Ya existe
{{guests}}               ← Ya existe
{{hotel}}                ← Nuevo
{{special_requests}}     ← Ya existe
{{hold_amount}}          ← Nuevo
{{confirmation_link}}    ← MUY IMPORTANTE (nuevo)
```

**La variable `{{confirmation_link}}` es CRÍTICA** - sin ella, el restaurante no puede confirmar.

---

### **Paso 4: Actualizar Variables en Template Cliente**

En el template `template_swvqncq`, asegúrate de tener TODAS estas variables:

```
{{to_name}}              ← Ya existe  
{{reservation_date}}     ← Ya existe
{{reservation_time}}     ← Ya existe
{{guests}}               ← Ya existe
{{hotel}}                ← Nuevo
{{special_requests}}     ← Ya existe
{{hold_amount}}          ← Nuevo
{{payment_link}}         ← Ya existe
```

---

## 🔧 Cambios en el Código

**Archivos ya actualizados:**
- ✅ `/email-config.js` - Configurado con tus credenciales
- ✅ `/chatbot.js` - Solo envía email al restaurante
- ✅ `/server/routes/reservations.js` - Envía email al cliente al confirmar

**Flujo nuevo:**
```
1. Cliente hace reservación 
   └─→ chatbot.js llama emailService.sendRestaurantAlert()
   └─→ Email solo al restaurante

2. Restaurante recibe email
   └─→ Click en "CONFIRMAR RESERVACIÓN"
   └─→ /api/reservations/confirm/:id

3. Backend confirma
   └─→ Actualiza status = 'confirmed'
   └─→ [PENDIENTE] Llama emailService.sendCustomerConfirmation()
   └─→ Email al cliente
```

---

## 🚨 Importante: Configurar Email del Restaurante

En `email-config.js` línea 46:
```javascript
to_email: 'solomonslanding@gmail.com', // Email del restaurante
```

**Verifica que este sea el email correcto del restaurante.**

Si usas otro email, cámbialo en `email-config.js`.

---

## 🧪 Probar el Sistema

### **Test 1: Email al Restaurante**

1. Abre tu sitio: http://localhost:8005
2. Click en el chatbot
3. Escribe "reservation"
4. Completa todos los datos
5. Confirma con "yes"

**Debe pasar:**
- ✅ Chatbot muestra link de pago
- ✅ Email llega al restaurante con diseño nuevo
- ✅ Email tiene botón "CONFIRMAR RESERVACIÓN"
- ✅ Cliente NO recibe email todavía

### **Test 2: Confirmación del Restaurante**

1. Abre el email que recibió el restaurante
2. Click en "CONFIRMAR RESERVACIÓN"
3. Debe abrir página de confirmación

**Debe pasar:**
- ✅ Página muestra "Reservación Confirmada"
- ✅ [Pendiente] Cliente recibe email de confirmación

### **Test 3: Email al Cliente**

**NOTA:** El email al cliente desde el backend requiere configuración adicional.

Opciones:
1. **Configurar EmailJS en el backend** (Node.js)
2. **Usar webhook** que llame a EmailJS desde frontend
3. **Usar servicio de email del servidor** (nodemailer + Gmail)

---

## 🔄 Próximo Paso: Configurar Email al Cliente

Para que el cliente reciba email cuando el restaurante confirme, necesitas:

**Opción A - EmailJS desde Node.js:**
```bash
npm install @emailjs/nodejs
```

**Opción B - Webhook + Frontend:**
Crear endpoint que llame a EmailJS desde el navegador.

**Opción C - Nodemailer (Recomendado para producción):**
```bash
npm install nodemailer
```

¿Cuál prefieres?

---

## 📋 Checklist Final

- [ ] Actualizar template_ij3p83j (restaurante) con nuevo HTML
- [ ] Actualizar template_swvqncq (cliente) con nuevo HTML
- [ ] Verificar todas las variables en ambos templates
- [ ] Probar envío al restaurante
- [ ] Configurar envío al cliente desde backend
- [ ] Probar flujo completo

---

## 🎯 Resultado Final

**Cuando termines:**
1. Cliente hace reservación → Solo ve link de pago en chatbot
2. Restaurante recibe email urgente profesional
3. Restaurante confirma → Cliente recibe email profesional
4. Cliente paga hold de Stripe
5. ✅ Reservación 100% confirmada

**Emails super profesionales, flujo controlado, experiencia premium.** 🎉
