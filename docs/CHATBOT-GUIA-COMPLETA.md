# 🤖 Chatbot de Solomon's Landing - Guía Completa

## ✅ ESTADO: IMPLEMENTADO EN TODAS LAS PÁGINAS

El chatbot está funcionando en las 6 páginas del sitio:
- ✅ index.html (Home)
- ✅ menus.html (Menús)
- ✅ reviews.html (Reseñas)
- ✅ catering.html (Catering)
- ✅ location.html (Ubicación)
- ✅ reservations.html (Reservaciones)

---

## 🎯 Funcionalidades del Chatbot

### 1. **Asistencia Bilingüe (Inglés/Español)**
- **Idioma por defecto:** Inglés
- **Detección automática:** Reconoce español cuando el usuario escribe palabras en español
- Cambia dinámicamente entre idiomas según el contexto

**Ejemplo:**
```
Usuario: "hola" → El chatbot cambia a español
Usuario: "hello" → El chatbot cambia a inglés
```

### 2. **Sistema de Reservaciones Completo**

El chatbot guía al cliente paso a paso:

1. **Nombre completo**
2. **Email** (valida formato)
3. **Teléfono**
4. **Fecha** (acepta "today", "tomorrow", "hoy", "mañana" o fechas específicas)
5. **Hora**
6. **Número de personas**
7. **Solicitudes especiales:**
   - Alergias alimentarias
   - Restricciones dietéticas
   - Ocasiones especiales (cumpleaños, aniversario)
   - Preferencias de asiento
8. **Confirmación** de todos los datos
9. **Envío de emails** (al cliente y al restaurante)

### 3. **Respuestas a Preguntas Frecuentes**

#### 📍 **Ubicación/Direcciones**
Palabras clave que reconoce:
- location, where, address, directions, how to get, find you
- ubicación, dónde, dirección, cómo llegar

Respuesta: Muestra la dirección completa y link a location.html

#### 🍽️ **Menú**
Palabras clave:
- menu, food, eat, dish, cuisine
- menú, comida, platillos, platos

Respuesta: Información de menús y link a menus.html

#### ⏰ **Horarios**
Palabras clave:
- hours, open, close, when, time
- horario, abierto, cerrado, cuándo

Respuesta: Horarios completos de operación

#### 📅 **Reservaciones**
Palabras clave:
- reservation, reserve, book, table, booking
- reservación, reservar, mesa

Respuesta: Inicia el proceso de reservación

---

## 💻 Arquitectura Técnica

### Archivos del Sistema

```
chatbot.js          → Lógica del chatbot (clase RestaurantChatbot)
chatbot.css         → Estilos del widget
chatbot-init.js     → Inicialización automática en todas las páginas
```

### Cómo Funciona

1. **chatbot.js** - Contiene la clase `RestaurantChatbot`:
   - Gestión de conversaciones
   - Detección de idioma
   - Validación de datos
   - Procesamiento de mensajes
   - Generación de respuestas

2. **chatbot.css** - Estilos completos:
   - Botón flotante con animación
   - Ventana de chat responsive
   - Mensajes con avatares
   - Animación de "typing dots"
   - Quick reply buttons

3. **chatbot-init.js** - Inicialización automática:
   - Se ejecuta cuando la página carga
   - Crea el widget HTML dinámicamente
   - Configura todos los event listeners
   - Gestiona el estado del chat

### Integración en las Páginas

Cada página solo necesita 3 líneas:

```html
<!-- En el <head> -->
<link rel="stylesheet" href="chatbot.css">

<!-- Antes de </body> -->
<script src="chatbot.js"></script>
<script src="chatbot-init.js"></script>
```

---

## 🎨 Características de la Interfaz

### Botón Flotante
- **Posición:** Esquina inferior derecha
- **Icono:** 💬
- **Animación:** Pulse continuo
- **Notificación:** Badge roja aparece después de 3 segundos

### Ventana de Chat
- **Tamaño:** 380px × 550px
- **Responsive:** Se ajusta en móviles
- **Header:** Logo del restaurante 🏖️, estado "Online"
- **Mensajes:** Burbujas diferenciadas para bot (blanco) y usuario (azul)
- **Quick Replies:** Botones rápidos para acciones comunes

### Animaciones
- ✨ Slide up al abrir
- 💬 Typing dots mientras el bot "piensa"
- 🌊 Fade in de mensajes
- ✨ Bounce en notificación

---

## 📧 Sistema de Emails

### Estado Actual: CONFIGURACIÓN PENDIENTE

El chatbot está listo para enviar emails, pero necesitas configurar EmailJS.

**Ver:** `CONFIGURACION-EMAIL-CHATBOT.md` para instrucciones paso a paso.

### Lo que hace cuando completa una reservación:

1. **Email al Cliente:**
   - Confirmación de reservación
   - Detalles completos (fecha, hora, personas, etc.)
   - Información de contacto del restaurante
   - Ubicación

2. **Email al Restaurante (tu correo):**
   - Notificación de nueva reservación
   - Datos completos del cliente
   - Solicitudes especiales resaltadas
   - Recordatorio para confirmar en 2 horas

### Configuración Actual (Temporal)

Mientras configuras EmailJS, el chatbot:
- ✅ Recopila todos los datos correctamente
- ✅ Muestra confirmación al usuario
- 📝 Registra la información en console.log
- ⏸️ NO envía emails (esperando configuración)

**Para ver las reservaciones en testing:**
1. Abre DevTools (F12)
2. Ve a la pestaña "Console"
3. Completa una reservación
4. Verás todos los datos en el log

---

## 🧪 Cómo Probar el Chatbot

### Prueba Básica (Preguntas)

