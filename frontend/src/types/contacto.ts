export interface ConfiguracionContactoPublica {
  telefono: string | null
  correo: string | null
  mostrarTelefono: boolean
  mostrarCorreo: boolean
  mensaje?: string
}

export interface ConfiguracionContactoAdministracion
  extends ConfiguracionContactoPublica {
  id: number
  createdAt: string
  updatedAt: string
}

export interface DatosConfiguracionContacto {
  telefono: string
  correo: string
  mostrarTelefono: boolean
  mostrarCorreo: boolean
}
