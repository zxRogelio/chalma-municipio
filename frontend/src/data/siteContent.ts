import type {
  DepartmentCard,
  DirectoryEntry,
  DocumentItem,
  PersonCard,
  ProjectCard,
  TransparencySection,
} from '../types/site'

const provisionalDocuments: DocumentItem[] = [
  {
    type: 'PDF',
    title: 'Documento oficial pendiente',
    description: 'Descripcion, periodo y fecha de actualizacion.',
  },
  {
    type: 'PDF',
    title: 'Segundo documento pendiente',
    description: 'Descripcion, periodo y fecha de actualizacion.',
  },
  {
    type: 'PDF',
    title: 'Tercer documento pendiente',
    description: 'Descripcion, periodo y fecha de actualizacion.',
  },
]

export const transparencySections = {
  common: {
    title: 'Obligaciones comunes',
    route: '/transparencia/obligaciones-comunes',
    heroDescription:
      'Informacion publica correspondiente a las obligaciones comunes de transparencia.',
    intro: 'Organiza aqui los documentos por ejercicio, periodo y fraccion.',
    documents: provisionalDocuments,
  },
  specific: {
    title: 'Obligaciones especificas',
    route: '/transparencia/obligaciones-especificas',
    heroDescription:
      'Informacion publica correspondiente a las obligaciones especificas municipales.',
    intro: 'Organiza aqui los documentos propios del Ayuntamiento.',
    documents: provisionalDocuments,
  },
  works: {
    title: 'Obras publicas',
    route: '/transparencia/obras-publicas',
    heroDescription:
      'Consulta proyectos, avances e informacion de infraestructura municipal.',
    intro: 'Proyectos y avances pendientes de cargar.',
    documents: provisionalDocuments,
  },
  funds: {
    title: 'Evaluacion de fondos federales',
    route: '/transparencia/fondos-federales',
    heroDescription:
      'Documentos, evaluaciones e informes relacionados con fondos federales.',
    intro: 'Agrega evaluaciones, informes, anexos y resultados.',
    documents: provisionalDocuments,
  },
  finance: {
    title: 'Informacion financiera',
    route: '/transparencia/informacion-financiera',
    heroDescription: 'Presupuestos, estados financieros e informes del municipio.',
    intro: 'Publica presupuestos, estados financieros y reportes trimestrales.',
    documents: provisionalDocuments,
  },
  account: {
    title: 'Cuenta publica',
    route: '/transparencia/cuenta-publica',
    heroDescription: 'Consulta los documentos de cuenta publica del municipio.',
    intro: 'Agrega los tomos, anexos y documentos de cada ejercicio.',
    documents: provisionalDocuments,
  },
  bids: {
    title: 'Licitaciones',
    route: '/transparencia/licitaciones',
    heroDescription:
      'Convocatorias, bases, fallos y procedimientos de contratacion publica.',
    intro: 'Publica convocatorias, bases, juntas de aclaraciones y fallos.',
    documents: provisionalDocuments,
  },
} satisfies Record<string, TransparencySection>

export const directoryEntries: DirectoryEntry[] = [
  {
    area: 'Presidencia Municipal',
    lead: 'Por definir',
    phone: '000 000 00 00',
    email: 'presidencia@chalma.gob.mx',
  },
  {
    area: 'Secretaria',
    lead: 'Por definir',
    phone: '000 000 00 00',
    email: 'secretaria@chalma.gob.mx',
  },
  {
    area: 'Tesoreria',
    lead: 'Por definir',
    phone: '000 000 00 00',
    email: 'tesoreria@chalma.gob.mx',
  },
  {
    area: 'Obras Publicas',
    lead: 'Por definir',
    phone: '000 000 00 00',
    email: 'obras@chalma.gob.mx',
  },
]

export const councilMembers: PersonCard[] = [
  { name: 'Nombre por definir', role: 'Presidencia Municipal' },
  { name: 'Nombre por definir', role: 'Sindicatura' },
  { name: 'Nombre por definir', role: 'Regiduria' },
  { name: 'Nombre por definir', role: 'Regiduria' },
]

export const departments: DepartmentCard[] = [
  {
    title: 'Secretaria del Ayuntamiento',
    description: 'Descripcion y funciones pendientes.',
    icon: 'home',
  },
  {
    title: 'Tesoreria Municipal',
    description: 'Descripcion y funciones pendientes.',
    icon: 'cash',
  },
  {
    title: 'Obras Publicas',
    description: 'Descripcion y funciones pendientes.',
    icon: 'works',
  },
  {
    title: 'Desarrollo Social',
    description: 'Descripcion y funciones pendientes.',
    icon: 'people',
  },
  {
    title: 'Proteccion Civil',
    description: 'Descripcion y funciones pendientes.',
    icon: 'shield',
  },
  {
    title: 'Servicios Municipales',
    description: 'Descripcion y funciones pendientes.',
    icon: 'services',
  },
]

export const projectCards: ProjectCard[] = [
  {
    status: 'En proceso',
    title: 'Nombre de la obra 1',
    description: 'Ubicacion, inversion, metas y avance fisico.',
  },
  {
    status: 'Programada',
    title: 'Nombre de la obra 2',
    description: 'Ubicacion, inversion, metas y avance fisico.',
  },
  {
    status: 'Finalizada',
    title: 'Nombre de la obra 3',
    description: 'Ubicacion, inversion, metas y avance fisico.',
  },
]
