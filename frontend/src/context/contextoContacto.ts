import { createContext } from 'react'
import type { ConfiguracionContactoPublica } from '../types/contacto'

export const configuracionContactoOculta: ConfiguracionContactoPublica = {
  telefono: null,
  correo: null,
  mostrarTelefono: false,
  mostrarCorreo: false,
}

export interface ValorContextoContacto {
  configuracion: ConfiguracionContactoPublica
  estaCargando: boolean
  mensajeError: string
  recargarContacto: () => Promise<void>
}

export const ContextoContacto = createContext<
  ValorContextoContacto | undefined
>(undefined)
