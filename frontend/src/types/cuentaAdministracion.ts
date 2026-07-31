export interface DatosCambioContrasena {
  contrasenaActual: string
  contrasenaNueva: string
  confirmacionContrasena: string
}

export interface RespuestaCambioContrasena {
  exito: boolean
  mensaje: string
}

export interface EstadoLoginAdministracion {
  mensaje?: string
}
