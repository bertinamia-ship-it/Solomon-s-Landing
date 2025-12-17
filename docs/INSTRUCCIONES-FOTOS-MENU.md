# 📸 Instrucciones para Fotos del Hero de Menús

## Fotos Necesarias

Necesitas **4 fotos de platillos** para el carrusel del hero de la página de menús.

### Nombres de Archivos:
```
dish1.jpg
dish2.jpg
dish3.jpg
dish4.jpg
```

---

## 🎯 Tipos de Fotos Recomendadas

Para aprovechar el hero al máximo, usa fotos de:

1. **dish1.jpg** - Un platillo destacado (Featured Dish)
   - Ejemplos: French Toast Relleno, Surf & Turf, Solomon's Ceviche
   - Debe ser tu platillo más fotogénico/popular

2. **dish2.jpg** - Platillo de Sushi o Mariscos
   - Ejemplos: Rainbow Roll, Sushi variado, Platón de mariscos
   - Colores vibrantes funcionan bien

3. **dish3.jpg** - Platillo de Carne o Parrilla
   - Ejemplos: Ribeye, Arrachera, BBQ Ribs
   - Buena presentación con guarniciones

4. **dish4.jpg** - Desayuno o Coctel
   - Ejemplos: Pancakes, Avocado Toast, Margarita especial
   - Algo colorido y apetitoso

---

## 📐 Especificaciones de las Fotos

### Tamaño Recomendado:
- **Ancho**: 1920px mínimo
- **Alto**: 1080px mínimo
- **Proporción**: 16:9 (horizontal)
- **Peso**: Máximo 500KB por foto (optimizadas)

### Calidad:
- ✅ Alta resolución pero optimizadas
- ✅ Bien iluminadas (luz natural preferible)
- ✅ Enfoque nítido en el platillo
- ✅ Colores vibrantes y apetitosos
- ✅ Composición centrada o regla de tercios

### Lo Que NO Funciona:
- ❌ Fotos borrosas o mal iluminadas
- ❌ Fotos verticales (portrait)
- ❌ Fotos muy pequeñas (pixeladas)
- ❌ Archivos muy pesados (>1MB)

---

## 📂 Cómo Subir las Fotos

### Paso 1: Preparar las Fotos
1. Renombra tus 4 fotos mejores como:
   - `dish1.jpg`
   - `dish2.jpg`
   - `dish3.jpg`
   - `dish4.jpg`

