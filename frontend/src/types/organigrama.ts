export interface OrganigramaPublico {
  titulo: string | null
  descripcion: string | null
  mostrarOrganigrama: boolean
  urlArchivo: string | null
  mensaje?: string
}

export interface OrganigramaAdministracion {
  id: number
  titulo: string | null
  descripcion: string | null
  nombreOriginal: string | null
  tipoMime: string | null
  tamanoBytes: number | null
  mostrarOrganigrama: boolean
  tieneArchivo: boolean
  urlArchivo: string | null
  createdAt: string
  updatedAt: string
  mensaje?: string
}

export interface DatosOrganigrama {
  titulo: string
  descripcion: string
  mostrarOrganigrama: boolean
}
