# El jardín de los 30 — Celia

Web estática de cumpleaños preparada para GitHub Pages. No requiere instalación, compilación ni servicios externos.

## Publicación en el repositorio `lsanchezmuniz23/Celia`

1. Extrae el ZIP en tu ordenador.
2. Abre `https://github.com/lsanchezmuniz23/Celia/upload`.
3. Arrastra **todo el contenido extraído** a la página de subida. `index.html` debe quedar en la raíz del repositorio, no dentro de otra carpeta.
4. Escribe un mensaje como `Publicar web de cumpleaños` y pulsa **Commit changes**.
5. En el repositorio, abre **Settings → Pages**.
6. En **Build and deployment**, selecciona **Deploy from a branch**.
7. Elige la rama **main**, la carpeta **/(root)** y pulsa **Save**.
8. Espera uno o dos minutos y abre: `https://lsanchezmuniz23.github.io/Celia/`.

## Comprobación rápida

- Abre la URL desde el móvil.
- Pulsa “Comenzar la aventura”.
- Abre al menos una flor, un sobre y una fotografía.
- Comprueba que el collage final y el botón “Hacer florecer el jardín” funcionan.

## Privacidad

La página solicita a buscadores que no la indexen mediante `noindex` y `robots.txt`, pero GitHub Pages sigue siendo público: cualquier persona con la URL puede verla. Las fotografías incluidas han sido recomprimidas y guardadas sin metadatos EXIF.

## Estructura

- `index.html`: página principal.
- `css/styles.css`: diseño responsive y animaciones.
- `js/data.js`: fotografías, felicitaciones y 30 razones.
- `js/app.js`: interacciones, sobres, flores, galería y cierre.
- `assets/`: imágenes optimizadas e ilustraciones.
- `.nojekyll`: evita el procesamiento Jekyll.
