# 🚀 GUÍA RÁPIDA - Sistema de Reservaciones

## ¿Qué tienes ahora?

✅ **5 páginas web listas** (index.html, menus.html, catering.html, location.html, reservations.html)  
✅ **Sistema de reservaciones sin OpenTable** (ahorras comisiones)  
✅ **Emails automáticos** a ti y al cliente  
✅ **Backend funcional** listo para usar

---

## 📧 PASO 1: Configurar Gmail App Password

Tu email: **condecorporation@gmail.com**

### ¿Qué es un App Password?
Es una contraseña especial de 16 dígitos que permite que aplicaciones (como tu sistema de reservaciones) envíen emails desde tu Gmail.

### Cómo generarlo:

1. **Ir a tu Google Account:**
   - Ve a https://myaccount.google.com/
   - Inicia sesión con condecorporation@gmail.com

2. **Activar 2-Step Verification:**
   - En el menú izquierdo: **Security**
   - Busca **2-Step Verification** 
   - Click en **Get Started** y sigue los pasos
   - Necesitarás tu teléfono para recibir códigos

3. **Crear App Password:**
   - Regresa a **Security**
   - Busca **App passwords** (aparece después de activar 2-Step)
   - Click en **App passwords**
   - En "Select app" elige **Mail**
   - En "Select device" elige **Other** y escribe: "Solomon's Landing"
   - Click **Generate**
   - **COPIA LOS 16 CARACTERES** (ejemplo: `abcd efgh ijkl mnop`)
   - Guárdalo en un lugar seguro

---

## 💻 PASO 2: Instalar y Configurar el Backend

### Opción A: En tu computadora (para probar)

```bash
# 1. Instalar Node.js si no lo tienes
# Descarga desde: https://nodejs.org/

# 2. Ir a la carpeta del proyecto
cd /workspaces/Solomon-s-Landing

# 3. Crear package.json
npm init -y

# 4. Instalar dependencias
npm install express nodemailer cors

# 5. Editar backend-ejemplo-gmail.js
# Reemplaza 'AQUI_TU_APP_PASSWORD' con el App Password de 16 dígitos

# 6. Ejecutar el servidor
node backend-ejemplo-gmail.js
```

El servidor correrá en: `http://localhost:3000`

### Opción B: Desplegar en internet (producción)

#### Usando Railway (GRATIS para empezar):

1. **Crear cuenta en Railway:**
   - Ve a https://railway.app/
   - Registrate con GitHub o email

2. **Crear nuevo proyecto:**
   - Click en **New Project**
   - Selecciona **Deploy from GitHub repo**
   - Conecta tu cuenta de GitHub
   - Selecciona tu repositorio

3. **Configurar variables de entorno:**
   - En Railway, ve a tu proyecto
   - Click en **Variables**
   - Agrega:
     ```
     GMAIL_USER=condecorporation@gmail.com
     GMAIL_APP_PASSWORD=tu_app_password_de_16_digitos
     PORT=3000
     ```

4. **Obtener URL:**
   - Railway te dará una URL como: `https://tu-proyecto.railway.app`
   - Esa será tu URL del backend

#### Usando Vercel (GRATIS):

1. **Crear cuenta:**
   - Ve a https://vercel.com/
   - Registrate con GitHub

2. **Instalar Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

3. **Desplegar:**
   ```bash
   vercel
   # Sigue las instrucciones
   ```

4. **Configurar variables:**
   - En el dashboard de Vercel
   - Settings → Environment Variables
   - Agregar GMAIL_USER y GMAIL_APP_PASSWORD

---

## 🌐 PASO 3: Conectar Frontend con Backend

Edita `app.js` línea ~450:

```javascript
// Reemplaza esto:
const API_URL = 'http://localhost:3000';

// Con tu URL de producción:
const API_URL = 'https://tu-proyecto.railway.app'; // o tu URL de Vercel
```

---

## ✅ PASO 4: Probar el Sistema

### Prueba Local:

1. Abre `reservations.html` en tu navegador
2. Llena el formulario de reservación
3. Click en "Enviar Solicitud"
4. Verifica:
   - ✉️ Email a **condecorporation@gmail.com** (tú)
   - ✉️ Email al cliente

### Prueba en Producción:

1. Sube todo a tu servidor web o GitHub Pages
2. Visita tu sitio: `https://tu-dominio.com`
3. Haz una reservación de prueba
4. Verifica los emails

---

## 📋 Estructura de Archivos

```
Solomon-s-Landing/
│
├── index.html              # Página principal
├── menus.html              # Página de menús
├── catering.html           # Página de catering
├── location.html           # Ubicación y horarios
├── reservations.html       # Formulario de reservaciones ⭐
│
├── styles.css              # Estilos compartidos
├── app.js                  # JavaScript compartido ⭐
│
├── backend-ejemplo-gmail.js    # Backend Node.js ⭐
├── BACKEND-SETUP.md           # Documentación completa
└── INSTRUCCIONES-RAPIDAS.md   # Esta guía
```

---

## 🔧 Solución de Problemas

### No recibo emails

**Verifica:**
1. ✅ App Password es correcto (16 caracteres)
2. ✅ Email en backend: `condecorporation@gmail.com`
3. ✅ 2-Step Verification activado en Gmail
4. ✅ Revisa carpeta SPAM
5. ✅ Verifica logs del servidor: `Error al conectar con Gmail`

### Error 500 al enviar reservación

**Soluciones:**
- Verifica que el servidor esté corriendo
- Revisa la consola del navegador (F12)
- Verifica la URL del API en `app.js`

### Gmail bloquea el envío

**Si Gmail dice "Less secure app":**
- Verifica que estás usando App Password
- NO uses tu contraseña normal de Gmail
- Asegúrate de que 2-Step Verification esté activo

---

## 📊 Límites de Gmail

- **500 emails por día** (más que suficiente)
- **100 destinatarios por mensaje**
- Para un restaurante: perfecto ✅

---

## 💰 Costos

| Servicio | Costo |
|----------|-------|
| Gmail SMTP | **GRATIS** |
| Railway (hosting) | **GRATIS** hasta 500 horas/mes |
| Vercel (hosting) | **GRATIS** (plan Hobby) |
| **Total** | **$0 USD/mes** 🎉 |

### Comparación con OpenTable:
- OpenTable: **~15-20%** de comisión por reservación
- Tu sistema: **$0** 
- **Ahorro anual:** Miles de dólares 💰

---

## 🚀 Siguiente Nivel (Opcional)

### 1. Base de Datos (guardar historial)
- Agrega MySQL o PostgreSQL
- Guarda todas las reservaciones
- Ve estadísticas y reportes

### 2. Panel de Administración
- Crea una página admin.html
- Ve todas las reservaciones
- Confirma/cancela desde el navegador

### 3. Email Profesional
- Usa un dominio propio: reservations@solomonslanding.com
- Usa SendGrid (100 emails/día gratis)
- Más profesional que Gmail

---

## 📞 Contacto de Soporte

Si tienes problemas:

1. **Revisa los logs del servidor** (en la terminal)
2. **Verifica la consola del navegador** (F12 → Console)
3. **Lee BACKEND-SETUP.md** (documentación completa)

---

## ✨ ¡Listo!

Ya tienes un sistema de reservaciones profesional sin pagar comisiones a OpenTable.

**Tu sistema incluye:**
- ✅ 5 páginas web profesionales
- ✅ Formulario de reservaciones
- ✅ Emails automáticos duales
- ✅ Backend funcional
- ✅ $0 de costos mensuales
- ✅ Control total

**¡Ahorra comisiones y ten control total de tus reservaciones! 🎉**
