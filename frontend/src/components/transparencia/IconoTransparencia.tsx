import type { IconoTransparenciaTipo } from '../../types/site'

interface PropiedadesIconoTransparencia {
  tipo?: IconoTransparenciaTipo
  className?: string
}

const trazosPorTipo: Record<IconoTransparenciaTipo, string[]> = {
  plataforma: [
    'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z',
    'M3.8 9h16.4M3.8 15h16.4',
    'M12 3c2.2 2.4 3.3 5.4 3.3 9s-1.1 6.6-3.3 9c-2.2-2.4-3.3-5.4-3.3-9S9.8 5.4 12 3z',
  ],
  obligaciones: [
    'M8 4h8l1.5 2H20v15H4V6h2.5L8 4z',
    'M8 10h8M8 14h8M8 18h5',
  ],
  especificas: [
    'M5 4h14v16H5z',
    'm8 10 2 2 4-5M8 16h8',
  ],
  obras: [
    'M4 20h16',
    'M7 17l2-8h6l2 8',
    'M8 13h8M10 5h4',
  ],
  fondos: [
    'M4 19V5',
    'M4 19h16',
    'm7 15 3-4 3 2 5-7',
  ],
  finanzas: [
    'M6 4h12v16H6z',
    'M9 8h6M9 12h6M9 16h3',
    'M16 15c0 1.1-.9 2-2 2h-1.5',
  ],
  cuenta: [
    'M5 5.5A2.5 2.5 0 0 1 7.5 3H19v16H7.5A2.5 2.5 0 0 0 5 21z',
    'M5 5.5V21M9 7h6M9 11h6',
  ],
  licitaciones: [
    'm13 5 6 6',
    'm11 7 6 6',
    'M5 20h7',
    'm6 17 5-5',
    'm8 6 3-3 8 8-3 3z',
  ],
  documentos: [
    'M7 3h7l4 4v14H7z',
    'M14 3v5h5',
    'M9 13h6M9 17h6',
  ],
}

export function IconoTransparencia({
  tipo = 'documentos',
  className = '',
}: PropiedadesIconoTransparencia) {
  const clases = ['transparency-icon', className].filter(Boolean).join(' ')

  return (
    <span className={clases} aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        {trazosPorTipo[tipo].map((trazo) => (
          <path d={trazo} key={trazo} />
        ))}
      </svg>
    </span>
  )
}
