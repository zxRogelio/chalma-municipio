export interface Administrador {
  id: number
  nombre: string
  nombreUsuario: string
  rol: string
  estaActivo: boolean
  ultimoAcceso: string | null
}

export interface CredencialesAdministrador {
  nombreUsuario: string
  contrasena: string
}

export interface RespuestaAutenticacion {
  exito: boolean
  datos?: {
    administrador: Administrador
  }
  mensaje?: string
}

export interface RespuestaSesion {
  exito: boolean
  datos?: {
    administrador: Administrador
  }
  mensaje?: string
}

export interface RespuestaResumenAdministracion {
  exito: boolean
  datos?: {
    administrador: Administrador
    mensaje: string
  }
  mensaje?: string
}
