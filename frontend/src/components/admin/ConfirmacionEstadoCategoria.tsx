import { useEffect } from 'react'
import type { CategoriaAdministracion } from '../../types/categoriasAdministracion'

interface PropiedadesConfirmacionEstadoCategoria {
  categoria: CategoriaAdministracion | null
  estaEnviando: boolean
  onCancelar: () => void
  onConfirmar: () => Promise<void>
}

export function ConfirmacionEstadoCategoria({
  categoria,
  estaEnviando,
  onCancelar,
  onConfirmar,
}: PropiedadesConfirmacionEstadoCategoria) {
  useEffect(() => {
    if (!categoria) {
      return undefined
    }

    const manejarTecla = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') {
        onCancelar()
      }
    }

    window.addEventListener('keydown', manejarTecla)
    return () => window.removeEventListener('keydown', manejarTecla)
  }, [categoria, onCancelar])

  if (!categoria) {
    return null
  }

  const seraActivada = !categoria.estaActivo

  return (
    <div className="admin-modal-backdrop">
      <section
        className="admin-modal admin-modal--small"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-confirmacion-estado"
      >
        <h2 id="titulo-confirmacion-estado">
          {seraActivada
            ? 'Deseas activar esta categoria?'
            : 'Deseas desactivar esta categoria?'}
        </h2>
        <p>
          {seraActivada
            ? 'La categoria volvera a mostrarse segun las reglas del portal publico.'
            : 'La categoria dejara de mostrarse en el portal publico. Los datos y documentos no se eliminaran.'}
        </p>
        <p>
          <strong>{categoria.titulo}</strong>
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
