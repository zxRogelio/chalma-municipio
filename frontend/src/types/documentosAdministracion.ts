export const periodosDocumentoAdministracion = [
  'Anual',
  'Primer trimestre',
  'Segundo trimestre',
  'Tercer trimestre',
  'Cuarto trimestre',
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
  'Otro',
] as const

export type PeriodoDocumentoAdministracion =
  (typeof periodosDocumentoAdministracion)[number]

export interface DocumentoAdministracion {
  id: number
  categoriaId: number
  titulo: string
  descripcion: string | null
  ejercicioFiscal: number
  periodo: PeriodoDocumentoAdministracion | string
  tipoArchivo: string
  tipoMime: string | null
  nombreOriginal: string | null
  urlPublica: string | null
  tamanoBytes: number | null
  fechaPublicacion: string | null
  orden: number
  estaActivo: boolean
  createdAt: string
  updatedAt: string
}

export interface DatosFormularioDocumentoAdministracion {
  archivo: File | null
  titulo: string
  descripcion: string
  ejercicioFiscal: number
  periodo: PeriodoDocumentoAdministracion
  orden: number
  estaActivo: boolean
}

export interface DatosDocumentoAdministracion {
  titulo: string
  descripcion: string
  ejercicioFiscal: number
  periodo: PeriodoDocumentoAdministracion
  orden: number
  estaActivo: boolean
}

export interface FiltrosDocumentosAdministracion {
  ejercicio?: string
  periodo?: PeriodoDocumentoAdministracion | ''
  estaActivo?: 'todos' | 'activas' | 'inactivas'
  busqueda?: string
}

export interface RespuestaDocumentosAdministracion {
  exito: boolean
  cantidad?: number
  datos: DocumentoAdministracion[]
  mensaje?: string
}

export interface RespuestaDocumentoAdministracion {
  exito: boolean
  datos: DocumentoAdministracion
  mensaje?: string
}

export const extensionesDocumentosPermitidas =
  '.pdf,.doc,.docx,.xls,.xlsx,.csv,.zip,.png,.jpg,.jpeg'
