# 🏖️ Solomon's Landing

**Restaurante de comida internacional en Cabo San Lucas, México**

## 📂 Estructura del Proyecto

```
Solomon-s-Landing/
│
├── 🌐 website/              → Página web pública del restaurante
│   ├── index.html           (Página principal)
│   ├── reservations.html    (Sistema de reservaciones con EmailJS)
│   ├── menus.html           (Menús)
│   ├── chatbot.js           (Asistente virtual bilingüe)
│   └── ...
│
├── 💻 pos-app/              → Sistema POS del restaurante
│   ├── dashboard.html       (Panel de control)
│   ├── login.html           (Acceso)
│   └── ...
│
├── 📅 reservation-system/   → Sistema de gestión de reservaciones (futuro)
│   └── README.md            (Documentación)
│
├── 📚 docs/                 → Documentación del proyecto
│   └── *.md                 (Guías e instrucciones)
│
└── 🔧 server/               → Backend Node.js (desarrollo)
```

## 🚀 Inicio Rápido

### Servidor Local

```bash
# En la raíz del proyecto
python3 -m http.server 8080
```

### Acceso

- **Website**: http://localhost:8080/website/
- **POS App**: http://localhost:8080/pos-app/
- **Docs**: http://localhost:8080/docs/

## 📧 Sistema de Emails (EmailJS)

Configurado en `website/email-config.js`

- Service ID: `service_u021fxi`
- Template Restaurant: `template_ij3p83j`
- Template Cliente: `template_swvqncq`

## 🤖 Chatbot

Asistente virtual bilingüe (EN/ES) para:
- Reservaciones
- Información del menú
- Catering
- Ubicación
- Preguntas generales

## 📱 Contacto

- **Teléfono**: +52 624 219 3228
- **Email**: reservations@solomonslanding.com
- **Ubicación**: Marina Cabo San Lucas

## 🔐 Seguridad

Cada sistema está **separado** para mantener:
- ✅ Independencia entre sistemas
- ✅ Facilidad de mantenimiento
- ✅ Deployment seguro

## 📝 Trabajo Actual

🎯 **Enfocados en**: `website/`

El sistema de reservaciones se desarrollará después.

---

**Última actualización**: Diciembre 14, 2025
