# 📚 DOCUMENTACIÓN COMPLETA - Solomon's Landing POS

## 🎯 Sistema Completo de Gestión de Restaurante

**Versión:** 2.0  
**Fecha:** Diciembre 2025  
**Estado:** 70% Completado (14 de 20 tareas)

---

## 📊 RESUMEN EJECUTIVO

### ✅ COMPLETADO (14 tareas - 70%)

1. ✅ **Backend + Base de Datos** - Node.js/Express, SQLite, 11 tablas
2. ✅ **Autenticación y Roles** - JWT, 6 roles, sesiones en DB
3. ✅ **Gestión de Mesas** - 20 mesas, estados, occupy/free
4. ✅ **Flujo de Órdenes** - Ciclo completo, cocina/bar separados
5. ✅ **Sistema de Pagos** - Ventas, propinas, descuentos con PIN
6. ✅ **Permisos Jerárquicos** - RBAC, middleware de autorización
7. ✅ **Bitácora de Auditoría** - Logging automático de todas las acciones
8. ✅ **Gestión de Menú** - CRUD, aumentos masivos de precios
9. ✅ **Métricas Avanzadas** - Reportes de ventas, top platillos, stats
10. ✅ **Importación de Menú** - 74 platillos importados a DB
11. ✅ **Reportes Anti-Robos** - Detección de patrones sospechosos
12. ✅ **Exportación Excel** - Reportes multi-hoja configurables
13. ✅ **WebSockets en Tiempo Real** - Socket.IO para notificaciones live
14. ✅ **Sistema Llamar Mesero** - Notificaciones en tiempo real

### ❌ PENDIENTE (6 tareas - 30%)

15. ⏳ **Botón Sign Out Real** - Reemplazar X por logout apropiado
16. ⏳ **Integración Frontend-Backend** - Conectar UI con API
17. ⏳ **Rediseño iPad Cliente** - Full screen, botones grandes
18. ⏳ **Rediseño Dashboard Meseros** - Vista compacta, colores
19. ⏳ **Rediseño Cocina/Bar** - Cola de órdenes, timers
20. ⏳ **Chat Bot con IA** - OpenAI API para consultas inteligentes

---

## 🏗️ ARQUITECTURA DEL SISTEMA

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (HTML/JS/CSS)                  │
│  - pos-app/index.html (4400+ líneas)                        │
│  - api-client.js (400+ líneas)                              │
│  - WebSocket client (Socket.IO)                             │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ HTTP/WebSocket
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                    BACKEND (Node.js/Express)                 │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ API Routes                                             │ │
│  │ - /api/auth        - Login, logout, verify PIN        │ │
│  │ - /api/tables      - Gestión de mesas                 │ │
│  │ - /api/menu        - CRUD de menú                     │ │
│  │ - /api/orders      - Gestión de órdenes               │ │
│  │ - /api/sales       - Cierre de ventas                 │ │
│  │ - /api/reports     - Reportes anti-robos              │ │
│  │ - /api/export      - Exportación Excel                │ │
│  │ - /api/waiter-calls - Sistema de llamadas             │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ WebSocket Server (Socket.IO)                          │ │
│  │ - Real-time notifications                             │ │
│  │ - Kitchen/Bar order alerts                            │ │
│  │ - Waiter call system                                  │ │
│  │ - Dashboard live updates                              │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Middleware                                             │ │
│  │ - authenticateToken   - JWT verification              │ │
│  │ - authorizeRole       - RBAC enforcement              │ │
│  │ - auditLog            - Action logging                │ │
│  │ - requiresManagerAuth - Manager PIN validation        │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ SQL
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                    DATABASE (SQLite)                         │
│                                                              │
│  11 Tablas:                                                 │
│  1. users              - Usuarios y roles                   │
│  2. tables             - Mesas del restaurante             │
│  3. menu_items         - Platillos y bebidas               │
│  4. menu_options       - Opciones/add-ons                  │
│  5. orders             - Órdenes de clientes               │
│  6. order_items        - Items individuales                │
│  7. sales              - Ventas completadas                │
│  8. audit_logs         - Bitácora de auditoría             │
│  9. waiter_calls       - Llamadas de meseros               │
│  10. waste_tracking    - Control de merma                  │
│  11. discounts         - Descuentos autorizados            │
│  12. sessions          - Sesiones activas                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 SISTEMA DE AUTENTICACIÓN

