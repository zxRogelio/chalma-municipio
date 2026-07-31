import { createContext } from 'react'
import type {
  Administrador,
  CredencialesAdministrador,
  RespuestaAutenticacion,
} from '../types/autenticacion'

export interface ValorContextoAutenticacion {
  administrador: Administrador | null
  estaCargando: boolean
  estaAutenticado: boolean
  iniciarSesion: (
    credenciales: CredencialesAdministrador,
  ) => Promise<RespuestaAutenticacion>
  cerrarSesion: () => Promise<void>
  actualizarSesion: () => Promise<void>
}

export const ContextoAutenticacion = createContext<
  ValorContextoAutenticacion | undefined
>(undefined)
