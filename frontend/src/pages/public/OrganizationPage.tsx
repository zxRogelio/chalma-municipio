import { useEffect, useState } from 'react'
import { IconoPortal } from '../../components/common/IconoPortal'
import { InternalHero } from '../../components/common/InternalHero'
import { usePageTitle } from '../../hooks/usePageTitle'
import { solicitudFueCancelada } from '../../services/api'
import {
  construirUrlArchivoOrganigrama,
  obtenerOrganigramaPublico,
} from '../../services/servicioOrganigrama'
import type { OrganigramaPublico } from '../../types/organigrama'

export function OrganizationPage() {
  const [organigrama, establecerOrganigrama] =
    useState<OrganigramaPublico | null>(null)
  const [estaCargando, establecerEstaCargando] = useState(true)
  const [mensajeError, establecerMensajeError] = useState('')
  const [intento, establecerIntento] = useState(0)

  usePageTitle(organigrama?.titulo ?? 'Organigrama')

  useEffect(() => {
    const controlador = new AbortController()

    obtenerOrganigramaPublico({ signal: controlador.signal })
      .then((datos) => {
        establecerOrganigrama(datos)
        establecerMensajeError('')
      })
      .catch((error: unknown) => {
        if (solicitudFueCancelada(error)) {
          return
        }

        establecerOrganigrama(null)
        establecerMensajeError(
          'No fue posible cargar el organigrama municipal.',
        )
      })
      .finally(() => {
        if (!controlador.signal.aborted) {
          establecerEstaCargando(false)
        }
      })

    return () => controlador.abort()
  }, [intento])

  const urlArchivo = construirUrlArchivoOrganigrama(
    organigrama?.urlArchivo ?? null,
  )
  const organigramaVisible =
    Boolean(organigrama?.mostrarOrganigrama) && Boolean(urlArchivo)
  const tituloOrganigrama =
    organigrama?.titulo?.trim() || 'Organigrama municipal'

  return (
    <main className="internal-main">
      <InternalHero
        eyebrow="Gobierno"
        title="Organigrama"
        description="Estructura organica del Gobierno Municipal."
        breadcrumbs={[{ label: 'Gobierno', to: '/gobierno' }, { label: 'Organigrama' }]}
      />
      <section className="section">
        <div className="container">
          {estaCargando ? (
            <div className="transparency-empty-state" aria-live="polite">
              <h3>Cargando organigrama municipal.</h3>
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

          {!estaCargando && !mensajeError && !organigramaVisible ? (
            <div className="transparency-empty-state">
              <h3>El organigrama municipal no esta disponible temporalmente.</h3>
            </div>
          ) : null}

          {!estaCargando && !mensajeError && organigramaVisible && urlArchivo ? (
            <article className="organigrama-publico">
              <div className="document-feature organigrama-publico__heading">
                <IconoPortal tipo="organigrama" className="portal-feature-icon" />
                <div>
                  <p className="eyebrow">Estructura municipal</p>
                  <h2>{tituloOrganigrama}</h2>
                  {organigrama?.descripcion ? (
                    <p>{organigrama.descripcion}</p>
                  ) : null}
                </div>
                <a
                  className="button button--primary"
                  href={urlArchivo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconoPortal tipo="imagen" className="button-icon" />
                  Ampliar imagen
                </a>
              </div>

              <div className="organigrama-publico__imagen">
                <img
                  src={urlArchivo}
                  alt={`Imagen del ${tituloOrganigrama}`}
                />
              </div>
            </article>
          ) : null}
        </div>
      </section>
    </main>
  )
}