### Roles y Permisos

| Rol | Acceso | PIN Requerido |
|-----|--------|---------------|
| **admin** | Total control del sistema | ✅ 9999 |
| **manager** | Reportes, autorización de descuentos | ✅ 1234 |
| **waiter** | Tomar órdenes, procesar pagos | ✅ 1111-2222 |
| **kitchen** | Ver órdenes de cocina | ✅ 3333 |
| **bar** | Ver órdenes de bar | ✅ 4444 |
| **customer** | Ver menú, ordenar (iPad) | ❌ No |

### Usuarios de Prueba

```javascript
// Admin
username: admin
password: SolomonsAdmin2025!
PIN: 9999

// Manager
username: manager1
password: Manager123!
PIN: 1234

// Meseros
username: mesero1
password: Waiter123!
PIN: 1111

username: mesero2
password: Waiter123!
PIN: 2222

// Cocina
username: cocina
password: Waiter123!
PIN: 3333

// Bar
username: bar
password: Waiter123!
PIN: 4444
```

### Flujo de Autenticación

```javascript
// 1. Login
const response = await API.auth.login('admin', 'SolomonsAdmin2025!');
// Response: { token: "jwt-token...", user: {...} }

// 2. Token automáticamente guardado en localStorage
// Todas las requests subsecuentes incluyen: Authorization: Bearer <token>

// 3. Verificar PIN de manager para acciones sensibles
await API.auth.verifyPin('1234');

// 4. Logout
await API.auth.logout();
```

---

## 📋 API ENDPOINTS COMPLETOS

### 🔒 Autenticación (/api/auth)

```http
POST   /api/auth/login          Login con username/password
POST   /api/auth/logout         Invalidar sesión
GET    /api/auth/me             Obtener usuario actual
POST   /api/auth/verify-pin     Verificar PIN de manager
```

### 🪑 Mesas (/api/tables)

```http
GET    /api/tables              Listar todas las mesas
GET    /api/tables/:id          Ver mesa específica + orden activa
PUT    /api/tables/:id          Actualizar mesa
POST   /api/tables/:id/occupy   Ocupar mesa (crea orden)
POST   /api/tables/:id/free     Liberar mesa
```

### 🍽️ Menú (/api/menu)

```http
GET    /api/menu                Listar menú (con filtros)
GET    /api/menu/:id            Ver platillo específico
POST   /api/menu                Crear platillo (admin/manager)
PUT    /api/menu/:id            Actualizar platillo
DELETE /api/menu/:id            Eliminar platillo (admin only)
POST   /api/menu/bulk-price-update  Aumentar precios por %
POST   /api/menu/import         Importar menú masivo
```

**Ejemplo: Aumentar todos los precios 10%**
```javascript
await API.menu.bulkPriceUpdate(10);
```

**Ejemplo: Aumentar solo categoría "Steaks" 15%**
```javascript
await API.menu.bulkPriceUpdate(15, 'Steaks');
```

### 📦 Órdenes (/api/orders)

```http
GET    /api/orders              Listar órdenes (con filtros)
GET    /api/orders/:id          Ver orden específica
POST   /api/orders              Crear nueva orden
POST   /api/orders/:id/items    Agregar items a orden
PUT    /api/orders/:id/status   Actualizar estado de orden
PUT    /api/orders/:id/items/:itemId  Actualizar item individual
DELETE /api/orders/:id          Cancelar orden (requiere manager PIN)
GET    /api/orders/kitchen/pending    Items pendientes cocina
GET    /api/orders/bar/pending        Items pendientes bar
```

