# 🏗️ Solomon's Landing - Estructura del Proyecto

## 📂 Organización

```
Solomon-s-Landing/
│
├── 🌐 website/              → Página web pública
│   ├── index.html
│   ├── reservations.html    (EmailJS)
│   ├── menus.html
│   ├── chatbot.js
│   └── ...
│
├── 💻 pos-app/              → Sistema POS del restaurante
│   ├── dashboard.html
│   ├── login.html
│   └── ...
│
├── 📅 reservation-system/   → Sistema de reservaciones interno (futuro)
│   └── README.md
│
├── 📚 docs/                 → Documentación del proyecto
│   ├── *.md
│   └── README.md
│
└── 🔧 server/               → Backend Node.js (para desarrollo)
```

## 🎯 Separación de sistemas

Cada carpeta es **independiente** para que:
- ✅ Los cambios en un sistema no afecten a otros
- ✅ Más fácil de mantener y escalar
- ✅ Deployment independiente de cada parte

## 🚀 Trabajo actual

Actualmente trabajando en: **website/** 

El sistema de reservaciones se desarrollará después.

## 📱 Servidor de desarrollo

```bash
python3 -m http.server 8080
```

- Website: http://localhost:8080/website/
- POS App: http://localhost:8080/pos-app/

---

**Última actualización:** Diciembre 14, 2025
