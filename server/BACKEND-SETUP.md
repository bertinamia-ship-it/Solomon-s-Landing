# 🚀 GUÍA DE INSTALACIÓN - BACKEND

## Paso 1: Instalar dependencias

```bash
cd server
npm install
```

Esto instalará:
- express
- stripe
- @supabase/supabase-js
- cors
- dotenv

## Paso 2: Configurar variables de entorno

### 2.1 Obtener Service Role Key de Supabase

1. Ve a **Supabase Dashboard** → **Settings** → **API**
2. Busca la sección **Project API keys**
3. Copia la **service_role** key (⚠️ **¡NO la compartas!**)

### 2.2 Obtener Secret Key de Stripe

1. Ve a **Stripe Dashboard** → **Developers** → **API keys**
2. Copia la **Secret key** (comienza con `sk_test_` o `sk_live_`)

### 2.3 Actualizar .env

Abre `server/.env` y actualiza:

```env
SUPABASE_SERVICE_KEY=eyJhbGciOiJI... (tu service_role key)
STRIPE_SECRET_KEY=sk_test_... (tu secret key)
```

## Paso 3: Iniciar el servidor

```bash
npm start
```

O para desarrollo (con auto-reload):

```bash
npm run dev
```

Deberías ver:
```
🚀 Servidor corriendo en http://localhost:3000
✅ Stripe configurado
✅ Supabase conectado
```

## Paso 4: Configurar Webhooks de Stripe

### 4.1 Usar Stripe CLI (desarrollo local)

```bash
# Instalar Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Escuchar webhooks
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Stripe te dará un **webhook signing secret** (comienza con `whsec_`). Cópialo y agrégalo a `.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### 4.2 Producción (después de deployment)

1. Ve a **Stripe Dashboard** → **Developers** → **Webhooks**
2. Clic en **Add endpoint**
3. URL: `https://tudominio.com/api/stripe/webhook`
4. Eventos a escuchar:
   - `payment_intent.succeeded`
   - `payment_intent.canceled`
   - `payment_intent.payment_failed`
   - `charge.captured`
5. Copia el **Signing secret** y actualiza `.env`

## Paso 5: Probar el backend

### Test 1: Health check

```bash
curl http://localhost:3000/api/health
```

Respuesta esperada:
```json
{
  "status": "ok",
  "timestamp": "2025-12-13T...",
  "service": "Solomon's Landing Reservations API"
}
```

### Test 2: Crear hold

```bash
curl -X POST http://localhost:3000/api/stripe/create-hold \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 8000,
    "customer_email": "test@example.com",
    "customer_name": "Test User",
    "reservation_id": "test-123"
  }'
```

## Paso 6: Actualizar el frontend

En `reservation-system.js`, la URL ya apunta a `/api/stripe/create-hold`. 

Si el backend está en otro dominio, actualiza:

```javascript
const response = await fetch('http://localhost:3000/api/stripe/create-hold', {
    // ...
});
```

## 🔒 Seguridad

### ⚠️ NUNCA expongas estas claves:
- `SUPABASE_SERVICE_KEY` (service_role)
- `STRIPE_SECRET_KEY` (sk_test_ o sk_live_)
- `STRIPE_WEBHOOK_SECRET` (whsec_)

### ✅ Puedes exponer estas:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY` (anon public)
- `STRIPE_PUBLISHABLE_KEY` (pk_test_ o pk_live_)

## 📦 Deployment

### Opción 1: Vercel

```bash
npm install -g vercel
vercel
```

### Opción 2: Railway

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Opción 3: Heroku

```bash
heroku create solomons-landing-api
git push heroku main
```

### Opción 4: DigitalOcean App Platform

1. Conecta tu repo de GitHub
2. Configura las variables de entorno
3. Deploy automático

## 🆘 Troubleshooting

**Error: "Stripe Secret Key no configurado"**
- Verifica que `.env` tenga `STRIPE_SECRET_KEY`

**Error: "Supabase connection failed"**
- Verifica `SUPABASE_URL` y `SUPABASE_SERVICE_KEY`

**Webhooks no funcionan**
- Local: asegúrate de tener `stripe listen` corriendo
- Producción: verifica que la URL del webhook esté correcta en Stripe Dashboard

**CORS error**
- Actualiza `CORS_ORIGIN` en `.env` con tu dominio frontend
