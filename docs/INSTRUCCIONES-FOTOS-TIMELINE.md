# 📸 Cómo Agregar Fotos al Carrusel de Timeline

## 🎯 Ubicación de las Fotos

El carrusel de timeline está en **index.html** en la sección `#timeline`.

---

## 📝 Instrucciones para Agregar Fotos Reales

### Opción 1: Fotos en tu servidor (RECOMENDADO)

1. **Crea una carpeta para las fotos:**
   ```
   /workspaces/Solomon-s-Landing/images/timeline/
   ```

2. **Sube tus fotos con estos nombres:**
   - `1995-beginning.jpg` - Foto del restaurante en sus inicios
   - `2000s-growth.jpg` - Foto de la expansión
   - `2010s-sushi.jpg` - Foto de la barra de sushi
   - `2020-renovation.jpg` - Foto de la renovación
   - `2025-today.jpg` - Foto actual del restaurante
   - `legacy.jpg` - Foto de clientes/ambiente

3. **Edita index.html** - Busca estas líneas y reemplaza:

```html
<!-- Timeline Item 1 - Cambiar este div -->
<div style="height: 200px; background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); display: flex; align-items: center; justify-content: center; font-size: 4rem;">
    📷
</div>

<!-- POR ESTO: -->
<div style="height: 200px; background: url('images/timeline/1995-beginning.jpg') center/cover; position: relative;">
    <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.7)); padding: 1rem; color: white; font-size: 0.85rem; font-weight: 600;">
        The Beginning - 1995
    </div>
</div>
```

4. **Repite para cada foto del timeline:**
   - Item 2: `images/timeline/2000s-growth.jpg`
   - Item 3: `images/timeline/2010s-sushi.jpg`
   - Item 4: `images/timeline/2020-renovation.jpg`
   - Item 5: `images/timeline/2025-today.jpg`
   - Item 6: `images/timeline/legacy.jpg`

---

### Opción 2: Usar URLs de Unsplash (TEMPORAL)

Si no tienes las fotos todavía, puedes usar placeholders de Unsplash:

```html
<!-- Ejemplo para 1995 -->
<div style="height: 200px; background: url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400') center/cover;">
</div>

<!-- Ejemplo para 2000s -->
<div style="height: 200px; background: url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400') center/cover;">
</div>
```

**Fotos sugeridas de Unsplash para cada época:**
- 1995 (Inicio): `photo-1555396273-367ea4eb4db5` (pequeño restaurante)
- 2000s (Crecimiento): `photo-1517248135467-4c7edcad34c4` (restaurante elegante)
- 2010s (Sushi): `photo-1579584425555-c3ce17fd4351` (barra de sushi)
- 2020 (Renovación): `photo-1559339352-11d035aa65de` (interior moderno)
- 2025 (Hoy): `photo-1414235077428-338989a2e8c0` (comida gourmet)
- Legacy: `photo-1552566626-52f8b828add9` (gente feliz)

---

### Opción 3: Código Completo con Fotos Reales

Aquí está el código completo para **UN item del timeline** con foto real:

```html
<!-- Timeline Item 1 - Early Days CON FOTO REAL -->
<div class="timeline-item" style="min-width: 280px; background: var(--white); border-radius: 12px; overflow: hidden; box-shadow: var(--shadow-md); transition: transform 0.3s ease;">
    <!-- Contenedor de la imagen -->
    <div style="height: 200px; background: url('images/timeline/1995-beginning.jpg') center/cover; position: relative; overflow: hidden;">
        <!-- Overlay oscuro para legibilidad -->
        <div style="position: absolute; inset: 0; background: linear-gradient(transparent 40%, rgba(0,0,0,0.6));"></div>
        <!-- Caption sobre la imagen -->
        <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 1rem; color: white; z-index: 1;">
            <div style="font-size: 1.1rem; font-weight: 700; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
                The Beginning
            </div>
        </div>
    </div>
    
    <!-- Contenido de texto (mantener igual) -->
    <div style="padding: 1.5rem;">
        <div style="background: var(--yellow-sun); color: var(--navy-dark); display: inline-block; padding: 0.4rem 1rem; border-radius: 20px; font-weight: 700; font-size: 0.9rem; margin-bottom: 1rem;">
            1995
        </div>
        <h3 style="color: var(--primary-color); font-size: 1.2rem; margin-bottom: 0.5rem;">The Beginning</h3>
        <p style="color: var(--text-light); font-size: 0.9rem; line-height: 1.6;">
            Started as a small family restaurant with big dreams on the Cabo Marina.
        </p>
    </div>
</div>
```

---

## 🎨 Optimización de Fotos

### Tamaño Recomendado:
- **Ancho:** 400-500px
- **Alto:** 280-300px
- **Formato:** JPG (mejor rendimiento)
- **Peso:** Máximo 200KB por foto

### Cómo Optimizar:
1. Usa [TinyPNG.com](https://tinypng.com) para comprimir
2. Recorta a proporción 4:3 (landscape)
3. Ajusta brillo/contraste si es necesario

---

## 🔄 Ejemplo Completo de Reemplazo

### ANTES (Código Actual):
```html
<div style="height: 200px; background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); display: flex; align-items: center; justify-content: center; font-size: 4rem;">
    📷
</div>
```

### DESPUÉS (Con Tu Foto):
```html
<div style="height: 200px; background: url('images/timeline/1995-beginning.jpg') center/cover; position: relative;">
    <div style="position: absolute; inset: 0; background: linear-gradient(transparent 50%, rgba(0,0,0,0.5));"></div>
</div>
```

---

## 📋 Checklist

- [ ] Crear carpeta `images/timeline/`
- [ ] Subir 6 fotos del restaurante
- [ ] Renombrar fotos según las épocas
- [ ] Editar index.html con las rutas correctas
- [ ] Verificar que las fotos se vean bien
- [ ] Optimizar peso de imágenes si es necesario

---

## 🎯 Resultado Esperado

El carrusel mostrará:
1. **1995** - Foto del restaurante pequeño
2. **2000s** - Foto de la expansión
3. **2010s** - Foto de la barra de sushi
4. **2020** - Foto de la renovación
5. **2025** - Foto actual
6. **Legacy** - Foto de clientes/ambiente

---

## 💡 Sugerencias de Fotos

### Fotos que Funcionan Mejor:
- ✅ Exteriores del restaurante en diferentes épocas
- ✅ Interiores mostrando la evolución
- ✅ Equipo de staff a través de los años
- ✅ Clientes disfrutando
- ✅ Platillos especiales/sushi
- ✅ Vista de la marina desde el restaurante

### Evitar:
- ❌ Fotos muy oscuras
- ❌ Fotos borrosas o de baja calidad
- ❌ Fotos verticales (usar horizontales)
- ❌ Fotos muy pesadas (>500KB)

---

## 🚀 Quick Start

Si quieres empezar rápido:

1. **Copia este comando en terminal:**
   ```bash
   mkdir -p /workspaces/Solomon-s-Landing/images/timeline
   ```

2. **Sube tus fotos a esa carpeta**

3. **Busca en index.html el primer `📷`**

4. **Reemplaza con:**
   ```html
   background: url('images/timeline/1995-beginning.jpg') center/cover;
   ```

5. **Repite para los otros 5 items**

---

¡Listo! Con esto tu carrusel mostrará la historia visual de Solomon's Landing. 📸✨
