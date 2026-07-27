import type { NavItem, QuickAccessItem } from '../types/site'

export const governmentNavigation: NavItem[] = [
  {
    label: 'Acerca de',
    to: '/gobierno/acerca-de',
    description: 'Informacion institucional del Ayuntamiento.',
  },
  {
    label: 'Organigrama',
    to: '/gobierno/organigrama',
    description: 'Estructura organica municipal.',
  },
  {
    label: 'Cabildo',
    to: '/gobierno/cabildo',
    description: 'Integrantes del Cabildo Municipal.',
  },
  {
    label: 'Directorio',
    to: '/gobierno/directorio',
    description: 'Areas y datos de contacto.',
  },
  {
    label: 'Dependencias',
    to: '/gobierno/dependencias',
    description: 'Areas administrativas y servicios.',
  },
]

export const transparencyNavigation: NavItem[] = [
  {
    label: 'Plataforma Nacional de Transparencia',
    to: 'https://www.plataformadetransparencia.org.mx/',
    description: 'Sitio externo de consulta publica.',
    external: true,
    icono: 'plataforma',
  },
  {
    label: 'Obligaciones comunes',
    to: '/transparencia/obligaciones-comunes',
    description: 'Informacion publica obligatoria comun.',
    icono: 'obligaciones',
  },
  {
    label: 'Obligaciones especificas',
    to: '/transparencia/obligaciones-especificas',
    description: 'Informacion publica municipal especifica.',
    icono: 'especificas',
  },
  {
    label: 'Obras publicas',
    to: '/transparencia/obras-publicas',
    description: 'Proyectos y avances de infraestructura.',
    icono: 'obras',
  },
  {
    label: 'Evaluacion de fondos federales',
    to: '/transparencia/fondos-federales',
    description: 'Evaluaciones, informes y anexos.',
    icono: 'fondos',
  },
  {
    label: 'Informacion financiera',
    to: '/transparencia/informacion-financiera',
    description: 'Presupuestos, estados financieros e informes.',
    icono: 'finanzas',
  },
  {
    label: 'Cuenta publica',
    to: '/transparencia/cuenta-publica',
    description: 'Documentos de cuenta publica por ejercicio.',
    icono: 'cuenta',
  },
  {
    label: 'Licitaciones',
    to: '/transparencia/licitaciones',
    description: 'Convocatorias, bases y fallos.',
    icono: 'licitaciones',
  },
]

export const quickAccess: QuickAccessItem[] = [
  {
    title: 'Directorio',
    description: 'Consulta las areas y datos de contacto.',
    to: '/gobierno/directorio',
    icon: 'tel',
  },
  {
    title: 'Organigrama',
    description: 'Conoce la estructura del Ayuntamiento.',
    to: '/gobierno/organigrama',
    icon: 'org',
  },
  {
    title: 'Transparencia',
    description: 'Accede a documentos y obligaciones publicas.',
    to: '/transparencia',
    icon: 'doc',
  },
  {
    title: 'Atencion ciudadana',
    description: 'Comunicate con Presidencia Municipal.',
    to: '/contacto',
    icon: 'mail',
  },
]

export const transparencyShortcuts: NavItem[] = [
  {
    label: 'Informacion financiera',
    to: '/transparencia/informacion-financiera',
    icono: 'finanzas',
  },
  {
    label: 'Cuenta publica',
    to: '/transparencia/cuenta-publica',
    icono: 'cuenta',
  },
  {
    label: 'Obras publicas',
    to: '/transparencia/obras-publicas',
    icono: 'obras',
  },
  {
    label: 'Licitaciones',
    to: '/transparencia/licitaciones',
    icono: 'licitaciones',
  },
]
