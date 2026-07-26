import { useEffect, useState } from 'react'
import type { TransparencyDocument } from '../../data/transparencyData'

interface DocumentActionsProps {
  documentItem: TransparencyDocument
}

const previewableTypes = new Set(['PDF', 'PNG', 'JPG'])

function getAbsoluteUrl(href: string) {
  return new URL(href, window.location.origin).toString()
}

export function DocumentActions({ documentItem }: DocumentActionsProps) {
  const [message, setMessage] = useState('')
  const canPreview = previewableTypes.has(documentItem.fileType)
  const actionLabel = `${documentItem.title} (${documentItem.fileType})`

  useEffect(() => {
    if (!message) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => setMessage(''), 2200)
    return () => window.clearTimeout(timeoutId)
  }, [message])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getAbsoluteUrl(documentItem.href))
      setMessage('Enlace copiado')
    } catch {
      setMessage('No se pudo copiar')
    }
  }

  return (
    <div className="document-actions">
      <button
        type="button"
        className="document-action"
        aria-label={`Copiar enlace de ${actionLabel}`}
        onClick={copyLink}
      >
        Copiar
      </button>
      {canPreview ? (
        <a
          className="document-action"
          href={documentItem.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visualizar ${actionLabel}`}
        >
          Ver
        </a>
      ) : (
        <button
          type="button"
          className="document-action"
          disabled
          aria-label={`Visualizacion no disponible para ${actionLabel}`}
        >
          Ver
        </button>
      )}
      <a
        className="document-action document-action--download"
        href={documentItem.href}
        download={documentItem.downloadName ?? ''}
        aria-label={`Descargar ${actionLabel}`}
      >
        Descargar
      </a>
      <span className="document-action-feedback" aria-live="polite">
        {message}
      </span>
    </div>
  )
}
