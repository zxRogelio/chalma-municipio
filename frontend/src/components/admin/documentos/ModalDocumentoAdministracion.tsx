import { useEffect } from 'react'
import type {
  DatosFormularioDocumentoAdministracion,
  DocumentoAdministracion,
} from '../../../types/documentosAdministracion'
import { FormularioDocumentoAdministracion } from './FormularioDocumentoAdministracion'

interface PropiedadesModalDocumentoAdministracion {
  abierto: boolean
  documento?: DocumentoAdministracion | null
  estaEnviando: boolean
  mensajeError: string
  onCerrar: () => void
  onGuardar: (datos: DatosFormularioDocumentoAdministracion) => Promise<void>
}

export function ModalDocumentoAdministracion({
  abierto,
  documento,
  estaEnviando,
  mensajeError,
  onCerrar,
  onGuardar,
}: PropiedadesModalDocumentoAdministracion) {
  useEffect(() => {
    if (!abierto) {
      return undefined
    }

    const manejarTecla = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') {
        onCerrar()
      }
    }

    window.addEventListener('keydown', manejarTecla)
    return () => window.removeEventListener('keydown', manejarTecla)
  }, [abierto, onCerrar])

  if (!abierto) {
    return null
  }

  return (
    <div className="admin-modal-backdrop">
      <section
        className="admin-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-modal-documento"
      >
        <div className="admin-modal-header">
          <h2 id="titulo-modal-documento">
            {documento ? 'Editar informacion' : 'Subir documento'}
          </h2>
          <button type="button" aria-label="Cerrar modal" onClick={onCerrar}>
            x
          </button>
        </div>
        <FormularioDocumentoAdministracion
          documento={documento}
          estaEnviando={estaEnviando}
          mensajeError={mensajeError}
          onGuardar={onGuardar}
          onCancelar={onCerrar}
        />
      </section>
    </div>
  )
}
