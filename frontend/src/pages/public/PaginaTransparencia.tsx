import { useEffect, useState } from 'react'
import { IconoPortal } from '../../components/common/IconoPortal'
import { InternalHero } from '../../components/common/InternalHero'
import { CuadriculaCategoriasTransparencia } from '../../components/transparencia/CuadriculaCategoriasTransparencia'
import { IconoTransparencia } from '../../components/transparencia/IconoTransparencia'
import { transparencyNavigation } from '../../data/navigation'
import { usePageTitle } from '../../hooks/usePageTitle'
import { solicitudFueCancelada } from '../../services/api'
import { obtenerSeccionesTransparencia } from '../../services/servicioTransparencia'
import type { CategoriaTransparencia } from '../../types/transparencia'

const enlacePlataforma = transparencyNavigation.find((elemento) => elemento.external)

export function PaginaTransparencia() {
  const [categorias, establecerCategorias] = useState<CategoriaTransparencia[]>([])
  const [estaCargando, establecerEstaCargando] = useState(true)
  const [mensajeError, establecerMensajeError] = useState('')
  const [intento, establecerIntento] = useState(0)

  usePageTitle('Transparencia')

  useEffect(() => {
    const controlador = new AbortController()

    establecerEstaCargando(true)
    establecerMensajeError('')

    obtenerSeccionesTransparencia({
      signal: controlador.signal,
    })
      .then((datos) => {
        establecerCategorias(datos)
      })
      .catch((error: unknown) => {
        if (solicitudFueCancelada(error)) {
          return
        }

        console.error(error)
        establecerMensajeError(
          'No fue posible cargar las categorias de transparencia.',
        )
      })
      .finally(() => {
        if (!controlador.signal.aborted) {
          establecerEstaCargando(false)
        }
      })

    return () => controlador.abort()
  }, [intento])

  return (
    <main className="internal-main">
      <InternalHero
        eyebrow="Transparencia"
        title="Transparencia"
        description="Acceso a informacion publica, documentos municipales y rendicion de cuentas."
        breadcrumbs={[{ label: 'Transparencia' }]}
      />
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Gobierno abierto</p>
            <h2>Informacion publica municipal</h2>
            <p>
              Las categorias publicadas se muestran automaticamente conforme el
              administrador las active en el panel.
            </p>
          </div>

          {estaCargando ? (
            <div className="transparency-skeleton-grid" aria-label="Cargando categorias">
              {Array.from({ length: 6 }, (_elemento, indice) => (
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
                onClick={() => establecerIntento((valor) => valor + 1)}
              >
                <IconoPortal tipo="reintentar" className="button-icon" />
                Reintentar
              </button>
            </div>
          ) : null}

          {!estaCargando && !mensajeError && categorias.length === 0 ? (
            <div className="transparency-empty-state">
              <h3>No hay categorias publicas disponibles actualmente.</h3>
              <p>
                Cuando el administrador active categorias de transparencia,
                apareceran en este apartado.
              </p>
            </div>
          ) : null}

          {!estaCargando && !mensajeError && categorias.length > 0 ? (
            <CuadriculaCategoriasTransparencia categorias={categorias} />
          ) : null}

          {enlacePlataforma ? (
            <div className="external-feature">
              <IconoTransparencia
                tipo="plataforma"
                className="external-feature-icon"
              />
              <div>
                <p className="eyebrow">Consulta externa</p>
                <h2>{enlacePlataforma.label}</h2>
                <p>{enlacePlataforma.description}</p>
              </div>
              <a
                className="button button--primary"
                href={enlacePlataforma.to}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconoPortal tipo="externo" className="button-icon" />
                Abrir plataforma
              </a>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  )
}
