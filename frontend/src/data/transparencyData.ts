export type DocumentFileType =
  | 'PDF'
  | 'DOCX'
  | 'XLSX'
  | 'ZIP'
  | 'PNG'
  | 'JPG'

export interface DocumentPeriod {
  year: number
  label: string
}

export interface TransparencyDocument {
  id: string
  title: string
  period: DocumentPeriod
  fileType: DocumentFileType
  href: string
  size?: string
  downloadName?: string
}

export interface TransparencyCategory {
  id: string
  title: string
  slug: string
  description: string
  legalBasis?: string
  sortOrder: number
  documents: TransparencyDocument[]
}

const provisionalPdfPath =
  '/assets/docs/provisional/aviso-documento-provisional.pdf'

const createDocument = (
  id: string,
  title: string,
  periodLabel: string,
  size = '120 KB',
): TransparencyDocument => ({
  id,
  title,
  period: {
    year: 2026,
    label: periodLabel,
  },
  fileType: 'PDF',
  href: provisionalPdfPath,
  size,
  downloadName: `${id}.pdf`,
})

export const commonObligationIntro =
  'En cumplimiento del art\u00edculo 15 de la Ley General de Transparencia y Acceso a la Informaci\u00f3n P\u00fablica, este apartado organiza de forma provisional las fracciones de obligaciones comunes. La informaci\u00f3n publicada en esta fase es demostrativa y deber\u00e1 sustituirse por documentos oficiales.'

