import { useEffect, useState } from 'react'
import type { DocumentoTransparencia } from '../../data/datosTransparencia'

interface PropiedadesAccionesDocumento {
  documento: DocumentoTransparencia
}

const tiposVisualizables = new Set(['PDF', 'PNG', 'JPG'])

function obtenerUrlAbsoluta(url: string) {
  return new URL(url, window.location.origin).toString()
}

export function AccionesDocumento({
  documento,
}: PropiedadesAccionesDocumento) {
  const [mensaje, establecerMensaje] = useState('')
  const puedeVisualizar = tiposVisualizables.has(documento.tipoArchivo)
  const etiquetaAccion = `${documento.titulo} (${documento.tipoArchivo})`

  useEffect(() => {
    if (!mensaje) {
      return undefined
    }

    const idTemporizador = window.setTimeout(
      () => establecerMensaje(''),
      2200,
    )

    return () => window.clearTimeout(idTemporizador)
  }, [mensaje])

  const copiarEnlace = async () => {
    try {
      await navigator.clipboard.writeText(obtenerUrlAbsoluta(documento.url))
      establecerMensaje('Enlace copiado')
    } catch {
      establecerMensaje('No se pudo copiar')
    }
  }

  return (
    <div className="document-actions">
      <button
        type="button"
        className="document-action"
        aria-label={`Copiar enlace de ${etiquetaAccion}`}
        onClick={copiarEnlace}
      >
        Copiar
      </button>
      {puedeVisualizar ? (
        <a
          className="document-action"
          href={documento.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visualizar ${etiquetaAccion}`}
        >
          Ver
        </a>
      ) : (
        <button
          type="button"
          className="document-action"
          disabled
          aria-label={`Visualizacion no disponible para ${etiquetaAccion}`}
        >
          Ver
        </button>
      )}
      <a
        className="document-action document-action--download"
        href={documento.url}
        download={documento.nombreDescarga ?? ''}
        aria-label={`Descargar ${etiquetaAccion}`}
      >
        Descargar
      </a>
      <span className="document-action-feedback" aria-live="polite">
        {mensaje}
      </span>
    </div>
  )
}