2. Optimiza el tamaño (opcional pero recomendado):
   - Usa [TinyJPG.com](https://tinyjpg.com/) o similar
   - Reduce el peso a 300-500KB sin perder calidad

### Paso 2: Subir al Servidor
1. Coloca los 4 archivos en la **carpeta raíz** del sitio web:
   ```
   /workspaces/Solomon-s-Landing/
   ├── dish1.jpg  ← Aquí
   ├── dish2.jpg  ← Aquí
   ├── dish3.jpg  ← Aquí
   ├── dish4.jpg  ← Aquí
   ├── index.html
   ├── menus.html
   └── ...
   ```

2. **Mismo nivel** donde están:
   - sh1.jpg, sh2.jpg, sh3.jpg, sh4.jpg (fotos del hero principal)
   - logo solomons.png

### Paso 3: Verificar
1. Abre la página de menús: `menus.html`
2. El carrusel debería mostrar tus 4 fotos
3. Cambian automáticamente cada 5 segundos

---

## 🎨 El Hero Ya Está Configurado Con:

✅ **Carrusel automático** (5 segundos por foto)
✅ **Nieve animada** (6 copos sutiles)
✅ **Overlay oscuro** (para que el texto se lea bien)
✅ **Título grande**: "Our Culinary Creations"
✅ **Decoraciones navideñas** (🎄, ✨)
✅ **2 Botones CTA**:
   - "Explore Menus" (rojo navideño)
   - "Reserve Table" (transparente glassmorphism)
✅ **Scroll indicator** animado (rebote)
✅ **Responsive** (se adapta a móvil)
✅ **Transiciones suaves** (fade 1.5 segundos)

---

## 🔄 Si Quieres Cambiar las Fotos Después

### Opción 1: Reemplazar los Archivos
Simplemente sube nuevas fotos con los mismos nombres:
- `dish1.jpg` → Nueva foto 1
- `dish2.jpg` → Nueva foto 2
- Etc.

### Opción 2: Cambiar los Nombres
Si quieres usar otros nombres de archivo, edita `menus.html`:

```html
<!-- Busca estas líneas (alrededor de línea 50-70) -->
<div class="hero-slide active" ... url('dish1.jpg');">
<div class="hero-slide" ... url('dish2.jpg');">
<div class="hero-slide" ... url('dish3.jpg');">
<div class="hero-slide" ... url('dish4.jpg');">

<!-- Cambia 'dishX.jpg' por tus nombres -->
```

---

## 🎯 Consejos para Mejores Resultados

### Fotografía:
1. **Luz Natural**: Toma fotos cerca de ventanas en horas de luz suave
2. **Fondo Simple**: Platos en mesas limpias, sin distracciones
3. **Ángulo**: 45° desde arriba funciona mejor para platillos
4. **Garnish**: Asegúrate que el platillo esté bien presentado
5. **Steam/Freshness**: Si es posible, captura el platillo recién servido

### Editing Básico:
- Aumenta ligeramente el contraste
- Ajusta brillo si es necesario
- Saturación +10-15% (no exagerar)
- Recorta para centrar el platillo

### Herramientas Gratis:
- **Canva.com** - Redimensionar y ajustar
- **TinyJPG.com** - Optimizar peso
- **Photopea.com** - Editor tipo Photoshop gratis
- **Remove.bg** - Remover fondos si necesario

---

## 📱 Vista en Diferentes Dispositivos

### Desktop (>1024px):
- Hero: 85vh de altura (pantalla completa casi)
- Texto grande y legible
- 2 botones lado a lado

### Tablet (768px-1024px):
- Hero: 85vh
- Texto ligeramente más pequeño
- Botones pueden apilarse

### Mobile (<768px):
- Hero: 70vh (más compacto)
- Título: 3rem (más pequeño)
- Botones apilados verticalmente
- Nieve más pequeña

---

## ✅ Checklist Final

Antes de publicar, verifica:

- [ ] 4 fotos subidas con nombres correctos
- [ ] Fotos optimizadas (300-500KB cada una)
- [ ] Tamaño mínimo 1920x1080px
- [ ] Orientación horizontal (landscape)
- [ ] Buena iluminación y enfoque
- [ ] Carrusel funciona (cambia cada 5s)
- [ ] Texto legible sobre las fotos
- [ ] Botones funcionan correctamente
- [ ] Se ve bien en móvil
- [ ] Nieve animada visible (sutil)

---

## 🆘 Solución de Problemas

### "No se ven las fotos"
- Verifica que los archivos estén en la carpeta raíz
- Nombres deben ser exactos: `dish1.jpg` (minúsculas)
- Extensión debe ser `.jpg` (no .jpeg, .png, etc.)
- Refresca la página (Ctrl+F5 o Cmd+Shift+R)

### "Las fotos se ven pixeladas"
- Usa fotos de mayor resolución
- Mínimo 1920x1080px

### "Las fotos pesan mucho y cargan lento"
- Optimiza en TinyJPG.com
- Target: 300-500KB por foto
- Usa formato .jpg (mejor compresión que .png)

### "El texto no se lee bien"
- Las fotos tienen overlay oscuro (40% negro)
- Si aún no se lee, elige fotos menos ocupadas
- O aumenta el overlay editando menus.html:
  ```css
  linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4))
  <!-- Cambia 0.4 a 0.5 o 0.6 para más oscuro -->
  ```

---

## 🎄 Resultado Final

Un hero profesional y navideño que:
- Muestra tus mejores platillos
- Atrae visualmente a los clientes
- Crea primera impresión WOW
- Mantiene el tema festivo
- Se adapta a todos los dispositivos

**¡Listo para recibir tus fotos!** 📸✨
