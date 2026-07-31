import api from './api'
import type {
  DatosCambioContrasena,
  RespuestaCambioContrasena,
} from '../types/cuentaAdministracion'

export async function cambiarContrasenaAdministracion(
  datos: DatosCambioContrasena,
) {
  const respuesta = await api.put<RespuestaCambioContrasena>(
    '/administracion/cuenta/contrasena',
    datos,
  )

  return respuesta.data
}