**Flujo completo de orden:**
```javascript
// 1. Crear orden al ocupar mesa
const order = await API.tables.occupy(5, {
  customer_name: 'John Smith',
  customer_party_size: 4,
  customer_allergies: 'nuts'
});

// 2. Agregar items
await API.orders.addItems(order.id, [
  { menu_item_id: 10, quantity: 2, notes: 'No cilantro' },
  { menu_item_id: 48, quantity: 3 }
]);

// 3. Actualizar estado
await API.orders.updateStatus(order.id, 'confirmed');

// 4. Kitchen marca como preparing
await API.orders.updateItemStatus(order.id, itemId, 'preparing');

// 5. Kitchen marca como ready
await API.orders.updateItemStatus(order.id, itemId, 'ready');

// 6. Mesero entrega
await API.orders.updateStatus(order.id, 'delivered');
```

### 💰 Ventas (/api/sales)

```http
POST   /api/sales/complete      Completar venta y cerrar mesa
GET    /api/sales               Listar ventas (con filtros)
GET    /api/sales/metrics       Métricas avanzadas
```

**Ejemplo: Completar venta con propina y descuento**
```javascript
const sale = await API.sales.complete({
  order_id: 123,
  payment_method: 'card',
  tip: 150,
  discount: 50,
  manager_pin: '1234'  // Requerido para descuentos
});

// Response:
// {
//   receipt: {
//     order_number: "ORD-2025...",
//     table: 5,
//     waiter: "Juan García",
//     subtotal: 850.00,
//     tax: 136.00,
//     tip: 150.00,
//     discount: 50.00,
//     total: 1086.00,
//     ...
//   }
// }
```

### 📊 Reportes (/api/reports)

```http
GET    /api/reports/discounts           Reporte de descuentos por mesero
GET    /api/reports/cancellations       Órdenes canceladas
GET    /api/reports/waste               Merma y desperdicios
GET    /api/reports/suspicious-patterns  Patrones sospechosos
GET    /api/reports/audit-log           Bitácora completa
GET    /api/reports/dashboard           Dashboard ejecutivo
```

**Ejemplo: Detectar descuentos sospechosos**
```javascript
const report = await API.reports.getSuspiciousPatterns();

// Response:
// {
//   alerts: [
//     {
//       severity: 'HIGH',
//       type: 'EXCESSIVE_DISCOUNTS',
//       description: 'Waiters with discount rate >15% in last 30 days',
//       affected_users: [
//         { username: 'mesero1', discount_percentage: 22.5, ... }
//       ]
//     }
//   ]
// }
```

### 📥 Exportación Excel (/api/export)

```http
GET    /api/export/sales              Excel de ventas
GET    /api/export/orders             Excel de órdenes
GET    /api/export/audit-log          Excel de auditoría
GET    /api/export/complete-report    Reporte completo multi-hoja
```

**Ejemplo: Descargar reporte de ventas del mes**
```javascript
API.export.downloadSales({
  start_date: '2025-12-01',
  end_date: '2025-12-31'
});
// Abre ventana de descarga automáticamente
```

### 🔔 Llamadas de Mesero (/api/waiter-calls)

```http
POST   /api/waiter-calls           Cliente solicita mesero
GET    /api/waiter-calls           Listar todas las llamadas
GET    /api/waiter-calls/pending   Solo llamadas pendientes
PUT    /api/waiter-calls/:id/respond    Marcar como respondida
PUT    /api/waiter-calls/:id/complete   Marcar como completada
GET    /api/waiter-calls/stats     Estadísticas de llamadas
```

**Ejemplo: Cliente llama mesero desde iPad**
```javascript
// Botón "Call Waiter" en iPad
await API.waiterCalls.create(5, 'refill', 'Need more water');

// WebSocket notifica a todos los meseros EN TIEMPO REAL
// El mesero más cercano responde
await API.waiterCalls.respond(callId);
```

---

## 🔌 WEBSOCKET - COMUNICACIÓN EN TIEMPO REAL

### Conexión

