# IRATA Consulting — sitio web

Sitio estático (HTML + CSS + JS). **Sin build, sin dependencias, sin CDN**: las fuentes y las imágenes van dentro de la carpeta.
Funciona en cualquier hosting (cPanel, Hostinger, GoDaddy, Netlify, Vercel, GitHub Pages, S3, etc.).

## Cómo publicarlo
1. Sube **todo el contenido** de esta carpeta a la raíz del hosting (`public_html`, `www` o equivalente), de modo que `index.html` quede en la raíz.
2. Netlify / Vercel / Cloudflare Pages: arrastra la carpeta o conéctala a un repositorio; no requiere configuración.
3. WordPress: si ya tienes WP, sube esta carpeta a un subdominio o ruta aparte (p. ej. `/irata/`), o usa un plugin de "página estática/HTML". No está pensado como tema.

## Lo único que debes editar: `assets/js/config.js` (un solo archivo para todas las páginas)
- `email`: correo real de contacto (hoy: `hola@irata.consulting`, tomado de la propuesta anterior; confírmalo).
- `whatsapp`: número con código de país, sin `+` (ej. `573001234567`). Vacío = el botón no aparece.
- `linkedin` / `instagram`: URL completas. Vacío = no aparecen.
- `formEndpoint`: URL de un servicio de formularios (Formspree, Getform, Formsubmit…). Vacío = el formulario abre el correo del visitante con el mensaje ya redactado. **Recomendado configurarlo** para recibir los mensajes directamente.

## Otros ajustes
- **Fotos de los cofundadores:** Ramón usa su avatar (`assets/img/ramon-avatar-*.webp`, con respaldo al monograma "RB"). Para Joel, guarda `joel.jpg` (cuadrada, mínimo 1000×1000 px) en `assets/img/`; mientras no exista se muestra el monograma "JG".
- **Autodiagnóstico:** tiene dos recorridos ("arranque" y "en marcha"), definidos en `assets/js/main.js` (`QS` y `BANDS`). `autodiagnostico.html?perfil=arranque` salta directo al recorrido de arranque. En Servicios, el síntoma 07 ("Tengo una idea, pero no sé por dónde empezar") es el panel del paquete "IRATA Arranque" (nombre provisional, editable en `servicios.html`).
- **Dominio:** reemplaza `https://irata.consulting` en el `<head>` de cada página (canonical, Open Graph; JSON-LD solo en `index.html`), `robots.txt` y `sitemap.xml` si usas otro.
- **Privacidad:** `privacidad.html` es un borrador base; revísalo con un asesor legal.
- **Analítica** (GA4, Plausible, etc.): no está incluida. Si la agregas, actualiza la política de privacidad.

## Logos e imágenes (calidad)
- `assets/img/*-original.jpg` son tus archivos **sin modificar**.
- Para la web se generaron variantes WebP de alta calidad (≈46 dB PSNR frente al original, visualmente idénticas) en varios tamaños (`srcset`): el navegador elige la que corresponde a la pantalla y a su densidad (1x, 2x, 3x, 4K).
- Los diseños no se redibujaron ni recolorearon. Las variantes `*-marca-*` solo recortan el margen vacío para usarlas pequeñas (menú, favicon).
- Si cambias un logo, vuelve a exportarlo en los mismos nombres/tamaños.

## Páginas y navegación
Cada página cierra con un llamado a la acción y botones «Anterior / Siguiente» (más los puntos de ubicación). Orden del recorrido:
Inicio → Servicios → Data y método → Nosotros → Autodiagnóstico → Contacto.
El resultado del autodiagnóstico viaja al formulario de contacto (se guarda solo en la pestaña, con `sessionStorage`).
Los enlaces son relativos (`servicios.html`), así que funcionan en cualquier hosting sin reglas de reescritura. Si tu hosting soporta «URLs limpias», puedes quitar el `.html`.
Los botones «Quiero resolver esto» y los enlaces del pie abren el servicio exacto con `servicios.html?s=orden|procesos|ventas|datos|clientes|tecnologia`.

## Estructura
```
index.html (inicio) · servicios.html · data-y-metodo.html · nosotros.html
autodiagnostico.html (incluye recursos) · contacto.html (incluye preguntas frecuentes)
privacidad.html · robots.txt · sitemap.xml
assets/css/styles.css · assets/js/main.js · assets/js/config.js
assets/fonts/ (Bricolage Grotesque, Instrument Serif, Figtree — licencia OFL, autoalojadas)
assets/img/ (logos, isotipos, favicons, og-image)
```
