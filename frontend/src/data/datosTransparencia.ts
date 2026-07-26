export type TipoArchivoDocumento =
  | 'PDF'
  | 'DOCX'
  | 'XLSX'
  | 'ZIP'
  | 'PNG'
  | 'JPG'

export interface PeriodoDocumento {
  anio: number
  etiqueta: string
}

export interface DocumentoTransparencia {
  id: string
  titulo: string
  periodo: PeriodoDocumento
  tipoArchivo: TipoArchivoDocumento
  url: string
  tamano?: string
  nombreDescarga?: string
}

export interface CategoriaTransparencia {
  id: string
  titulo: string
  slug: string
  descripcion: string
  fundamentoLegal?: string
  orden: number
  documentos: DocumentoTransparencia[]
}

const rutaPdfProvisional =
  '/assets/docs/provisional/aviso-documento-provisional.pdf'

const crearDocumento = (
  id: string,
  titulo: string,
  etiquetaPeriodo: string,
  tamano = '120 KB',
): DocumentoTransparencia => ({
  id,
  titulo,
  periodo: {
    anio: 2026,
    etiqueta: etiquetaPeriodo,
  },
  tipoArchivo: 'PDF',
  url: rutaPdfProvisional,
  tamano,
  nombreDescarga: `${id}.pdf`,
})

export const introduccionObligacionesComunes =
  'En cumplimiento del articulo 15 de la Ley General de Transparencia y Acceso a la Informacion Publica, este apartado organiza de forma provisional las fracciones de obligaciones comunes. La informacion publicada en esta fase es demostrativa y debera sustituirse por documentos oficiales.'