export const commonObligationCategories: TransparencyCategory[] = [
  {
    id: 'fraccion-i',
    title: 'Fracci\u00f3n I.- Marco Normativo',
    slug: 'fraccion-i-marco-normativo',
    description:
      'Normatividad aplicable al Ayuntamiento, incluyendo leyes, reglamentos y disposiciones administrativas.',
    legalBasis: 'Art\u00edculo 15, fracci\u00f3n I de la LGTAIP.',
    sortOrder: 1,
    documents: [
      createDocument(
        'fraccion-i-marco-normativo-2026',
        'Archivo provisional de marco normativo',
        'Anual',
      ),
      createDocument(
        'fraccion-i-reglamentos-2026',
        'Listado provisional de reglamentos municipales',
        'Anual',
      ),
    ],
  },
  {
    id: 'fraccion-ii',
    title: 'Fracci\u00f3n II.- Estructura Org\u00e1nica',
    slug: 'fraccion-ii-estructura-organica',
    description:
      'Estructura org\u00e1nica completa, atribuciones y unidades administrativas del sujeto obligado.',
    legalBasis: 'Art\u00edculo 15, fracci\u00f3n II de la LGTAIP.',
    sortOrder: 2,
    documents: [
      createDocument(
        'fraccion-ii-estructura-organica-2026',
        'Archivo provisional de estructura organica',
        'Primer trimestre',
      ),
    ],
  },
  {
    id: 'fraccion-iii',
    title: 'Fracci\u00f3n III.- Facultades de cada \u00e1rea',
    slug: 'fraccion-iii-facultades-de-cada-area',
    description:
      'Facultades y responsabilidades asignadas a cada \u00e1rea administrativa municipal.',
    legalBasis: 'Art\u00edculo 15, fracci\u00f3n III de la LGTAIP.',
    sortOrder: 3,
    documents: [
      createDocument(
        'fraccion-iii-facultades-2026',
        'Archivo provisional de facultades por area',
        'Anual',
      ),
    ],
  },
  {
    id: 'fraccion-iv',
    title: 'Fracci\u00f3n IV.- Metas y objetivos',
    slug: 'fraccion-iv-metas-y-objetivos',
    description:
      'Metas y objetivos institucionales de las \u00e1reas conforme a sus programas operativos.',
    legalBasis: 'Art\u00edculo 15, fracci\u00f3n IV de la LGTAIP.',
    sortOrder: 4,
    documents: [
      createDocument(
        'fraccion-iv-metas-objetivos-2026',
        'Archivo provisional de metas y objetivos',
        'Anual',
      ),
      createDocument(
        'fraccion-iv-programa-operativo-2026',
        'Programa operativo provisional',
        'Anual',
      ),
    ],
  },
  {
    id: 'fraccion-v',
    title: 'Fracci\u00f3n V.- Indicadores de inter\u00e9s p\u00fablico',
    slug: 'fraccion-v-indicadores-de-interes-publico',
    description:
      'Indicadores relacionados con temas de inter\u00e9s p\u00fablico y seguimiento ciudadano.',
    legalBasis: 'Art\u00edculo 15, fracci\u00f3n V de la LGTAIP.',
    sortOrder: 5,
    documents: [],
  },
  {
    id: 'fraccion-vi',
    title: 'Fracci\u00f3n VI.- Indicadores de resultados',
    slug: 'fraccion-vi-indicadores-de-resultados',
    description:
      'Indicadores que permiten evaluar resultados y desempe\u00f1o de programas municipales.',
    legalBasis: 'Art\u00edculo 15, fracci\u00f3n VI de la LGTAIP.',
    sortOrder: 6,
    documents: [
      createDocument(
        'fraccion-vi-indicadores-resultados-2026',
        'Archivo provisional de indicadores de resultados',
        'Segundo trimestre',
      ),
    ],
  },
  {
    id: 'fraccion-vii',
    title: 'Fracci\u00f3n VII.- Directorio de servidores p\u00fablicos',
    slug: 'fraccion-vii-directorio-de-servidores-publicos',
    description:
      'Directorio de servidores p\u00fablicos con datos institucionales de contacto.',
    legalBasis: 'Art\u00edculo 15, fracci\u00f3n VII de la LGTAIP.',
    sortOrder: 7,
    documents: [
      createDocument(
        'fraccion-vii-directorio-servidores-publicos-2026',
        'Directorio provisional de servidores publicos',
        'Primer trimestre',
      ),
    ],
  },
  {
    id: 'fraccion-viii',
    title: 'Fracci\u00f3n VIII.- Remuneraci\u00f3n',
    slug: 'fraccion-viii-remuneracion',
    description:
      'Remuneraci\u00f3n bruta y neta de servidores p\u00fablicos, seg\u00fan corresponda.',
    legalBasis: 'Art\u00edculo 15, fracci\u00f3n VIII de la LGTAIP.',
    sortOrder: 8,
    documents: [
      createDocument(
        'fraccion-viii-remuneracion-2026',
        'Archivo provisional de remuneracion',
        'Primer trimestre',
      ),
    ],
  },
  {
    id: 'fraccion-ix',
    title: 'Fracci\u00f3n IX.- Gastos de representaci\u00f3n',
    slug: 'fraccion-ix-gastos-de-representacion',
    description:
      'Gastos de representaci\u00f3n y vi\u00e1ticos asignados a servidores p\u00fablicos.',
    legalBasis: 'Art\u00edculo 15, fracci\u00f3n IX de la LGTAIP.',
    sortOrder: 9,
    documents: [
      createDocument(
        'fraccion-ix-gastos-representacion-2026',
        'Archivo provisional de gastos de representacion',
        'Primer trimestre',
      ),
    ],
  },
  {
    id: 'fraccion-x',
    title: 'Fracci\u00f3n X.- N\u00famero total de plazas',
    slug: 'fraccion-x-numero-total-de-plazas',
    description:
      'N\u00famero total de plazas, personal de base, confianza y contrataciones aplicables.',
    legalBasis: 'Art\u00edculo 15, fracci\u00f3n X de la LGTAIP.',
    sortOrder: 10,
    documents: [
      createDocument(
        'fraccion-x-numero-total-plazas-2026',
        'Archivo provisional de numero total de plazas',
        'Anual',
      ),
    ],
  },
  {
    id: 'fraccion-xi',
    title: 'Fracci\u00f3n XI.- Contrataciones de servicios',
    slug: 'fraccion-xi-contrataciones-de-servicios',
    description:
      'Contrataciones de servicios profesionales por honorarios y datos relacionados.',
    legalBasis: 'Art\u00edculo 15, fracci\u00f3n XI de la LGTAIP.',
    sortOrder: 11,
    documents: [],
  },
  {
    id: 'fraccion-xii',
    title: 'Fracci\u00f3n XII.- Informaci\u00f3n de declaraciones',
    slug: 'fraccion-xii-informacion-de-declaraciones',
    description:
      'Informaci\u00f3n p\u00fablica relativa a declaraciones patrimoniales, fiscales o de intereses cuando aplique.',
    legalBasis: 'Art\u00edculo 15, fracci\u00f3n XII de la LGTAIP.',
    sortOrder: 12,
    documents: [
      createDocument(
        'fraccion-xii-informacion-declaraciones-2026',
        'Archivo provisional de informacion de declaraciones',
        'Anual',
      ),
    ],
  },
]

export function getCommonObligationCategory(slug: string | undefined) {
  return commonObligationCategories.find((category) => category.slug === slug)
}
