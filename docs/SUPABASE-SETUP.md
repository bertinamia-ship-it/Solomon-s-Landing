# 🚀 SETUP SUPABASE - Sistema de Reservaciones

## Paso 1: Crear cuenta en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta gratis
3. Crea un nuevo proyecto:
   - **Nombre:** solomon-landing-reservations
   - **Database Password:** (guarda esta contraseña)
   - **Region:** US West (más cercana a Mazatlán)

## Paso 2: Ejecutar el Schema SQL

1. En Supabase, ve a **SQL Editor** (icono de base de datos)
2. Clic en **New Query**
3. Copia TODO el contenido de `supabase-schema.sql`
4. Pega en el editor
5. Clic en **Run** (o Ctrl+Enter)
6. Verifica que diga: ✅ **Success. No rows returned**

## Paso 3: Obtener las credenciales

1. Ve a **Settings** → **API**
2. Copia estos 2 valores:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Paso 4: Configurar el Frontend

Abre `supabase-client.js` y actualiza:

```javascript
const SUPABASE_CONFIG = {
    url: 'https://xxxxxxxxxxxxx.supabase.co', // Pega tu URL aquí
    anonKey: 'eyJhbGciOiJI...' // Pega tu anon key aquí
};
```

## Paso 5: Agregar Supabase JS al HTML

En todas las páginas que usen Supabase, agrega ANTES de tus scripts:

```html
<!-- Supabase Client -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase-client.js"></script>
```

Por ejemplo en `reservations.html`:
```html
<!-- ... otros scripts ... -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase-client.js"></script>
<script src="stripe-reservation.js"></script>
</body>
</html>
```

## Paso 6: Verificar que funciona

Abre la consola del navegador (F12) y escribe:

```javascript
SupabaseAPI.init();
SupabaseAPI.getAllTables();
```

Deberías ver un array con 24 mesas ✅

## 📊 Estructura de la Base de Datos

### **Tables (Mesas)**
- 6 mesas de 6 personas (#1-6)
- 17 mesas de 4 personas (#7-23)
- 1 mesa de 2 personas (#24)

### **Reservations (Reservaciones)**
- Datos del cliente
- Fecha/hora
- Mesa asignada
- Estados: pending, confirmed, completed, cancelled, no_show

### **Payments (Pagos)**
- Vinculado a Stripe Payment Intents
- Estados: pending, authorized, captured, released, failed

### **Blocked_Slots (Horarios bloqueados)**
- Para bloquear mesas u horarios manualmente

### **Settings (Configuración)**
- Capacidad máxima por hora: 80
- Duración de mesa: 90 minutos
- Hold por persona: $20 USD
- Zona horaria: America/Mazatlan

## 🔐 Seguridad (Row Level Security)

El schema incluye políticas de seguridad:
- ✅ Cualquiera puede crear reservaciones
- ✅ Cualquiera puede ver mesas/settings
- 🔒 Solo usuarios autenticados pueden modificar
- 🔒 Solo admins pueden eliminar

## 📱 Real-Time

Supabase incluye actualizaciones en tiempo real. El croquis de mesas se actualiza automáticamente cuando alguien hace una reservación.

## 🎯 Próximos pasos

Después de configurar:
1. ✅ Actualizar sistema de reservaciones
2. ✅ Crear croquis de mesas
3. ✅ Panel admin
4. ✅ Webhooks Stripe

## 🆘 Problemas comunes

**Error: Invalid API key**
- Verifica que copiaste correctamente la `anon public key`

**Error: relation "tables" does not exist**
- El SQL no se ejecutó. Vuelve a ejecutar `supabase-schema.sql`

**CORS error**
- Supabase permite CORS por defecto, no debería pasar

**No veo las 24 mesas**
- Ejecuta: `SELECT * FROM tables;` en SQL Editor
- Deberían aparecer 24 filas

## 📞 Soporte

Si algo no funciona, revisa:
1. Console del navegador (F12)
2. Supabase Dashboard → Logs
3. SQL Editor → ejecuta queries manualmente
