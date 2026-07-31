import api from './api'
import type {
  DatosRegistroDirectorio,
  RespuestaDirectorioAdministracion,
  RespuestaDirectorioPublico,
  RespuestaRegistroDirectorioAdministracion,
} from '../types/directorio'
import type { OpcionesConsultaApi } from '../types/transparencia'

export async function obtenerDirectorioPublico(
  opciones: OpcionesConsultaApi = {},
) {
  const respuesta = await api.get<RespuestaDirectorioPublico>('/directorio', {
    signal: opciones.signal,
  })

  return respuesta.data.directorio
}

export async function listarDirectorioAdministracion() {
  const respuesta = await api.get<RespuestaDirectorioAdministracion>(
    '/administracion/directorio',
  )

  return respuesta.data
}

export async function crearRegistroDirectorioAdministracion(
  datos: DatosRegistroDirectorio,
) {
  const respuesta = await api.post<RespuestaRegistroDirectorioAdministracion>(
    '/administracion/directorio',
    datos,
  )

  return respuesta.data
}

export async function actualizarRegistroDirectorioAdministracion(
  id: number,
  datos: DatosRegistroDirectorio,
) {
  const respuesta = await api.put<RespuestaRegistroDirectorioAdministracion>(
    `/administracion/directorio/${id}`,
    datos,
  )

  return respuesta.data
}

export async function cambiarEstadoRegistroDirectorioAdministracion(
  id: number,
  estaActivo: boolean,
) {
  const respuesta = await api.patch<RespuestaRegistroDirectorioAdministracion>(
    `/administracion/directorio/${id}/estado`,
    { estaActivo },
  )

  return respuesta.data
}