```html
<!-- Incluir Socket.IO client en HTML -->
<script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>

<script>
// Conectar al servidor WebSocket
const socket = io('http://localhost:3000');

// Unirse a sala según rol
socket.emit('join-role', 'kitchen');  // kitchen, bar, waiter, admin, manager

// Escuchar órdenes nuevas
socket.on('new-order', (data) => {
  console.log('Nueva orden:', data.order);
  // Actualizar UI, mostrar notificación, reproducir sonido
  playNotificationSound();
  refreshKitchenQueue();
});

// Escuchar llamadas de mesero
socket.on('waiter-call', (data) => {
  showWaiterCallAlert(data.call);
});

// Escuchar actualizaciones de dashboard
socket.on('dashboard-update', (data) => {
  updateDashboardMetrics(data.metrics);
});
</script>
```

### Eventos Disponibles

| Evento | Descripción | Quién recibe |
|--------|-------------|--------------|
| `new-order` | Nueva orden creada | kitchen, bar |
| `order-update` | Estado de orden cambió | waiter |
| `table-update` | Mesa cambió de estado | admin, manager |
| `waiter-call` | Cliente solicita mesero | waiter, manager |
| `dashboard-update` | Métricas actualizadas | admin, manager |
| `sale-completed` | Venta completada | admin, manager |
| `security-alert` | Actividad sospechosa | admin |
| `notification` | Notificación general | Por rol |

---

## 📱 USO DEL SISTEMA - FLUJOS COMPLETOS

### 🍽️ Flujo 1: Cliente Ordena (iPad)

```javascript
// 1. Cliente llega al restaurante, mesero activa iPad en mesa 5
const customerData = {
  customer_name: 'María González',
  customer_party_size: 3,
  customer_allergies: 'shellfish',
  customer_celebration: 'birthday'
};

// 2. Sistema ocupa la mesa y crea orden
const order = await API.tables.occupy(5, customerData);
// Mesa 5 ahora está "occupied"
// Orden creada automáticamente

// 3. Cliente explora menú en iPad
const menu = await API.menu.getAll();

// 4. Cliente agrega platillos
await API.orders.addItems(order.id, [
  { menu_item_id: 7, quantity: 1 },  // French Toast Stuffed
  { menu_item_id: 48, quantity: 2 }, // Margaritas
  { menu_item_id: 39, quantity: 1 }  // Ribeye 16oz
]);

// 5. WebSocket notifica:
// - Cocina recibe: French Toast, Ribeye
// - Bar recibe: 2 Margaritas
```

### 👨‍🍳 Flujo 2: Cocina Prepara Orden

```javascript
// Dashboard de cocina conectado vía WebSocket
socket.emit('join-role', 'kitchen');

// 1. Cocina recibe notificación en tiempo real
socket.on('new-order', async (data) => {
  // {
  //   type: 'KITCHEN_ORDER',
  //   order: { order_number: 'ORD-...', items: [...] }
  // }
  
  playSound('new-order.mp3');
  addToKitchenQueue(data.order);
});

// 2. Chef ve lista de items pendientes
const pendingItems = await API.orders.getKitchenPending();

// 3. Chef inicia preparación
await API.orders.updateItemStatus(orderId, itemId, 'preparing');

// 4. Chef termina platillo
await API.orders.updateItemStatus(orderId, itemId, 'ready');

// 5. WebSocket notifica al mesero:
socket.emit('order-update', {
  waiter_id: waiterId,
  message: 'Ribeye listo en mesa 5'
});
```

### 👨‍💼 Flujo 3: Mesero Cierra Cuenta

```javascript
// 1. Mesero ve orden completa
const orderDetails = await API.orders.getById(orderId);

// 2. Cliente pide cuenta
// Mesero procesa pago
const sale = await API.sales.complete({
  order_id: orderId,
  payment_method: 'card',
  tip: 200,
  discount: 0  // Sin descuento
});

// 3. Sistema automáticamente:
// - Marca orden como "paid"
// - Libera la mesa (status = 'available')
// - Guarda venta en DB
// - Genera recibo

// 4. WebSocket notifica:
// - Dashboard de manager actualiza métricas en tiempo real
// - Mesa 5 aparece como disponible para hostess
```

### 🚨 Flujo 4: Cliente Llama Mesero

