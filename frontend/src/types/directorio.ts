export interface RegistroDirectorioPublico {
  id: number
  area: string
  titular: string | null
  cargo: string | null
  telefono: string | null
  correo: string | null
  mostrarTelefono: boolean
  mostrarCorreo: boolean
}

export interface RegistroDirectorioAdministracion
  extends RegistroDirectorioPublico {
  orden: number
  estaActivo: boolean
  createdAt: string
  updatedAt: string
}

export interface DatosRegistroDirectorio {
  area: string
  titular: string
  cargo: string
  telefono: string
  correo: string
  mostrarTelefono: boolean
  mostrarCorreo: boolean
  orden: number
  estaActivo: boolean
}

export interface RespuestaDirectorioPublico {
  directorio: RegistroDirectorioPublico[]
  mensaje?: string
}

export interface RespuestaDirectorioAdministracion {
  exito: boolean
  cantidad?: number
  datos: RegistroDirectorioAdministracion[]
  mensaje?: string
}

export interface RespuestaRegistroDirectorioAdministracion {
  exito: boolean
  datos: RegistroDirectorioAdministracion
  mensaje?: string
}
