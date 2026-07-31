import { useEffect, useState } from 'react'
import { IconoPortal } from '../../components/common/IconoPortal'
import { InternalHero } from '../../components/common/InternalHero'
import { usePageTitle } from '../../hooks/usePageTitle'
import {
  solicitudFueCancelada,
} from '../../services/api'
import { obtenerDirectorioPublico } from '../../services/servicioDirectorio'
import type { RegistroDirectorioPublico } from '../../types/directorio'

function construirEnlaceTelefono(telefono: string) {
  return `tel:${telefono.replace(/[^\d+]/g, '')}`
}

export function DirectoryPage() {
  const [registros, establecerRegistros] = useState<
    RegistroDirectorioPublico[]
  >([])
  const [estaCargando, establecerEstaCargando] = useState(true)
  const [mensajeError, establecerMensajeError] = useState('')
  const [intento, establecerIntento] = useState(0)

  usePageTitle('Directorio')

  useEffect(() => {
    const controlador = new AbortController()

    obtenerDirectorioPublico({ signal: controlador.signal })
      .then((datos) => {
        establecerRegistros(datos)
        establecerMensajeError('')
      })
      .catch((error: unknown) => {
        if (solicitudFueCancelada(error)) {
          return
        }

        establecerRegistros([])
        establecerMensajeError(
          'No fue posible cargar el directorio municipal.',
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
        eyebrow="Gobierno"
        title="Directorio"
        description="Datos de contacto de las areas y servidores publicos municipales."
        breadcrumbs={[{ label: 'Gobierno', to: '/gobierno' }, { label: 'Directorio' }]}
      />
      <section className="section">
        <div className="container">
          <div className="section-heading section-heading--split">
            <div className="heading-with-icon">
              <IconoPortal tipo="directorio" className="portal-heading-icon" />
              <div>
                <p className="eyebrow">Contacto institucional</p>
                <h2>Directorio municipal</h2>
              </div>
            </div>
          </div>

          {estaCargando ? (
            <div className="transparency-empty-state" aria-live="polite">
              <h3>Cargando directorio municipal.</h3>
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

          {!estaCargando && !mensajeError && registros.length === 0 ? (
            <div className="transparency-empty-state">
              <h3>El directorio municipal no esta disponible temporalmente.</h3>
            </div>
          ) : null}

          {!estaCargando && !mensajeError && registros.length > 0 ? (
            <div className="directorio-publico-grid">
              {registros.map((registro) => (
                <article className="directorio-publico-card" key={registro.id}>
                  <div className="directorio-publico-card__heading">
                    <span aria-hidden="true">
                      <IconoPortal tipo="area" />
                    </span>
                    <div>
                      <p className="eyebrow">Area</p>
                      <h3>{registro.area}</h3>
                    </div>
                  </div>

                  <dl className="directorio-publico-card__datos">
                    {registro.titular ? (
                      <div>
                        <dt>
                          <IconoPortal tipo="persona" />
                          Titular
                        </dt>
                        <dd>{registro.titular}</dd>
                      </div>
                    ) : null}

                    {registro.cargo ? (
                      <div>
                        <dt>
                          <IconoPortal tipo="cargo" />
                          Cargo
                        </dt>
                        <dd>{registro.cargo}</dd>
                      </div>
                    ) : null}

                    {registro.telefono ? (
                      <div>
                        <dt>
                          <IconoPortal tipo="telefono" />
                          Telefono
                        </dt>
                        <dd>
                          <a href={construirEnlaceTelefono(registro.telefono)}>
                            {registro.telefono}
                          </a>
                        </dd>
                      </div>
                    ) : null}

                    {registro.correo ? (
                      <div>
                        <dt>
                          <IconoPortal tipo="correo" />
                          Correo electronico
                        </dt>
                        <dd>
                          <a href={`mailto:${registro.correo}`}>
                            {registro.correo}
                          </a>
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  )
}
