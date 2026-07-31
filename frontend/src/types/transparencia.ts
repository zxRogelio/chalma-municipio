export interface RespuestaApi<T> {
  exito: boolean
  cantidad?: number
  datos: T
  mensaje?: string
}

export type TipoSeccionTransparencia =
  | 'obligaciones_comunes'
  | 'obligaciones_especificas'
  | 'obras_publicas'
  | 'fondos_federales'
  | 'informacion_financiera'
  | 'cuenta_publica'
  | 'licitaciones'

export type TipoArchivoDocumento = string

export interface DocumentoTransparencia {
  id: number
  categoriaId: number
  titulo: string
  descripcion: string | null
  ejercicioFiscal: number
  periodo: string
  tipoArchivo: TipoArchivoDocumento
  tipoMime: string | null
  nombreOriginal: string | null
  urlPublica: string | null
  tamanoBytes: number | null
  fechaPublicacion: string | null
  orden: number
  estaActivo: boolean
}

export interface CategoriaTransparenciaResumen {
  id: number
  categoriaPadreId: number | null
  titulo: string
  slug: string
  descripcion: string | null
  fundamentoLegal: string | null
  tipoSeccion: TipoSeccionTransparencia | string
  orden: number
  estaActivo: boolean
  cantidadDocumentos: number
}

export interface CategoriaTransparencia
  extends CategoriaTransparenciaResumen {
  categoriasHijas?: CategoriaTransparencia[]
  categoriaPadre?: CategoriaTransparenciaResumen | null
  documentos?: DocumentoTransparencia[]
}

export interface CategoriaPublicaTransparencia {
  categoria: CategoriaTransparenciaResumen
  categoriaPadre: CategoriaTransparenciaResumen | null
  breadcrumbs: CategoriaTransparenciaResumen[]
  subcategorias: CategoriaTransparenciaResumen[]
  documentos: DocumentoTransparencia[]
}

export type CategoriaTransparenciaRespuesta = Omit<
  CategoriaTransparencia,
  'cantidadDocumentos' | 'categoriasHijas' | 'categoriaPadre' | 'documentos'
> & {
  cantidadDocumentos?: number
  categoriasHijas?: CategoriaTransparenciaRespuesta[]
  categoriaPadre?: CategoriaTransparenciaResumen | null
  documentos?: DocumentoTransparencia[]
}

export interface FiltrosDocumentosTransparencia {
  ejercicio?: number | string
  periodo?: string
}

export interface OpcionesConsultaApi {
  signal?: AbortSignal
}
