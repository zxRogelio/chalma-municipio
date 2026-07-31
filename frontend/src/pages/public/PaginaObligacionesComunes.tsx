import { useEffect, useState } from 'react'
import { IconoPortal } from '../../components/common/IconoPortal'
import { InternalHero } from '../../components/common/InternalHero'
import { CuadriculaCategoriasTransparencia } from '../../components/transparencia/CuadriculaCategoriasTransparencia'
import { usePageTitle } from '../../hooks/usePageTitle'
import { solicitudFueCancelada } from '../../services/api'
import { obtenerSeccionPorSlug } from '../../services/servicioTransparencia'
import type { CategoriaTransparencia } from '../../types/transparencia'

export function PaginaObligacionesComunes() {
  const [seccion, establecerSeccion] =
    useState<CategoriaTransparencia | null>(null)
  const [estaCargando, establecerEstaCargando] = useState(true)
  const [mensajeError, establecerMensajeError] = useState('')
  const [intento, establecerIntento] = useState(0)

  usePageTitle('Obligaciones Comunes (LGTAIP)')

  useEffect(() => {
    const controlador = new AbortController()

    obtenerSeccionPorSlug('obligaciones-comunes', {
      signal: controlador.signal,
    })
      .then((datos) => {
        establecerSeccion(datos)
        establecerMensajeError('')
      })
      .catch((error: unknown) => {
        if (solicitudFueCancelada(error)) {
          return
        }

        console.error(error)
        establecerMensajeError(
          'No fue posible cargar la informacion de transparencia.',
        )
      })
      .finally(() => {
        if (!controlador.signal.aborted) {
          establecerEstaCargando(false)
        }
      })

    return () => controlador.abort()
  }, [intento])

  const categorias = seccion?.categoriasHijas ?? []

  return (
    <main className="internal-main">
      <InternalHero
        eyebrow="Transparencia"
        title={seccion?.titulo ?? 'Obligaciones Comunes (LGTAIP)'}
        description={
          seccion?.descripcion ??
          'Consulta las fracciones de obligaciones comunes de transparencia.'
        }
        breadcrumbs={[
          { label: 'Transparencia', to: '/transparencia' },
          { label: 'Obligaciones Comunes (LGTAIP)' },
        ]}
      />
      <section className="section">
        <div className="container transparency-explorer">
          <div className="transparency-intro">
            <p className="eyebrow">Articulo 15</p>
            <h2>Fracciones de obligaciones comunes</h2>
            <p>
              {seccion?.descripcion ??
                'Consulta los apartados publicados por el portal municipal.'}
            </p>
          </div>
          {estaCargando ? (
            <div className="transparency-skeleton-grid" aria-label="Cargando categorias">
              {Array.from({ length: 8 }, (_elemento, indice) => (
                <span className="transparency-skeleton-card" key={indice} />
              ))}
            </div>
          ) : null}
          {!estaCargando && mensajeError ? (
            <div className="transparency-empty-state transparency-empty-state--error">
              <h3>{mensajeError}</h3>
              <button
                className="button button--primary"
                type="button"
                onClick={() => {
                  establecerEstaCargando(true)
                  establecerMensajeError('')
                  establecerIntento((valor) => valor + 1)
                }}
              >
                <IconoPortal tipo="reintentar" className="button-icon" />
                Reintentar
              </button>
            </div>
          ) : null}
          {!estaCargando && !mensajeError && categorias.length === 0 ? (
            <div className="transparency-empty-state">
              <h3>No hay apartados de transparencia disponibles actualmente.</h3>
            </div>
          ) : null}
          {!estaCargando && !mensajeError && categorias.length > 0 ? (
            <CuadriculaCategoriasTransparencia categorias={categorias} />
          ) : null}
        </div>
      </section>
    </main>
  )
}