export const categoriasObligacionesComunes: CategoriaTransparencia[] = [
  {
    id: 'fraccion-i',
    titulo: 'Fraccion I.- Marco Normativo',
    slug: 'fraccion-i-marco-normativo',
    descripcion:
      'Normatividad aplicable al Ayuntamiento, incluyendo leyes, reglamentos y disposiciones administrativas.',
    fundamentoLegal: 'Articulo 15, fraccion I de la LGTAIP.',
    orden: 1,
    documentos: [
      crearDocumento(
        'fraccion-i-marco-normativo-2026',
        'Archivo provisional de marco normativo',
        'Anual',
      ),
      crearDocumento(
        'fraccion-i-reglamentos-2026',
        'Listado provisional de reglamentos municipales',
        'Anual',
      ),
    ],
  },
  {
    id: 'fraccion-ii',
    titulo: 'Fraccion II.- Estructura Organica',
    slug: 'fraccion-ii-estructura-organica',
    descripcion:
      'Estructura organica completa, atribuciones y unidades administrativas del sujeto obligado.',
    fundamentoLegal: 'Articulo 15, fraccion II de la LGTAIP.',
    orden: 2,
    documentos: [
      crearDocumento(
        'fraccion-ii-estructura-organica-2026',
        'Archivo provisional de estructura organica',
        'Primer trimestre',
      ),
    ],
  },
  {
    id: 'fraccion-iii',
    titulo: 'Fraccion III.- Facultades de cada area',
    slug: 'fraccion-iii-facultades-de-cada-area',
    descripcion:
      'Facultades y responsabilidades asignadas a cada area administrativa municipal.',
    fundamentoLegal: 'Articulo 15, fraccion III de la LGTAIP.',
    orden: 3,
    documentos: [
      crearDocumento(
        'fraccion-iii-facultades-2026',
        'Archivo provisional de facultades por area',
        'Anual',
      ),
    ],
  },
  {
    id: 'fraccion-iv',
    titulo: 'Fraccion IV.- Metas y objetivos',
    slug: 'fraccion-iv-metas-y-objetivos',
    descripcion:
      'Metas y objetivos institucionales de las areas conforme a sus programas operativos.',
    fundamentoLegal: 'Articulo 15, fraccion IV de la LGTAIP.',
    orden: 4,
    documentos: [
      crearDocumento(
        'fraccion-iv-metas-objetivos-2026',
        'Archivo provisional de metas y objetivos',
        'Anual',
      ),
      crearDocumento(
        'fraccion-iv-programa-operativo-2026',
        'Programa operativo provisional',
        'Anual',
      ),
    ],
  },
  {
    id: 'fraccion-v',
    titulo: 'Fraccion V.- Indicadores de interes publico',
    slug: 'fraccion-v-indicadores-de-interes-publico',
    descripcion:
      'Indicadores relacionados con temas de interes publico y seguimiento ciudadano.',
    fundamentoLegal: 'Articulo 15, fraccion V de la LGTAIP.',
    orden: 5,
    documentos: [],
  },
  {
    id: 'fraccion-vi',
    titulo: 'Fraccion VI.- Indicadores de resultados',
    slug: 'fraccion-vi-indicadores-de-resultados',
    descripcion:
      'Indicadores que permiten evaluar resultados y desempeno de programas municipales.',
    fundamentoLegal: 'Articulo 15, fraccion VI de la LGTAIP.',
    orden: 6,
    documentos: [
      crearDocumento(
        'fraccion-vi-indicadores-resultados-2026',
        'Archivo provisional de indicadores de resultados',
        'Segundo trimestre',
      ),
    ],
  },
  {
    id: 'fraccion-vii',
    titulo: 'Fraccion VII.- Directorio de servidores publicos',
    slug: 'fraccion-vii-directorio-de-servidores-publicos',
    descripcion:
      'Directorio de servidores publicos con datos institucionales de contacto.',
    fundamentoLegal: 'Articulo 15, fraccion VII de la LGTAIP.',
    orden: 7,
    documentos: [
      crearDocumento(
        'fraccion-vii-directorio-servidores-publicos-2026',
        'Directorio provisional de servidores publicos',
        'Primer trimestre',
      ),
    ],
  },
  {
    id: 'fraccion-viii',
    titulo: 'Fraccion VIII.- Remuneracion',
    slug: 'fraccion-viii-remuneracion',
    descripcion:
      'Remuneracion bruta y neta de servidores publicos, segun corresponda.',
    fundamentoLegal: 'Articulo 15, fraccion VIII de la LGTAIP.',
    orden: 8,
    documentos: [
      crearDocumento(
        'fraccion-viii-remuneracion-2026',
        'Archivo provisional de remuneracion',
        'Primer trimestre',
      ),
    ],
  },
  {
    id: 'fraccion-ix',
    titulo: 'Fraccion IX.- Gastos de representacion',
    slug: 'fraccion-ix-gastos-de-representacion',
    descripcion:
      'Gastos de representacion y viaticos asignados a servidores publicos.',
    fundamentoLegal: 'Articulo 15, fraccion IX de la LGTAIP.',
    orden: 9,
    documentos: [
      crearDocumento(
        'fraccion-ix-gastos-representacion-2026',
        'Archivo provisional de gastos de representacion',
        'Primer trimestre',
      ),
    ],
  },
  {
    id: 'fraccion-x',
    titulo: 'Fraccion X.- Numero total de plazas',
    slug: 'fraccion-x-numero-total-de-plazas',
    descripcion:
      'Numero total de plazas, personal de base, confianza y contrataciones aplicables.',
    fundamentoLegal: 'Articulo 15, fraccion X de la LGTAIP.',
    orden: 10,
    documentos: [
      crearDocumento(
        'fraccion-x-numero-total-plazas-2026',
        'Archivo provisional de numero total de plazas',
        'Anual',
      ),
    ],
  },
  {
    id: 'fraccion-xi',
    titulo: 'Fraccion XI.- Contrataciones de servicios',
    slug: 'fraccion-xi-contrataciones-de-servicios',
    descripcion:
      'Contrataciones de servicios profesionales por honorarios y datos relacionados.',
    fundamentoLegal: 'Articulo 15, fraccion XI de la LGTAIP.',
    orden: 11,
    documentos: [],
  },
  {
    id: 'fraccion-xii',
    titulo: 'Fraccion XII.- Informacion de declaraciones',
    slug: 'fraccion-xii-informacion-de-declaraciones',
    descripcion:
      'Informacion publica relativa a declaraciones patrimoniales, fiscales o de intereses cuando aplique.',
    fundamentoLegal: 'Articulo 15, fraccion XII de la LGTAIP.',
    orden: 12,
    documentos: [
      crearDocumento(
        'fraccion-xii-informacion-declaraciones-2026',
        'Archivo provisional de informacion de declaraciones',
        'Anual',
      ),
    ],
  },
]

export function obtenerCategoriaObligacionComun(slug: string | undefined) {
  return categoriasObligacionesComunes.find(
    (categoria) => categoria.slug === slug,
  )
}
