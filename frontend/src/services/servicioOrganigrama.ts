import api from './api'
import type {
  DatosOrganigrama,
  OrganigramaAdministracion,
  OrganigramaPublico,
} from '../types/organigrama'
import type { OpcionesConsultaApi } from '../types/transparencia'

function obtenerOrigenApi() {
  return new URL(
    api.defaults.baseURL ?? window.location.origin,
    window.location.origin,
  ).origin.replace(/\/$/, '')
}

export function construirUrlArchivoOrganigrama(urlArchivo: string | null) {
  if (!urlArchivo) {
    return null
  }

  if (/^https?:\/\//i.test(urlArchivo)) {
    return urlArchivo
  }

  return `${obtenerOrigenApi()}${urlArchivo.startsWith('/') ? '' : '/'}${urlArchivo}`
}

export async function obtenerOrganigramaPublico(
  opciones: OpcionesConsultaApi = {},
) {
  const respuesta = await api.get<OrganigramaPublico>('/organigrama', {
    signal: opciones.signal,
  })

  return respuesta.data
}

export async function obtenerOrganigramaAdministracion() {
  const respuesta = await api.get<OrganigramaAdministracion>(
    '/administracion/organigrama',
  )

  return respuesta.data
}

export async function actualizarOrganigramaAdministracion(
  datos: DatosOrganigrama,
) {
  const respuesta = await api.put<OrganigramaAdministracion>(
    '/administracion/organigrama',
    datos,
  )

  return respuesta.data
}

export async function reemplazarArchivoOrganigramaAdministracion(
  archivo: File,
) {
  const formulario = new FormData()
  formulario.append('archivo', archivo)

  const respuesta = await api.post<OrganigramaAdministracion>(
    '/administracion/organigrama/archivo',
    formulario,
  )

  return respuesta.data
}
