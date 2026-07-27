import { useEffect } from 'react'
import type {
  CategoriaAdministracion,
  DatosCategoriaAdministracion,
} from '../../types/categoriasAdministracion'
import { FormularioCategoriaAdministracion } from './FormularioCategoriaAdministracion'

interface PropiedadesModalCategoriaAdministracion {
  abierto: boolean
  categoria?: CategoriaAdministracion | null
  categoriasDisponibles: CategoriaAdministracion[]
  estaEnviando: boolean
  mensajeError: string
  onCerrar: () => void
  onGuardar: (datos: DatosCategoriaAdministracion) => Promise<void>
}

export function ModalCategoriaAdministracion({
  abierto,
  categoria,
  categoriasDisponibles,
  estaEnviando,
  mensajeError,
  onCerrar,
  onGuardar,
}: PropiedadesModalCategoriaAdministracion) {
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
        aria-labelledby="titulo-modal-categoria"
      >
        <div className="admin-modal-header">
          <h2 id="titulo-modal-categoria">
            {categoria ? 'Editar categoria' : 'Nueva categoria'}
          </h2>
          <button type="button" aria-label="Cerrar modal" onClick={onCerrar}>
            x
          </button>
        </div>
        <FormularioCategoriaAdministracion
          categoria={categoria}
          categoriasDisponibles={categoriasDisponibles}
          estaEnviando={estaEnviando}
          mensajeError={mensajeError}
          onGuardar={onGuardar}
          onCancelar={onCerrar}
        />
      </section>
    </div>
  )
}
