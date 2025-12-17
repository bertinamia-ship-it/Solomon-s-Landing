# 📧 Configuración de EmailJS - Guía Completa

## ✅ Flujo de Emails Actualizado

### **ANTES (Problema):**
- Cliente hace reservación → ✉️ Recibe confirmación inmediatamente
- Restaurante recibe alerta
- ❌ Cliente recibe confirmación ANTES de que restaurante verifique disponibilidad

### **AHORA (Correcto):**
1. Cliente hace reservación → 💾 Se guarda en base de datos
2. ✉️ **SOLO el restaurante** recibe email con botón "CONFIRMAR RESERVACIÓN"
3. Restaurante verifica disponibilidad y hace click en "CONFIRMAR"
4. ✉️ **AHORA SÍ el cliente** recibe email de confirmación con link de pago
5. Cliente completa el hold de Stripe
6. ✅ Reservación completamente confirmada

---

## 🚀 Pasos para Configurar EmailJS

### **Paso 1: Crear Cuenta**
1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click en "Sign Up"
3. Usa tu email del restaurante: `solomonslanding@gmail.com`
4. Verifica tu email

### **Paso 2: Conectar Gmail**
1. En el dashboard, ve a **"Email Services"**
2. Click en **"Add New Service"**
3. Selecciona **"Gmail"**
4. Autoriza con la cuenta de Gmail del restaurante
5. Copia el **Service ID** que te da (ej: `service_abc123`)

### **Paso 3: Crear Template para Restaurante**
1. Ve a **"Email Templates"**
2. Click en **"Create New Template"**
3. **Template Name:** `template_restaurant_alert`
4. **Subject:** `🚨 NUEVA RESERVACIÓN #{{reservation_id}} - {{customer_name}}`
5. **Content:** Pega el HTML de `email-templates/restaurant-alert.html`
6. Click en **"Test"** para probar
7. **Save Template**

### **Paso 4: Crear Template para Cliente**
1. Click en **"Create New Template"**
2. **Template Name:** `template_customer_confirm`
3. **Subject:** `✓ Reservación Confirmada - Solomon's Landing`
4. **Content:** Pega el HTML de `email-templates/customer-confirmation.html`
5. **Test** con datos de ejemplo
6. **Save Template**

### **Paso 5: Obtener API Keys**
1. Ve a **"Account"** > **"API Keys"**
2. Copia tu **User ID** (ej: `user_xyz789`)
3. Copia tu **Private Key** (opcional, para backend)

### **Paso 6: Configurar en tu Sitio**
Edita el archivo `email-config.js`:

```javascript
const EMAIL_CONFIG = {
    // Tu User ID de EmailJS
    USER_ID: 'user_xyz789', // ← Reemplaza con el tuyo
    
    // Service ID de Gmail
    SERVICE_ID: 'service_abc123', // ← Reemplaza con el tuyo
    
    // Template IDs (deben coincidir exactamente)
    TEMPLATES: {
        CUSTOMER_CONFIRMATION: 'template_customer_confirm',
        RESTAURANT_ALERT: 'template_restaurant_alert'
    }
};
```

### **Paso 7: Prueba el Sistema**
1. Abre tu sitio web
2. Haz una reservación de prueba
3. Verifica que llegue email al restaurante
4. Click en "CONFIRMAR RESERVACIÓN" en el email
5. Verifica que llegue email de confirmación al cliente

---

## 📋 Checklist de Variables EmailJS

### Template Restaurante (`template_restaurant_alert`):
```
{{reservation_id}}      → ID de la reservación
{{customer_name}}       → Nombre del cliente
{{customer_email}}      → Email del cliente  
{{customer_phone}}      → Teléfono del cliente
{{date}}                → Fecha de reservación
{{time}}                → Hora de reservación
{{guests}}              → Número de personas
{{hotel}}               → Hotel donde se hospedan
{{special_requests}}    → Peticiones especiales
{{hold_amount}}         → Monto del hold ($20 x personas)
{{confirmation_link}}   → Link para confirmar (importante!)
```

### Template Cliente (`template_customer_confirm`):
```
{{to_name}}             → Nombre del cliente
{{reservation_date}}    → Fecha
{{reservation_time}}    → Hora
{{guests}}              → Personas
{{hotel}}               → Hotel
{{special_requests}}    → Peticiones
{{hold_amount}}         → Monto
{{payment_link}}        → Link de pago Stripe
```

---

## 🎨 Diseño de los Emails

### **Email al Restaurante:**
- ✅ Header rojo con animación (alerta urgente)
- ✅ ID de reservación destacado en amarillo
- ✅ Toda la información del cliente organizada
- ✅ Botón verde grande "CONFIRMAR RESERVACIÓN"
- ✅ Checklist de pasos a seguir
- ✅ Links directos para llamar/email al cliente
- ✅ Diseño responsive para móvil

### **Email al Cliente:**
- ✅ Header azul profesional (confianza)
- ✅ Badge verde "Confirmed by Restaurant"
- ✅ Detalles de reservación con iconos
- ✅ Sección de pago destacada
- ✅ Información importante sobre el hold
- ✅ Ubicación y contacto
- ✅ Footer con redes sociales
- ✅ Diseño responsive

---

## 🔧 Troubleshooting

### **No llegan los emails:**
1. Verifica que el Service ID esté activo en EmailJS
2. Revisa la consola del navegador (F12) para errores
3. Confirma que los Template IDs coincidan exactamente
4. Verifica que Gmail esté autorizado correctamente

### **Emails llegan a SPAM:**
1. En EmailJS, ve a Email Services → Settings
2. Activa "Custom domain verification" 
3. O usa un servicio SMTP profesional como SendGrid

### **Variables no se reemplazan:**
1. Verifica que uses `{{variable}}` (doble llave)
2. Los nombres deben coincidir EXACTAMENTE
3. En EmailJS, usa el botón "Test" para verificar

---

## 💰 Límites del Plan Gratis

EmailJS Plan Gratis:
- ✅ 200 emails por mes
- ✅ 2 templates
- ✅ Gmail/Outlook integración
- ❌ No custom domain
- ❌ No soporte prioritario

**Para restaurante:**
- 200 emails = 100 reservaciones al mes
- Si necesitas más, upgrade a $15/mes (hasta 1000 emails)

---

## 🔐 Seguridad

⚠️ **IMPORTANTE:**
- NUNCA compartas tu Private Key públicamente
- El User ID es público (va en el frontend)
- El Service ID es público
- Los Template IDs son públicos
- Solo la Private Key debe estar en backend/privada

---

## 📝 Archivos Creados

```
/email-config.js                              ← Configuración EmailJS
/email-templates/
    ├── customer-confirmation.html            ← Email profesional cliente
    └── restaurant-alert.html                 ← Email urgente restaurante
```

---

## 🎯 Próximos Pasos

1. ✅ Crea cuenta en EmailJS
2. ✅ Conecta Gmail
3. ✅ Crea los 2 templates
4. ✅ Edita `email-config.js` con tus credenciales
5. ✅ Prueba con una reservación
6. ✅ Verifica que el restaurante reciba el email
7. ✅ Confirma desde el email
8. ✅ Verifica que el cliente reciba confirmación

---

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Verifica los logs del servidor Node.js
3. Usa el Test en EmailJS dashboard
4. Revisa SPAM en Gmail

---

**¡Listo! Tu sistema de emails está configurado profesionalmente. 🎉**
