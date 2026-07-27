import type { DocumentItem } from '../../types/site'
import { IconoPortal } from './IconoPortal'

interface DocumentListProps {
  documents: DocumentItem[]
}

export function DocumentList({ documents }: DocumentListProps) {
  return (
    <div className="document-list">
      {documents.map((document) => (
        <article key={document.title}>
          <span className="file-icon" aria-hidden="true">
            <IconoPortal tipo="documento" />
            {document.type}
          </span>
          <div>
            <h3>{document.title}</h3>
            <p>{document.description}</p>
          </div>
          {document.href ? (
            <a href={document.href}>
              <IconoPortal tipo="externo" className="document-list-action-icon" />
              Consultar
            </a>
          ) : (
            <button type="button" disabled>
              <IconoPortal tipo="horario" className="document-list-action-icon" />
              Pendiente
            </button>
          )}
        </article>
      ))}
    </div>
  )
}
