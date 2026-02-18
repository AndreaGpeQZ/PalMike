# PalMike

1. Web App Manifest (manifest.json)
El archivo de manifiesto es la pieza fundamental que permite que una web sea "instalable". Es un archivo JSON que describe la aplicación al navegador.

•  Proporcionar información sobre la aplicación (nombre, autor, iconos, descripción) en un formato que el sistema operativo pueda usar para instalarla en la pantalla de inicio.
• 
• short_name: El nombre que aparece debajo del icono en el escritorio.
• start_url: La página que se abre al iniciar la app (usualmente / o index.html).
• display: Define la apariencia de la ventana. El valor standalone permite que la app se vea como una aplicación nativa, sin barras de navegación del navegador.
• icons: Conjunto de imágenes (usualmente 192x192 y 512x512) necesarias para el splash screen y el icono de acceso directo.

2. Service Worker (sw.js)
Es un script que el navegador ejecuta en segundo plano, actuando como un servidor proxy entre la aplicación web, el navegador y la red.

• 
• No tiene acceso directo al DOM (se comunica mediante postMessage).
• Es la base para el soporte  y las .



 Se inicia desde el archivo principal de JavaScript.

 El momento ideal para almacenar en caché los activos estáticos (App Shell).

 Ocurre cuando el Service Worker anterior se libera, permitiendo limpiar cachés antiguos.

 Permite interceptar peticiones de red para decidir si se sirve contenido desde el caché o se busca en internet, permitiendo que la app funcione sin conexión.