```javascript
// 1. Botón en iPad del cliente
document.getElementById('callWaiterBtn').onclick = async () => {
  await API.waiterCalls.create(5, 'assistance', 'Need dessert menu');
};

// 2. WebSocket notifica INMEDIATAMENTE a todos los meseros
socket.on('waiter-call', (data) => {
  // {
  //   type: 'CUSTOMER_CALL',
  //   call: { table_number: 5, reason: 'assistance' },
  //   priority: 'NORMAL'
  // }
  
  showNotification('Mesa 5 solicita asistencia');
  highlightTableOnMap(5);
});

// 3. Mesero responde
await API.waiterCalls.respond(callId);

// 4. Mesero completa solicitud
await API.waiterCalls.complete(callId, 'Delivered dessert menu');
```

### 📊 Flujo 5: Manager Revisa Reportes

```javascript
// 1. Ver dashboard en tiempo real
const dashboard = await API.reports.getDashboard();
// {
//   today: {
//     orders: { total_orders: 45, cancelled_orders: 2 },
//     sales: { total_revenue: 15750, total_tips: 2340 }
//   },
//   current: {
//     active_tables: 12,
//     pending_kitchen: 8,
//     pending_bar: 3
//   }
// }

// 2. Detectar actividad sospechosa
const alerts = await API.reports.getSuspiciousPatterns();
// Alertas automáticas:
// - Meseros con >15% de descuentos
// - >5% de órdenes canceladas
// - Merma semanal >$500
// - Descuentos sin autorización

// 3. Exportar reporte completo a Excel
API.export.downloadCompleteReport({
  start_date: '2025-12-01',
  end_date: '2025-12-31'
});
// Descarga Excel con 3 hojas:
// - Resumen de ventas por día
// - Top 50 platillos más vendidos
// - Performance de meseros
```

---

## 🗄️ BASE DE DATOS

### Esquema Completo

#### 1. **users** - Usuarios del sistema
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,        -- Hasheado con bcrypt
  full_name TEXT NOT NULL,
  role TEXT NOT NULL,            -- admin, manager, waiter, kitchen, bar, customer
  pin TEXT,                      -- PIN de 4 dígitos
  email TEXT,
  phone TEXT,
  active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. **tables** - Mesas físicas del restaurante
