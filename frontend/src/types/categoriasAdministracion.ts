export type TipoSeccionTransparencia =
  | 'obligaciones_comunes'
  | 'obligaciones_especificas'
  | 'obras_publicas'
  | 'fondos_federales'
  | 'informacion_financiera'
  | 'cuenta_publica'
  | 'licitaciones'

export interface CategoriaPadreResumen {
  id: number
  titulo: string
  slug: string
}

export interface CategoriaAdministracion {
  id: number
  categoriaPadreId: number | null
  titulo: string
  slug: string
  descripcion: string | null
  fundamentoLegal: string | null
  tipoSeccion: TipoSeccionTransparencia
  orden: number
  estaActivo: boolean
  cantidadDocumentos: number
  cantidadSubcategorias: number
  categoriaPadre: CategoriaPadreResumen | null
  createdAt: string
  updatedAt: string
}

export interface DatosCategoriaAdministracion {
  titulo: string
  descripcion: string
  fundamentoLegal: string
  tipoSeccion: TipoSeccionTransparencia
  categoriaPadreId: number | null
  orden: number
  estaActivo: boolean
}

export interface FiltrosCategoriasAdministracion {
  soloRaices?: boolean
  tipoSeccion?: TipoSeccionTransparencia | ''
  estaActivo?: 'todos' | 'activas' | 'inactivas'
  categoriaPadreId?: number | null
  busqueda?: string
}

export interface RespuestaCategoriasAdministracion {
  exito: boolean
  cantidad?: number
  datos: CategoriaAdministracion[]
  mensaje?: string
}

export interface RespuestaCategoriaAdministracion {
  exito: boolean
  datos: CategoriaAdministracion
  mensaje?: string
  advertencia?: string
}

export const tiposSeccionTransparencia: TipoSeccionTransparencia[] = [
  'obligaciones_comunes',
  'obligaciones_especificas',
  'obras_publicas',
  'fondos_federales',
  'informacion_financiera',
  'cuenta_publica',
  'licitaciones',
]

export const etiquetasTipoSeccion: Record<TipoSeccionTransparencia, string> = {
  obligaciones_comunes: 'Obligaciones comunes',
  obligaciones_especificas: 'Obligaciones especificas',
  obras_publicas: 'Obras publicas',
  fondos_federales: 'Fondos federales',
  informacion_financiera: 'Informacion financiera',
  cuenta_publica: 'Cuenta publica',
  licitaciones: 'Licitaciones',
}

export function puedeCrearSubcategorias(
  categoria: Pick<
    CategoriaAdministracion,
    'tipoSeccion' | 'categoriaPadreId'
  >,
) {
  void categoria
  return true
}
