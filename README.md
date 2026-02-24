# PWA TEST IONOS - Investigación, Implementación y Despliegue

## Datos académicos
- **Materia:** Desarrollo Web Profesional
- **Institución:** Universidad Tecnológica de Tijuana
- **Docente:** Mike Cardona (@mikecardona076)

## Objetivo
Comprender la arquitectura de una PWA y desplegar una aplicación funcional en IONOS usando Docker + Nginx con HTTPS válido para cumplir instalabilidad y soporte offline.

## Parte 1: Investigación teórica

### 1) Web App Manifest (`manifest.json`)
El manifiesto define cómo el navegador “instala” y representa la web app como si fuera una app nativa.

- **`theme_color`:** color del UI del navegador/sistema (barra superior, color de interfaz del entorno instalado).
- **`background_color`:** color de arranque (splash) mientras la app inicia antes de renderizar.
- **`display`:**
  - `browser`: se abre como pestaña web tradicional.
  - `standalone`: se abre sin barra del navegador, experiencia tipo app instalada.
- **`icons`:** arreglo con íconos en tamaños múltiples (`192x192`, `512x512`). Es clave para instalación en Android/desktop y para cumplir auditorías de Lighthouse.

### 2) Service Workers
Un Service Worker (SW) es un script que corre en segundo plano y opera como **proxy de red programable** entre la aplicación y la red.

#### Registro
Se registra desde el cliente (`src/main.tsx`) con `navigator.serviceWorker.register('/sw.js')`.

#### Ciclo de vida
1. **Installation:** precachea recursos esenciales (app shell) para acelerar arranque y soportar offline.
2. **Activation:** elimina cachés viejas y toma control con `clients.claim()`.
3. **Fetching:** intercepta requests y responde con estrategia de caché/red según el tipo de recurso.

#### SW como proxy
Al interceptar `fetch`, el SW puede:
- responder desde caché,
- ir a red,
- mezclar ambos enfoques (ej. `Stale-While-Revalidate`).

Esto permite continuidad del servicio incluso con conectividad limitada.

### 3) Estrategias de caching

#### `Cache First`
- **Flujo:** primero caché; si no existe, red y luego cachea.
- **Ventaja:** máxima velocidad para assets estáticos.
- **Riesgo:** contenido desactualizado.

#### `Network First`
- **Flujo:** primero red; si falla, fallback a caché.
- **Ventaja:** contenido más fresco.
- **Riesgo:** mayor latencia y dependencia de conexión.

#### `Stale-While-Revalidate`
- **Flujo:** responde inmediato con caché (si existe) y actualiza en segundo plano desde red.
- **Ventaja:** equilibrio entre rapidez y actualización.
- **Riesgo:** puede mostrar brevemente datos antiguos.

### 4) Seguridad y TLS

#### ¿Por qué HTTPS es requisito habilitador?
Los SW tienen privilegios de interceptar tráfico, por lo que el navegador solo los habilita en **contexto seguro** (HTTPS o `localhost` en desarrollo). Sin TLS válido, el SW no se registra de forma confiable y la PWA pierde capacidades clave.

#### Impacto de certificados en Install Prompt
Sin HTTPS válido:
- falla criterio de instalabilidad,
- no se activa correctamente el flujo de instalación,
- Lighthouse marca errores en PWA/Security.

Con HTTPS válido:
- la app es instalable,
- el navegador habilita prompt/icono de instalación,
- mejora la confianza y la integridad de sesión.

---

## Parte 2: Implementación técnica

## Stack
- React + Vite + TypeScript.

## Funcionalidad implementada
- App tipo **Notes Manager**.
- Persistencia local con `localStorage`.
- Alta y eliminación de notas.
- Soporte offline vía Service Worker.

## Archivos principales
- App: `pwa/src/App.tsx`
- Estilos: `pwa/src/App.css`, `pwa/src/index.css`
- Registro SW: `pwa/src/main.tsx`
- Manifest: `pwa/public/manifest.json`
- Service Worker: `pwa/public/sw.js`

---

## Docker + Nginx (multi-etapa)

## Archivos de despliegue
- `pwa/Dockerfile`
- `pwa/nginx.conf`

## Estrategia de contenedor
1. **Build stage (`node:alpine`)**
   - instala dependencias,
   - ejecuta build de Vite,
   - genera `dist/`.
2. **Production stage (`nginx:stable-alpine`)**
   - sirve estáticos desde `/usr/share/nginx/html`,
   - redirige `80 -> 443`,
   - expone TLS en `443`.

---

## SSL en IONOS

Para que la PWA sea instalable en producción, usar certificado válido:
- **Opción A:** certificados de IONOS.
- **Opción B:** Let's Encrypt/Certbot.

En esta configuración, Nginx espera:
- `/etc/nginx/certs/fullchain.pem`
- `/etc/nginx/certs/privkey.pem`

Montaje típico al correr Docker:

```bash
docker run -d --name pwa-notes \
  -p 80:80 -p 443:443 \
  -v /ruta/en/servidor/certs:/etc/nginx/certs:ro \
  pwa-notes:latest
```

---

## Ejecución local rápida

Desde `pwa/`:

```bash
npm install
npm run build
docker build -t pwa-notes:latest .
docker run --rm -p 8080:80 pwa-notes:latest
```

Abrir: `http://localhost:8080`

---

## Instrucciones de entrega

1. Crear repositorio público: `pwa-ionos-nombre-apellido`.
2. Incluir en el repo: código fuente, `Dockerfile`, `nginx.conf` y este README.
3. Agregar colaborador obligatorio: `mikecardona076`.
4. Desplegar en instancia IONOS con HTTPS válido.
5. Validar con Lighthouse: instalable + offline.
6. Enviar correo con asunto: **"PWA TEST IONOS - [Tu Nombre]"** incluyendo:
   - URL HTTPS de la PWA funcionando.
   - Link del repositorio GitHub.

---

## Criterios de evaluación (checklist)
- **Técnico:** TypeScript y Docker correctamente usados.
- **PWA:** navegador muestra opción de instalar app.
- **Seguridad:** sitio con certificado SSL válido.
- **Investigación:** documentación técnica clara y profesional.

> "La implementación correcta de una PWA requiere una sinergia perfecta entre el desarrollo frontend y la configuración de infraestructura."
