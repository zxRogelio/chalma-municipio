import type { DocumentItem } from '../../types/site'

interface DocumentListProps {
  documents: DocumentItem[]
}

export function DocumentList({ documents }: DocumentListProps) {
  return (
    <div className="document-list">
      {documents.map((document) => (
        <article key={document.title}>
          <span className="file-icon">{document.type}</span>
          <div>
            <h3>{document.title}</h3>
            <p>{document.description}</p>
          </div>
          {document.href ? (
            <a href={document.href}>Consultar</a>
          ) : (
            <button type="button" disabled>
              Pendiente
            </button>
          )}
        </article>
      ))}
    </div>
  )
}
