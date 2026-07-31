import type { SVGProps } from 'react'
import type { IconoPortalTipo } from '../../types/site'

interface IconoPortalProps extends SVGProps<SVGSVGElement> {
  tipo: IconoPortalTipo
}

const trazosPorTipo: Record<IconoPortalTipo, string[]> = {
  inicio: ['M4 11.5 12 5l8 6.5', 'M6.5 10.5V20h11v-9.5', 'M10 20v-5h4v5'],
  gobierno: ['M4 20h16', 'M6 20V9l6-4 6 4v11', 'M9 20v-7h6v7'],
  organigrama: ['M12 5h.1', 'M12 7v4', 'M6 15h12', 'M6 15v4', 'M18 15v4', 'M12 15v4', 'M4.5 19h3', 'M10.5 19h3', 'M16.5 19h3'],
  directorio: ['M6 4h12v16H6z', 'M9 8h6', 'M9 12h6', 'M9 16h3'],
  persona: ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M5 21a7 7 0 0 1 14 0'],
  cargo: ['M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2', 'M4 8h16v11H4z', 'M9 12h6'],
  transparencia: ['M12 4 20 8v4c0 4.2-2.9 7.1-8 8-5.1-.9-8-3.8-8-8V8z', 'M9 12l2 2 4-5'],
  obligaciones: ['M7 4h10l2 3v13H5V7z', 'M8 11h8', 'M8 15h8'],
  documento: ['M7 3h7l4 4v14H7z', 'M14 3v5h5', 'M9 13h6', 'M9 17h5'],
  carpeta: ['M4 7h6l2 2h8v10H4z', 'M4 10h16'],
  obras: ['M4 20h16', 'M7 17l2-8h6l2 8', 'M8 13h8', 'M10 5h4'],
  fondos: ['M4 19V5', 'M4 19h16', 'm7 15 3-4 3 2 5-7'],
  finanzas: ['M6 4h12v16H6z', 'M9 8h6', 'M9 12h6', 'M9 16h3'],
  cuentaPublica: ['M5 5.5A2.5 2.5 0 0 1 7.5 3H19v16H7.5A2.5 2.5 0 0 0 5 21z', 'M5 5.5V21', 'M9 7h6', 'M9 11h6'],
  licitaciones: ['m13 5 6 6', 'm11 7 6 6', 'M5 20h7', 'm6 17 5-5', 'm8 6 3-3 8 8-3 3z'],
  tramites: ['M7 4h10v16H7z', 'M10 8h4', 'M10 12h4', 'M10 16h2'],
  servicios: ['M12 3v4', 'M12 17v4', 'M4.2 7.5l3.4 2', 'm16.2 7-3.4-2', 'M4.2 16.5l3.4-2', 'm16.2-7-3.4 2', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],
  contacto: ['M4.5 7.5h15v10h-15z', 'm5.5 2.5 4.5 3.5L19 10'],
  telefono: ['M7.5 4.5h3l1.2 4-2 1.5a12.5 12.5 0 0 0 4.3 4.3l1.5-2 4 1.2v3a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 5.5 6.7a2 2 0 0 1 2-2.2z'],
  correo: ['M4.5 7.5h15v10h-15z', 'm5.5 8.5 6.5 5 6.5-5'],
  ubicacion: ['M12 20s6-5.1 6-10a6 6 0 1 0-12 0c0 4.9 6 10 6 10z', 'M12 12.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4z'],
  horario: ['M12 21a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17z', 'M12 8v4.5l3 1.8'],
  buscar: ['M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z', 'm16 16 4 4'],
  accesibilidad: ['M12 5.5a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4z', 'M5 8h14', 'M12 8v12', 'M8 20l4-8 4 8'],
  descargar: ['M12 4v10', 'm8 11 4 4 4-4', 'M5 20h14'],
  subir: ['M12 20V10', 'm8 13 4-4 4 4', 'M5 20h14'],
  imagen: ['M5 5h14v14H5z', 'm8 14 3.5-4 2.5 3 2-2.5 3 4.5', 'M9 9.5h.1'],
  copiar: ['M8 8h10v12H8z', 'M6 16H5V4h10v1'],
  calendario: ['M6 5h12v15H6z', 'M8 3v4', 'M16 3v4', 'M6 10h12'],
  informacion: ['M12 11v6', 'M12 7h.1', 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z'],
  flecha: ['M5 12h14', 'M13 6l6 6-6 6'],
  menu: ['M4 7h16', 'M4 12h16', 'M4 17h16'],
  cerrar: ['M6 6l12 12', 'M18 6 6 18'],
  facebook: ['M14 8.5h2V5h-2.6A4.4 4.4 0 0 0 9 9.4V12H7v3.5h2V21h3.8v-5.5h2.6L16 12h-3.2V9.7c0-.7.5-1.2 1.2-1.2z'],
  instagram: ['M5 8.5A3.5 3.5 0 0 1 8.5 5h7A3.5 3.5 0 0 1 19 8.5v7a3.5 3.5 0 0 1-3.5 3.5h-7A3.5 3.5 0 0 1 5 15.5z', 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z', 'M16.6 7.4h.1'],
  x: ['m5 5 14 14', 'M19 5 5 19'],
  youtube: ['M9.2 8.2v7.6l6.4-3.8z', 'M4.5 8.1A3 3 0 0 1 7.4 5.7c3.1-.2 6.1-.2 9.2 0a3 3 0 0 1 2.9 2.4 22 22 0 0 1 0 7.8 3 3 0 0 1-2.9 2.4c-3.1.2-6.1.2-9.2 0a3 3 0 0 1-2.9-2.4 22 22 0 0 1 0-7.8z'],
  area: ['M4 20h16', 'M7 20V8h10v12', 'M10 11h1', 'M13 11h1', 'M10 15h1', 'M13 15h1'],
  volver: ['M19 12H5', 'M11 6l-6 6 6 6'],
  externo: ['M8 8h8v8', 'M16 8 7 17', 'M5 5h6', 'M5 5v14h14v-6'],
  reintentar: ['M6 8a7 7 0 0 1 11.5-2.5L20 8', 'M20 4v4h-4', 'M18 16a7 7 0 0 1-11.5 2.5L4 16', 'M4 20v-4h4'],
}

export function IconoPortal({ tipo, className = '', ...props }: IconoPortalProps) {
  const clases = ['icono-portal', className].filter(Boolean).join(' ')

  return (
    <svg
      className={clases}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {trazosPorTipo[tipo].map((trazo) => (
        <path d={trazo} key={trazo} />
      ))}
    </svg>
  )
}