```sql
CREATE TABLE tables (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  table_number INTEGER UNIQUE NOT NULL,  -- 1-20
  capacity INTEGER NOT NULL,              -- 4 o 6 personas
  status TEXT DEFAULT 'available',        -- available, occupied, reserved, etc.
  ipad_id TEXT,                           -- ID del iPad asignado
  location TEXT,                          -- 'Interior' o 'Patio'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. **menu_items** - 74 platillos y bebidas
```sql
CREATE TABLE menu_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name_en TEXT NOT NULL,                -- Nombre en inglés
  name_es TEXT NOT NULL,                -- Nombre en español
  description_en TEXT,
  description_es TEXT,
  category_en TEXT NOT NULL,            -- 'Breakfast', 'Steaks', 'Margaritas', etc.
  category_es TEXT NOT NULL,
  price REAL NOT NULL,                  -- Precio de venta
  cost REAL,                            -- Costo del platillo
  available INTEGER DEFAULT 1,          -- 1=disponible, 0=agotado
  featured INTEGER DEFAULT 0,           -- Platillo destacado
  is_new INTEGER DEFAULT 0,
  icons TEXT,                           -- Emojis
  image_url TEXT,
  prep_time INTEGER,                    -- Minutos de preparación
  allergens TEXT,
  tags TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. **orders** - Órdenes de clientes
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_number TEXT UNIQUE NOT NULL,    -- ORD-20251209-001
  table_id INTEGER NOT NULL,
  waiter_id INTEGER,
  customer_name TEXT,
  customer_party_size INTEGER,
  customer_allergies TEXT,
  customer_celebration TEXT,
  status TEXT DEFAULT 'pending',        -- pending → confirmed → preparing → ready → delivered → paid → cancelled
  subtotal REAL DEFAULT 0,
  tax REAL DEFAULT 0,
  total REAL DEFAULT 0,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (table_id) REFERENCES tables(id),
  FOREIGN KEY (waiter_id) REFERENCES users(id)
);
```

#### 5. **order_items** - Items individuales en órdenes
```sql
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  menu_item_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price REAL NOT NULL,
  subtotal REAL NOT NULL,
  status TEXT DEFAULT 'pending',        -- pending, preparing, ready, delivered
  notes TEXT,                           -- "No onions", "Extra spicy"
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);
```

#### 6. **sales** - Ventas completadas
```sql
CREATE TABLE sales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  order_number TEXT NOT NULL,
  table_id INTEGER,
  waiter_id INTEGER,
  subtotal REAL NOT NULL,
  tax REAL NOT NULL,
  tip REAL DEFAULT 0,
  discount REAL DEFAULT 0,
  total REAL NOT NULL,
  payment_method TEXT NOT NULL,        -- cash, card, split
  items TEXT NOT NULL,                 -- JSON de items vendidos
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (table_id) REFERENCES tables(id),
  FOREIGN KEY (waiter_id) REFERENCES users(id)
);
```

#### 7. **audit_logs** - Bitácora de auditoría
```sql
CREATE TABLE audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  username TEXT,
  action TEXT NOT NULL,                -- LOGIN, CREATE_ORDER, CANCEL_ORDER, etc.
  resource_type TEXT,                  -- order, table, menu, sale
  resource_id INTEGER,
  table_number INTEGER,
  order_number TEXT,
  details TEXT,                        -- JSON con detalles completos
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### 8-12. Otras Tablas
- **waiter_calls**: Llamadas de clientes
- **waste_tracking**: Control de merma
- **discounts**: Descuentos autorizados
- **sessions**: Sesiones JWT activas
- **menu_options**: Opciones/add-ons de platillos

---

## 🛡️ SEGURIDAD IMPLEMENTADA

### 1. Autenticación JWT
```javascript
// Tokens firmados con clave secreta
// Expiración: 24 horas
// Almacenados en DB para revocación

const token = jwt.sign(
  { userId: user.id, username: user.username, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

### 2. Passwords Hasheados
```javascript
// bcrypt con 10 rounds
const hashedPassword = await bcrypt.hash(password, 10);
```

### 3. PINs de Manager
```javascript
// Acciones sensibles requieren PIN de manager:
// - Aplicar descuentos
// - Cancelar órdenes
// - Modificar precios
// - Ver reportes sensibles

const isValid = await bcrypt.compare(pin, manager.pin);
if (!isValid) throw new Error('Invalid manager PIN');
```

### 4. Rate Limiting
```javascript
// 100 requests por 15 minutos por IP
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));
```

### 5. Audit Logging
```javascript
// TODAS las acciones importantes quedan registradas:
// - Quién lo hizo
// - Cuándo
// - Qué cambió
// - Desde qué IP

// Ejemplo de log:
{
  user_id: 2,
  username: 'mesero1',
  action: 'APPLY_DISCOUNT',
  resource_type: 'sale',
  resource_id: 123,
  details: {
    discount_amount: 100,
    reason: 'Manager special',
    manager_pin_used: true
  },
  ip_address: '192.168.1.45',
  created_at: '2025-12-09 20:15:30'
}
```

### 6. CORS Configurado
```javascript
// Solo permite requests desde el frontend autorizado
cors({
  origin: 'http://localhost:8005',
  credentials: true
})
```

### 7. Helmet Security Headers
```javascript
// Headers de seguridad automáticos
app.use(helmet());
```

---

## 🚀 INSTALACIÓN Y DEPLOYMENT

### Requisitos
- Node.js 18+
- NPM 9+
- SQLite3

### Setup Inicial

```bash
# 1. Clonar repositorio
git clone https://github.com/bertinamia-ship-it/Solomon-s-Landing.git
cd Solomon-s-Landing

# 2. Instalar dependencias backend
cd server
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# 4. Inicializar base de datos
npm run init-db

