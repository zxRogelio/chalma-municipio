export type NavGroupKey = 'government' | 'transparency'

export type IconoPortalTipo =
  | 'inicio'
  | 'gobierno'
  | 'organigrama'
  | 'directorio'
  | 'transparencia'
  | 'obligaciones'
  | 'documento'
  | 'carpeta'
  | 'obras'
  | 'fondos'
  | 'finanzas'
  | 'cuentaPublica'
  | 'licitaciones'
  | 'tramites'
  | 'servicios'
  | 'contacto'
  | 'telefono'
  | 'correo'
  | 'ubicacion'
  | 'horario'
  | 'buscar'
  | 'accesibilidad'
  | 'descargar'
  | 'copiar'
  | 'calendario'
  | 'informacion'
  | 'flecha'
  | 'menu'
  | 'cerrar'
  | 'facebook'
  | 'instagram'
  | 'x'
  | 'youtube'
  | 'area'
  | 'volver'
  | 'externo'
  | 'reintentar'

export type IconoTransparenciaTipo =
  | 'plataforma'
  | 'obligaciones'
  | 'especificas'
  | 'obras'
  | 'fondos'
  | 'finanzas'
  | 'cuenta'
  | 'licitaciones'
  | 'documentos'

export interface NavItem {
  label: string
  to: string
  description?: string
  external?: boolean
  icono?: IconoTransparenciaTipo
  iconoPortal?: IconoPortalTipo
}

export interface QuickAccessItem {
  title: string
  description: string
  to: string
  icon: IconoPortalTipo
}

export interface SearchPage {
  title: string
  description: string
  path: string
  keywords: string[]
}

export interface BreadcrumbItem {
  label: string
  to?: string
}

export interface DocumentItem {
  title: string
  description: string
  type: 'PDF'
  href?: string
}

export interface TransparencySection {
  title: string
  route: string
  heroDescription: string
  intro: string
  documents: DocumentItem[]
}

export interface DirectoryEntry {
  area: string
  lead: string
  phone: string
  email: string
}

export interface PersonCard {
  name: string
  role: string
}

export interface DepartmentCard {
  title: string
  description: string
  icon: string
}

export interface ProjectCard {
  status: string
  title: string
  description: string
}
