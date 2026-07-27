import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { DocumentoAdministracion } from '../../../types/documentosAdministracion'
import { extensionesDocumentosPermitidas } from '../../../types/documentosAdministracion'

interface PropiedadesReemplazarArchivoDocumento {
  documento: DocumentoAdministracion | null
  estaEnviando: boolean
  mensajeError: string
  onCancelar: () => void
  onGuardar: (archivo: File) => Promise<void>
}

export function ReemplazarArchivoDocumento({
  documento,
  estaEnviando,
  mensajeError,
  onCancelar,
  onGuardar,
}: PropiedadesReemplazarArchivoDocumento) {
  const [archivo, establecerArchivo] = useState<File | null>(null)

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

  const enviarFormulario = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()

    if (!archivo) {
      return
    }

    await onGuardar(archivo)
  }

  return (
    <div className="admin-modal-backdrop">
      <section
        className="admin-modal admin-modal--small"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-reemplazo-documento"
      >
        <h2 id="titulo-reemplazo-documento">Reemplazar archivo</h2>
        <p>
          Se conservaran el titulo, periodo, ejercicio y estado del documento.
        </p>
        <p>
          <strong>{documento.titulo}</strong>
        </p>
        <form className="admin-category-form" onSubmit={enviarFormulario}>
          <label htmlFor="documento-archivo-reemplazo">
            Nuevo archivo
            <input
              id="documento-archivo-reemplazo"
              type="file"
              required
              accept={extensionesDocumentosPermitidas}
              onChange={(evento) =>
                establecerArchivo(evento.target.files?.[0] ?? null)
              }
            />
          </label>
          {mensajeError ? (
            <p className="admin-error" role="alert" aria-live="assertive">
              {mensajeError}
            </p>
          ) : (
            <p className="admin-error" aria-live="assertive" />
          )}
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
              type="submit"
              disabled={estaEnviando || !archivo}
            >
              {estaEnviando ? 'Guardando...' : 'Reemplazar'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
