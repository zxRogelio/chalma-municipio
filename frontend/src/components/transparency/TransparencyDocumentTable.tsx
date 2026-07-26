import type { TransparencyDocument } from '../../data/transparencyData'
import { DocumentActions } from './DocumentActions'
import { DocumentFileIcon } from './DocumentFileIcon'

interface TransparencyDocumentTableProps {
  documents: TransparencyDocument[]
}

export function TransparencyDocumentTable({
  documents,
}: TransparencyDocumentTableProps) {
  if (documents.length === 0) {
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
          {documents.map((documentItem) => (
            <tr key={documentItem.id}>
              <td>
                <div className="document-title-cell">
                  <DocumentFileIcon fileType={documentItem.fileType} />
                  <span title={documentItem.title}>{documentItem.title}</span>
                </div>
              </td>
              <td>{documentItem.period.year}</td>
              <td>{documentItem.period.label}</td>
              <td>{documentItem.fileType}</td>
              <td>{documentItem.size ?? 'Por definir'}</td>
              <td>
                <DocumentActions documentItem={documentItem} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
