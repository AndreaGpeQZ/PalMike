# PWA Test – Despliegue en IONOS con Docker

## Materia
Desarrollo Web Profesional

## Institución
Universidad Tecnológica de Tijuana

## Docente
Mike Cardona (@mikecardona076)

## Objetivo
Comprender la arquitectura técnica de una Progressive Web App (PWA) y desplegarla en un servidor IONOS utilizando Docker, Nginx y certificados SSL, garantizando que la aplicación sea instalable, segura y funcional sin conexión.

---

## Web App Manifest (manifest.json)

El Web App Manifest es un archivo JSON que permite al navegador interpretar cómo debe comportarse la aplicación cuando se instala en un dispositivo.

### Propiedades clave:

- **theme_color**  
  Define el color principal de la aplicación, utilizado en la barra superior del navegador y en la UI del sistema operativo.

- **background_color**  
  Color que se muestra mientras la aplicación se carga al iniciar desde el ícono instalado.

- **display**
  - `browser`: se comporta como una página web tradicional.
  - `standalone`: elimina la barra del navegador y hace que la app se comporte como una aplicación nativa.

- **icons**
  Es un arreglo de íconos en distintos tamaños. Es obligatorio para que el navegador permita la instalación de la PWA en distintos dispositivos.

---

## Service Workers

Un Service Worker es un script que se ejecuta en segundo plano y actúa como un intermediario (proxy de red) entre la aplicación y la red.

### Registro
El Service Worker se registra desde el archivo principal de la aplicación (`main.tsx`) y solo se ejecuta en contextos seguros (HTTPS).

### Ciclo de Vida

1. **Installation**
   Se almacenan en caché los recursos principales de la aplicación.

2. **Activation**
   El Service Worker toma control de la aplicación y limpia cachés antiguos si es necesario.

3. **Fetching**
   Intercepta todas las solicitudes de red y decide si responder desde caché o desde la red.

### Proxy de Red
El Service Worker intercepta las solicitudes HTTP y puede responder con:
- Recursos almacenados en caché
- Recursos obtenidos desde la red
Esto permite el funcionamiento offline.

---

## Estrategias de Almacenamiento (Caching)

### Cache First
Prioriza los recursos en caché. Ideal para archivos estáticos.
- Muy rápido
- Puede servir contenido desactualizado

### Network First
Prioriza la red y usa caché como respaldo.
- Datos actualizados
- No funciona bien sin conexión

### Stale While Revalidate
Entrega caché inmediatamente y actualiza en segundo plano.
- Buen balance entre velocidad y actualización
- Recomendado para PWAs modernas

---

## Seguridad y TLS (HTTPS)

### ¿Por qué HTTPS es obligatorio?
Los Service Workers solo funcionan bajo HTTPS porque tienen control total sobre las solicitudes de red y podrían ser vulnerables a ataques si se ejecutaran en HTTP.

### Impacto en la instalación
Sin HTTPS:
- No se registra el Service Worker
- No aparece el botón de instalación
- Lighthouse falla la auditoría PWA

Con HTTPS válido:
- La app es instalable
- Se habilita el modo offline
- Se garantiza la integridad de los datos

---

## Tecnologías Utilizadas
- React + Vite + TypeScript
- Service Workers
- Web App Manifest
- Docker (multi-stage)
- Nginx
- IONOS Cloud Server
- Certificados SSL (Let's Encrypt / IONOS)
