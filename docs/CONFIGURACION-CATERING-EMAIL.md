# 📧 Configuración Email para Cotizaciones de Catering

## ✅ Ya Configurado en el Código

El formulario de catering en `catering.html` ya está configurado para enviar cotizaciones a **bertinamia@gmail.com** usando EmailJS.

---

## 🚀 Paso Final: Crear Template en EmailJS

### **1. Ir a EmailJS Dashboard**
1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Inicia sesión con tu cuenta
3. Ve a **"Email Templates"**

### **2. Crear Nuevo Template**
1. Click en **"Create New Template"**
2. **Template ID:** `template_catering_quote`
3. **Template Name:** "Cotización de Catering - Solomon's Landing"

### **3. Configurar el Email**

**Subject (Asunto):**
```
🎉 Nueva Cotización de Catering - {{event_type}} - {{guest_count}} personas
```

**To Email (Destinatario):**
```
bertinamia@gmail.com
```

**From Name (Nombre del Remitente):**
```
Cotización Catering - {{from_name}}
```

**Reply To:**
```
{{from_email}}
```

**Content (HTML del Email):**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            background-color: #f5f5f5;
        }
        .email-container {
            background-color: white;
            margin: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #165B33 0%, #C41E3A 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
        }
        .content {
            padding: 30px;
        }
        .info-section {
            background-color: #f9fafb;
            border-left: 4px solid #165B33;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: 600;
            color: #165B33;
        }
        .value {
            color: #333;
        }
        .message-box {
            background-color: #fff9e6;
            border: 1px solid #ffd700;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .footer {
            background-color: #165B33;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 14px;
        }
        .badge {
            display: inline-block;
            background-color: #C41E3A;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>🎉 Nueva Cotización de Catering</h1>
            <p style="margin: 10px 0 0 0;">Solomon's Landing - Los Cabos</p>
        </div>
        
        <div class="content">
            <h2 style="color: #165B33;">Información del Cliente</h2>
            
            <div class="info-section">
                <div class="info-row">
                    <span class="label">👤 Nombre:</span>
                    <span class="value">{{from_name}}</span>
                </div>
                <div class="info-row">
                    <span class="label">📧 Email:</span>
                    <span class="value">{{from_email}}</span>
                </div>
                <div class="info-row">
                    <span class="label">📱 Teléfono:</span>
                    <span class="value">{{phone}}</span>
                </div>
            </div>
            
            <h2 style="color: #165B33;">Detalles del Evento</h2>
            
            <div class="info-section">
                <div class="info-row">
                    <span class="label">🎊 Tipo de Evento:</span>
                    <span class="value">{{event_type}}</span>
                </div>
                <div class="info-row">
                    <span class="label">📅 Fecha del Evento:</span>
                    <span class="value">{{event_date}}</span>
                </div>
                <div class="info-row">
                    <span class="label">👥 Número de Invitados:</span>
                    <span class="value"><strong>{{guest_count}} personas</strong></span>
                </div>
            </div>
            
            <h2 style="color: #165B33;">Mensaje del Cliente</h2>
            
            <div class="message-box">
                <p><strong>Detalles adicionales:</strong></p>
                <p>{{message}}</p>
            </div>
            
            <div style="background-color: #e8f5e9; padding: 20px; border-radius: 5px; margin-top: 30px; text-align: center;">
                <p style="margin: 0; color: #165B33; font-weight: 600;">⏰ Responde dentro de 24 horas para mejor conversión</p>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">
                    Puedes responder directamente a este email ({{from_email}})
                </p>
            </div>
        </div>
        
        <div class="footer">
            <p style="margin: 0;">Solomon's Landing Restaurant</p>
            <p style="margin: 5px 0;">📞 +52 624 219 3228</p>
            <p style="margin: 5px 0;">📧 bertinamia@gmail.com</p>
            <p style="margin: 15px 0 0 0; font-size: 12px; opacity: 0.8;">
                Los Cabos, Baja California Sur, México
            </p>
        </div>
    </div>
</body>
</html>
```

### **4. Variables Disponibles**

El formulario envía estas variables que puedes usar en el template:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{from_name}}` | Nombre del cliente | "Juan Pérez" |
| `{{from_email}}` | Email del cliente | "juan@email.com" |
| `{{phone}}` | Teléfono | "+52 624 123 4567" |
| `{{event_date}}` | Fecha del evento | "2025-12-25" |
| `{{guest_count}}` | Número de invitados | "50" |
| `{{event_type}}` | Tipo de evento | "wedding", "corporate", etc. |
| `{{message}}` | Mensaje adicional del cliente | "Preferimos menú vegetariano..." |
| `{{to_email}}` | Email destino (siempre bertinamia@gmail.com) | "bertinamia@gmail.com" |

### **5. Guardar Template**
1. Click en **"Save"** en la esquina superior derecha
2. Click en **"Test"** para enviar un email de prueba
3. Verifica que llegue a **bertinamia@gmail.com**

---

## ✅ Verificación

### **Probar el Formulario:**
1. Ve a http://localhost:8000/catering.html
2. Baja a la sección "Get Your Free Quote"
3. Llena el formulario con datos de prueba
4. Click en "Request Quote"
5. Verifica que:
   - Aparezca mensaje "✅ Quote request sent successfully!"
   - Llegue email a bertinamia@gmail.com
   - El email contenga toda la información del cliente

### **Si no funciona:**

**Error común:** Template ID no coincide
- ✅ En EmailJS debe ser exactamente: `template_catering_quote`
- ✅ En catering.html línea 381: `'template_catering_quote'`

**Error común:** Service ID incorrecto
- ✅ Verifica que uses el mismo Service ID: `service_u021fxi`

---

## 📋 Checklist Final

- [ ] Template `template_catering_quote` creado en EmailJS
- [ ] Template configurado para enviar a bertinamia@gmail.com
- [ ] Todas las variables configuradas ({{from_name}}, {{event_type}}, etc.)
- [ ] Template guardado y probado
- [ ] Formulario probado desde el sitio web
- [ ] Email de prueba recibido correctamente en bertinamia@gmail.com

---

## 🎯 Resultado Final

Cuando un cliente solicita una cotización de catering:

1. ✉️ **INMEDIATAMENTE** recibes email en bertinamia@gmail.com con:
   - Nombre y contacto del cliente
   - Tipo de evento (boda, corporativo, etc.)
   - Fecha del evento
   - Número de invitados
   - Mensaje/preferencias del cliente

2. ✅ Puedes responder directamente al email del cliente
3. ✅ El cliente ve mensaje de confirmación en el sitio
4. ✅ Sistema completamente automatizado

---

## 📞 Soporte

Si tienes problemas:
- Revisa la consola del navegador (F12) para errores
- Verifica que el Service ID y Template ID coincidan exactamente
- Prueba enviar un email de prueba desde el dashboard de EmailJS
- Verifica que bertinamia@gmail.com no tenga filtros de spam
