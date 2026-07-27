import api from './api'
import type {
  CredencialesAdministrador,
  RespuestaAutenticacion,
  RespuestaResumenAdministracion,
  RespuestaSesion,
} from '../types/autenticacion'

export async function iniciarSesion(
  credenciales: CredencialesAdministrador,
) {
  const respuesta = await api.post<RespuestaAutenticacion>(
    '/autenticacion/iniciar-sesion',
    credenciales,
  )

  return respuesta.data
}

export async function consultarSesion() {
  const respuesta = await api.get<RespuestaSesion>('/autenticacion/sesion')
  return respuesta.data
}

export async function cerrarSesion() {
  const respuesta = await api.post<RespuestaAutenticacion>(
    '/autenticacion/cerrar-sesion',
  )

  return respuesta.data
}

export async function consultarResumenAdministracion() {
  const respuesta = await api.get<RespuestaResumenAdministracion>(
    '/administracion/resumen',
  )

  return respuesta.data
}
