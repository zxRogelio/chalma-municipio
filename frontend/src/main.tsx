import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootElement = document.body.firstElementChild

if (!(rootElement instanceof HTMLElement)) {
  throw new Error('No se encontro el contenedor principal de React.')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
