PROYECTO FRONTAL — H. AYUNTAMIENTO DE CHALMA
================================================

ESTRUCTURA
----------
chalma-web/
├── index.html
├── 404.html
├── README.txt
├── css/
│   └── estilos.css
├── js/
│   └── script.js
├── assets/
│   ├── img/
│   │   ├── logo.svg
│   │   ├── portada.svg
│   │   ├── noticia-1.svg
│   │   ├── noticia-2.svg
│   │   ├── noticia-3.svg
│   │   └── galeria-1.svg ... galeria-6.svg
│   └── docs/
│       └── README.txt
└── paginas/
    ├── noticias.html
    ├── galeria.html
    ├── videos.html
    ├── acerca-de.html
    ├── organigrama.html
    ├── cabildo.html
    ├── directorio.html
    ├── dependencias.html
    ├── obligaciones-comunes.html
    ├── obligaciones-especificas.html
    ├── obras-publicas.html
    ├── fondos-federales.html
    ├── informacion-financiera.html
    ├── cuenta-publica.html
    └── licitaciones.html


QUÉ YA FUNCIONA
---------------
- Encabezado transparente sobre la portada.
- Menús desplegables de Difusión, Gobierno, Transparencia e Idiomas.
- Menú adaptable para celular.
- Buscador interno de páginas.
- Modo de alto contraste.
- Página inicial completa.
- Todas las páginas enlazadas desde los menús.
- Diseño adaptable a computadora, tableta y celular.
- Enlaces y rutas compatibles con cPanel.
- Página 404.

IDIOMAS
-------
El selector de idiomas funciona visualmente y recuerda la selección.
Todavía no traduce el contenido. Cuando tengas los textos traducidos se pueden
agregar versiones reales de cada página.

IMÁGENES
---------
Las imágenes actuales son provisionales y están en assets/img/.
Puedes reemplazarlas conservando los mismos nombres:
- logo.svg
- portada.svg
- noticia-1.svg, noticia-2.svg, noticia-3.svg
- galeria-1.svg hasta galeria-6.svg

También puedes usar PNG o JPG, pero entonces debes cambiar la extensión en
los HTML y en css/estilos.css.

DOCUMENTOS PDF
--------------
Guarda los PDF en assets/docs/.
Ejemplo desde una página interna:
href="../assets/docs/organigrama.pdf"

PRUEBA LOCAL
------------
Abre index.html con doble clic. Para una prueba más exacta puedes usar
la extensión Live Server de Visual Studio Code.

SUBIR A CPANEL
--------------
1. Comprime el contenido de la carpeta chalma-web.
2. En cPanel abre Administrador de archivos.
3. Entra a public_html.
4. Sube el ZIP y extráelo.
5. Verifica que index.html quede directamente en public_html.

Correcto:
public_html/index.html
public_html/css/estilos.css
public_html/paginas/noticias.html

Incorrecto:
public_html/chalma-web/chalma-web/index.html

CONTENIDO PENDIENTE
-------------------
Los nombres, teléfonos, correos, fechas, fotografías, documentos y textos son
provisionales. Se pueden sustituir uno por uno conforme compartas la información.