1. Abre cualquier página del sitio
2. Espera 3 segundos (aparecerá notificación)
3. Haz clic en el botón 💬
4. Prueba estos mensajes:

```
"hello" → Mensaje de bienvenida
"where are you located?" → Dirección
"what time are you open?" → Horarios
"menu" → Información de menús
"help" → Lista de opciones
```

### Prueba en Español

```
"hola" → Mensaje de bienvenida en español
"dónde están ubicados?" → Dirección
"horarios" → Información de horarios
"menú" → Información de menús
```

### Prueba de Reservación (Proceso Completo)

1. Escribe: "I want to make a reservation"
2. Sigue las instrucciones del bot:
   - Nombre: "John Doe"
   - Email: "john@example.com"
   - Teléfono: "+1 234 567 8900"
   - Fecha: "tomorrow"
   - Hora: "7:00 PM"
   - Personas: "4"
   - Solicitudes: "Birthday celebration, window seat"
3. Confirma: "yes"
4. ✅ Verás mensaje de confirmación

### Prueba de Validación

El chatbot valida:
- ❌ Email inválido → "Please enter a valid email"
- ❌ Número de personas inválido → "Please enter a valid number"
- ❌ Respuestas fuera de contexto → "I'm not sure I understood that"

---

## 🔧 Personalización

### Cambiar los Mensajes del Bot

Edita `chatbot.js`, busca la sección `responses`:

```javascript
responses = {
    en: {
        greeting: "Tu mensaje personalizado aquí...",
        directions: "...",
        // etc.
    },
    es: {
        greeting: "Tu mensaje personalizado aquí...",
        // etc.
    }
}
```

### Cambiar el Email del Restaurante

En `chatbot-init.js`, busca:

```javascript
console.log('Restaurant Email: solomonslanding@gmail.com');
```

Y en `chatbot.js`, busca:

```javascript
to_restaurant: 'solomonslanding@gmail.com'
```

### Modificar Estilos

Edita `chatbot.css`:

```css
.chatbot-button {
    /* Cambia colores, tamaño, posición */
}

.chatbot-window {
    /* Cambia dimensiones, colores */
}
```

### Agregar Nuevas Palabras Clave

En `chatbot.js`, método `handleGeneralQuery()`:

```javascript
// Ejemplo: Agregar respuesta para "parking"
if (this.matchesKeywords(message, [
    'parking', 'estacionamiento', 'park', 'where to park'
])) {
    return "We offer free parking at the Marina...";
}
```

---

## 📱 Responsive Design

El chatbot se adapta automáticamente:

### Desktop (> 768px)
- Botón: 60px × 60px
- Ventana: 380px × 550px
- Posición: Esquina inferior derecha

### Mobile (< 768px)
- Botón: 55px × 55px
- Ventana: Casi pantalla completa
- Posición: Centrado

---

## ⚡ Performance

### Optimizaciones Implementadas

1. **Lazy Loading:** El widget solo se crea cuando la página carga
2. **Event Delegation:** Listeners eficientes
3. **Debouncing:** Delay aleatorio en respuestas (800-1500ms) para simular escritura natural
4. **Scroll Optimization:** ScrollToBottom solo cuando es necesario

### Tamaño de Archivos

```
chatbot.js      → ~12 KB (sin comprimir)
chatbot.css     → ~8 KB (sin comprimir)
chatbot-init.js → ~10 KB (sin comprimir)
Total: ~30 KB
```

---

## 🐛 Troubleshooting

### El chatbot no aparece

1. Verifica que los 3 archivos estén cargados:
   ```html
   <link rel="stylesheet" href="chatbot.css">
   <script src="chatbot.js"></script>
   <script src="chatbot-init.js"></script>
   ```

2. Abre DevTools (F12) → Console
3. Busca errores en rojo

### El botón aparece pero no responde

- Verifica que `chatbot.js` se cargue ANTES de `chatbot-init.js`
- Revisa la consola por errores de JavaScript

### Los mensajes no se formatean bien

- Verifica que `chatbot.css` esté cargado
- Comprueba que no haya conflictos con otros estilos

### La detección de idioma no funciona

- El chatbot detecta español por palabras clave
- Si no cambia, agrega más palabras clave en el array `spanishKeywords`

---

## 🚀 Próximos Pasos

### 1. Configurar EmailJS (PRIORITARIO)
- Sigue `CONFIGURACION-EMAIL-CHATBOT.md`
- Tiempo estimado: 15-20 minutos
- Costo: Gratis (hasta 200 emails/mes)

### 2. Pruebas con Usuarios Reales
- Pide a amigos/familia que prueben
- Recopila feedback
- Ajusta mensajes según necesidad

### 3. Analítica (Opcional)
- Agregar Google Analytics events
- Trackear: conversaciones iniciadas, reservaciones completadas, preguntas frecuentes

### 4. Mejoras Futuras (Opcional)
- Integración con sistema de reservaciones existente
- Conexión con calendario real
- Notificaciones push
- Historial de conversaciones

---

## 📞 Soporte

Si tienes dudas sobre el chatbot:

1. **Revisa este documento** primero
2. **Abre DevTools** (F12) → Console para ver errores
3. **Consulta** `CONFIGURACION-EMAIL-CHATBOT.md` para setup de emails

---

## 📝 Changelog

**Versión 1.0** (8 de Diciembre, 2025)
- ✅ Chatbot bilingüe funcional
- ✅ Sistema de reservaciones completo
- ✅ Integrado en todas las 6 páginas
- ✅ Responsive design
- ✅ Quick reply buttons
- ✅ Validación de datos
- ✅ Estructura lista para EmailJS
- ✅ Documentación completa

---

¡El chatbot está listo para ayudar a tus clientes! 🎉

Solo falta configurar EmailJS para que envíe los correos automáticamente.
