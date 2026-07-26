import type { TipoArchivoDocumento } from '../../data/datosTransparencia'

interface PropiedadesIconoArchivoDocumento {
  tipoArchivo: TipoArchivoDocumento
}

export function IconoArchivoDocumento({
  tipoArchivo,
}: PropiedadesIconoArchivoDocumento) {
  return (
    <span
      className={`document-file-icon document-file-icon--${tipoArchivo.toLowerCase()}`}
      aria-hidden="true"
      title={tipoArchivo}
    >
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M14 3v5h5" />
      </svg>
      <span>{tipoArchivo}</span>
    </span>
  )
}