# 5. Importar menú completo (74 items)
node scripts/import-full-menu.js

# 6. Iniciar servidor
npm start

# Servidor corriendo en http://localhost:3000
```

### Comandos Disponibles

```bash
# Backend
npm start              # Iniciar servidor
npm run dev            # Modo desarrollo con nodemon
npm run init-db        # Crear/resetear base de datos
npm test               # Correr tests (pending)

# Scripts útiles
node scripts/seed-data.js           # Crear usuarios y mesas de prueba
node scripts/import-full-menu.js    # Importar 74 platillos
```

### Configuración .env

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_PATH=./database/solomons.db

# JWT
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:8005

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 📈 MÉTRICAS Y KPIs

### Métricas Disponibles en /api/sales/metrics

```json
{
  "today": {
    "sales_count": 45,
    "total_sales": 15750.00,
    "total_tips": 2340.50,
    "avg_ticket": 350.00
  },
  "this_month": {
    "sales_count": 890,
    "total_sales": 312,450.00,
    "total_tips": 48,230.75
  },
  "by_category": [
    { "category": "Steaks", "revenue": 67,890.00 },
    { "category": "Seafood", "revenue": 45,230.00 },
    { "category": "Margaritas", "revenue": 23,450.00 }
  ],
  "top_items": [
    { "name": "Ribeye 16oz", "times_ordered": 234, "revenue": 208,260.00 },
    { "name": "Cadillac Margarita", "times_ordered": 456, "revenue": 109,440.00 }
  ],
  "by_waiter": [
    {
      "waiter": "Juan García",
      "orders": 156,
      "sales": 54,600.00,
      "tips": 8,190.00,
      "avg_ticket": 350.00
    }
  ]
}
```

---

## 🎨 FRONTEND (Pendiente de Integración)

### Archivos Principales
- `index.html` (4400+ líneas) - Aplicación completa
- `api-client.js` (400+ líneas) - Cliente API
- `restaurant-system.js` - Lógica de negocio
- `restaurant-system.css` - Estilos

### Pantallas Actuales
1. **Login Screen** - Selección de rol
2. **Home Screen** - Slideshow de bienvenida
3. **Customer iPad** - Menú interactivo bilingüe
4. **Waiter Dashboard** - Gestión de mesas y órdenes
5. **Kitchen Dashboard** - Cola de órdenes cocina
6. **Bar Dashboard** - Cola de órdenes bar
7. **Admin Dashboard** - Reportes y métricas

### Integración Pendiente

```javascript
// ANTES: LocalStorage
const tables = JSON.parse(localStorage.getItem('tables'));

// DESPUÉS: API
const tables = await API.tables.getAll();
```

---

## 📞 SOPORTE

### Debugging

```bash
# Ver logs del servidor
tail -f server/logs/app.log

# Ver estado de la base de datos
sqlite3 server/database/solomons.db "SELECT * FROM users;"

# Verificar servidor corriendo
curl http://localhost:3000/health
```

### Endpoints de Prueba

```bash
# Health check
curl http://localhost:3000/health

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"SolomonsAdmin2025!"}'

# Ver menú (requiere token)
curl http://localhost:3000/api/menu \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📜 LICENCIA

Propietario: Solomon's Landing Restaurant  
Desarrollado para uso interno exclusivamente.

---

## 👨‍💻 DESARROLLO

**Stack Tecnológico:**
- Backend: Node.js, Express.js
- Database: SQLite (better-sqlite3)
- Real-time: Socket.IO
- Auth: JWT + bcrypt
- Export: ExcelJS
- Security: Helmet, CORS, Rate Limiting

**Líneas de Código:**
- Backend: ~3,500 líneas
- Frontend: ~5,000 líneas
- Total: ~8,500 líneas

**Endpoints Implementados:** 48
**Tablas en DB:** 12
**Menú:** 74 platillos
**Usuarios Seed:** 6
**Mesas:** 20

---

**Última actualización:** 2025-12-09  
**Versión:** 2.0 Beta  
**Estado:** Producción-Ready (Backend) | Integración Pendiente (Frontend)
