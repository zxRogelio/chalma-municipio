import api from './api'
import type {
  ConfiguracionContactoAdministracion,
  ConfiguracionContactoPublica,
  DatosConfiguracionContacto,
} from '../types/contacto'
import type { OpcionesConsultaApi } from '../types/transparencia'

export async function obtenerContactoPublico(
  opciones: OpcionesConsultaApi = {},
) {
  const respuesta = await api.get<ConfiguracionContactoPublica>('/contacto', {
    signal: opciones.signal,
  })

  return respuesta.data
}

export async function obtenerConfiguracionContactoAdministracion() {
  const respuesta = await api.get<ConfiguracionContactoAdministracion>(
    '/administracion/contacto',
  )

  return respuesta.data
}

export async function actualizarConfiguracionContactoAdministracion(
  datos: DatosConfiguracionContacto,
) {
  const respuesta = await api.put<ConfiguracionContactoAdministracion>(
    '/administracion/contacto',
    datos,
  )

  return respuesta.data
}
