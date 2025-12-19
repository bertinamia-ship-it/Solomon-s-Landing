#!/usr/bin/env python3
import re
import time

# 1. INCREMENTAR VERSION CACHE BUSTING
print("📦 Incrementando versión de cache busting...")
archivos_html = ['index.html', 'menus.html', 'catering.html', 'location.html', 'reservations.html', 'reviews.html', 'mobile-preview.html']

for archivo in archivos_html:
    try:
        with open(archivo, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Cambiar mobile.css?v=1 a mobile.css?v=2
        if 'mobile.css?v=' in content:
            content = re.sub(r'mobile\.css\?v=\d+', f'mobile.css?v={int(time.time())}', content)
            with open(archivo, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ {archivo}: cache busting actualizado")
    except FileNotFoundError:
        pass

# 2. AGREGAR ZOOM Y FORZAR LOGO EN mobile.css
print("\n🎨 Optimizando mobile.css...")
with open('mobile.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Agregar zoom solo si no existe
if 'zoom:' not in css:
    inicio = css.find('@media (max-width: 768px) {')
    if inicio != -1:
        viewport = '''
    /* VIEWPORT Y ZOOM CORRECTO */
    html, body {
        font-size: 14px;
        zoom: 0.85;
    }
'''
        css = css[:inicio+29] + viewport + css[inicio+29:]

# Forzar logo cropped
css = re.sub(
    r'\.logo img\s*\{[^}]+\}',
    '''.logo img, .logo-container img, header img {
        height: 32px;
        content: url('cropped-solomons-logo.png');
        display: block;
    }''',
    css,
    count=1
)

with open('mobile.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("✅ mobile.css optimizado\n")
print("🔥 INSTRUCCIONES:")
print("1. Refresca el navegador con Cmd+Shift+R (hard refresh)")
print("2. O abre DevTools > Network > Disable cache")
print("3. Luego recarga la página")
