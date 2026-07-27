import { useEffect, useState } from 'react'
import { IconoPortal } from '../common/IconoPortal'
import api from '../../services/api'
import type { DocumentoTransparencia } from '../../types/transparencia'

interface PropiedadesAccionesDocumento {
  documento: DocumentoTransparencia
}

function obtenerBasePublicaApi() {
  const urlConfigurada = import.meta.env.VITE_URL_PUBLICA_API?.trim()

  if (urlConfigurada) {
    return urlConfigurada.replace(/\/$/, '')
  }

  return new URL(
    api.defaults.baseURL ?? window.location.origin,
    window.location.origin,
  ).origin.replace(/\/$/, '')
}

function obtenerUrlDescarga(id: number) {
  return `${obtenerBasePublicaApi()}/api/transparencia/documentos/${id}/archivo?modo=descargar`
}

export function AccionesDocumento({
  documento,
}: PropiedadesAccionesDocumento) {
  const [mensaje, establecerMensaje] = useState('')
  const urlDescarga = obtenerUrlDescarga(documento.id)
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
      await navigator.clipboard.writeText(urlDescarga)
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
        <IconoPortal tipo="copiar" className="document-action-icon" />
        Copiar
      </button>
      <a
        className="document-action document-action--download"
        href={urlDescarga}
        download={documento.nombreOriginal ?? ''}
        aria-label={`Descargar ${etiquetaAccion}`}
      >
        <IconoPortal tipo="descargar" className="document-action-icon" />
        Descargar
      </a>
      <span className="document-action-feedback" aria-live="polite">
        {mensaje}
      </span>
    </div>
  )
}
