import type { DocumentoTransparencia } from '../../types/transparencia'
import { AccionesDocumento } from './AccionesDocumento'
import { IconoArchivoDocumento } from './IconoArchivoDocumento'

interface PropiedadesTablaDocumentosTransparencia {
  documentos: DocumentoTransparencia[]
}

function formatearTamano(tamanoBytes: number | null) {
  if (!tamanoBytes || tamanoBytes <= 0) {
    return 'Por definir'
  }

  if (tamanoBytes < 1024) {
    return `${tamanoBytes} B`
  }

  if (tamanoBytes < 1024 * 1024) {
    return `${(tamanoBytes / 1024).toFixed(1)} KB`
  }

  return `${(tamanoBytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatearFecha(fecha: string | null) {
  if (!fecha) {
    return 'Por definir'
  }

  const fechaDocumento = new Date(fecha)

  if (Number.isNaN(fechaDocumento.getTime())) {
    return 'Por definir'
  }

  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(fechaDocumento)
}

export function TablaDocumentosTransparencia({
  documentos,
}: PropiedadesTablaDocumentosTransparencia) {
  if (documentos.length === 0) {
    return (
      <div className="transparency-empty-state">
        <h3>No hay documentos disponibles</h3>
        <p>No hay documentos disponibles en este apartado.</p>
      </div>
    )
  }

  return (
    <div className="transparency-table-wrap">
      <table className="transparency-document-table">
        <caption className="sr-only">Archivos disponibles</caption>
        <thead>
          <tr>
            <th>Archivo</th>
            <th>Anio</th>
            <th>Periodo</th>
            <th>Tipo</th>
            <th>Tamanio</th>
            <th>Publicado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {documentos.map((documento) => (
            <tr key={documento.id}>
              <td>
                <div className="document-title-cell">
                  <IconoArchivoDocumento tipoArchivo={documento.tipoArchivo} />
                  <span title={documento.titulo}>
                    <strong>{documento.titulo}</strong>
                    {documento.descripcion ? (
                      <small>{documento.descripcion}</small>
                    ) : null}
                  </span>
                </div>
              </td>
              <td>{documento.ejercicioFiscal}</td>
              <td>{documento.periodo}</td>
              <td>{documento.tipoArchivo}</td>
              <td>{formatearTamano(documento.tamanoBytes)}</td>
              <td>{formatearFecha(documento.fechaPublicacion)}</td>
              <td>
                <AccionesDocumento documento={documento} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
