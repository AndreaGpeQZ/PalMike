import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const expectedScope = new URL(import.meta.env.BASE_URL, window.location.origin).href

    navigator.serviceWorker.getRegistrations()
      .then((registrations) => Promise.all(
        registrations.map((registration) => {
          if (registration.scope !== expectedScope) {
            return registration.unregister()
          }

          return Promise.resolve(false)
        }),
      ))
      .then(() => navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, {
        scope: import.meta.env.BASE_URL,
      }))
      .then((registration) => {
        console.log('Service Worker registrado:', registration.scope)
        registration.update()
      })
      .catch((err) => console.error('Error al registrar SW:', err))
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)