import type { DocumentoTransparencia } from '../../data/datosTransparencia'
import { AccionesDocumento } from './AccionesDocumento'
import { IconoArchivoDocumento } from './IconoArchivoDocumento'

interface PropiedadesTablaDocumentosTransparencia {
  documentos: DocumentoTransparencia[]
}

export function TablaDocumentosTransparencia({
  documentos,
}: PropiedadesTablaDocumentosTransparencia) {
  if (documentos.length === 0) {
    return (
      <div className="transparency-empty-state">
        <h3>No hay archivos disponibles</h3>
        <p>
          Esta fraccion todavia no tiene documentos provisionales cargados. En
          una fase posterior se conectara con la API del portal.
        </p>
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
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {documentos.map((documento) => (
            <tr key={documento.id}>
              <td>
                <div className="document-title-cell">
                  <IconoArchivoDocumento tipoArchivo={documento.tipoArchivo} />
                  <span title={documento.titulo}>{documento.titulo}</span>
                </div>
              </td>
              <td>{documento.periodo.anio}</td>
              <td>{documento.periodo.etiqueta}</td>
              <td>{documento.tipoArchivo}</td>
              <td>{documento.tamano ?? 'Por definir'}</td>
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
