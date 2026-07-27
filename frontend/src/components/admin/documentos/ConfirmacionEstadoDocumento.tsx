import { useEffect } from 'react'
import type { DocumentoAdministracion } from '../../../types/documentosAdministracion'

interface PropiedadesConfirmacionEstadoDocumento {
  documento: DocumentoAdministracion | null
  estaEnviando: boolean
  onCancelar: () => void
  onConfirmar: () => Promise<void>
}

export function ConfirmacionEstadoDocumento({
  documento,
  estaEnviando,
  onCancelar,
  onConfirmar,
}: PropiedadesConfirmacionEstadoDocumento) {
  useEffect(() => {
    if (!documento) {
      return undefined
    }

    const manejarTecla = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') {
        onCancelar()
      }
    }

    window.addEventListener('keydown', manejarTecla)
    return () => window.removeEventListener('keydown', manejarTecla)
  }, [documento, onCancelar])

  if (!documento) {
    return null
  }

  const seraActivado = !documento.estaActivo

  return (
    <div className="admin-modal-backdrop">
      <section
        className="admin-modal admin-modal--small"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-confirmacion-documento"
      >
        <h2 id="titulo-confirmacion-documento">
          {seraActivado
            ? 'Deseas activar este documento?'
            : 'Deseas desactivar este documento?'}
        </h2>
        <p>
          {seraActivado
            ? 'El documento volvera a estar disponible en el portal publico.'
            : 'El documento dejara de aparecer en el portal publico, pero seguira visible para el administrador.'}
        </p>
        <p>
          <strong>{documento.titulo}</strong>
        </p>
        <div className="admin-modal-actions">
          <button
            className="button button--secondary"
            type="button"
            onClick={onCancelar}
          >
            Cancelar
          </button>
          <button
            className="button button--primary"
            type="button"
            disabled={estaEnviando}
            onClick={() => void onConfirmar()}
          >
            {estaEnviando ? 'Guardando...' : 'Confirmar'}
          </button>
        </div>
      </section>
    </div>
  )
}
