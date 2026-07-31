import { Link } from 'react-router-dom'
import { IconoPortal } from '../../components/common/IconoPortal'
import { InternalHero } from '../../components/common/InternalHero'
import { configuracionPortal } from '../../config/configuracionPortal'
import { usePageTitle } from '../../hooks/usePageTitle'

export function ProceduresServicesPage() {
  usePageTitle('Tramites y servicios')

  if (!configuracionPortal.mostrarTramitesServicios) {
    return (
      <main className="internal-main">
        <InternalHero
          eyebrow="Atencion ciudadana"
          title="Sección no disponible"
          description="La sección de Trámites y servicios se encuentra temporalmente deshabilitada."
          breadcrumbs={[{ label: 'Trámites y servicios' }]}
        />
        <section className="section">
          <div className="container">
            <div className="transparency-empty-state">
              <h2>Sección no disponible</h2>
              <p>
                La sección de Trámites y servicios se encuentra temporalmente
                deshabilitada.
              </p>
              <Link className="button button--primary" to="/">
                <IconoPortal tipo="volver" className="button-icon" />
                Volver al inicio
              </Link>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="internal-main">
      <InternalHero
        eyebrow="Atencion ciudadana"
        title="Tramites y servicios"
        description="Pagina provisional para el catalogo de tramites y servicios municipales."
        breadcrumbs={[{ label: 'Tramites y servicios' }]}
      />
      <section className="section">
        <div className="container content-grid">
          <article className="content-card content-card--large">
            <div className="heading-with-icon">
              <IconoPortal tipo="tramites" className="portal-heading-icon" />
              <div>
                <p className="eyebrow">Proximamente</p>
                <h2>Catalogo municipal</h2>
              </div>
            </div>
            <p>
              En una fase posterior se agregaran los tramites, servicios,
              requisitos, horarios y formatos oficiales del municipio.
            </p>
            <p>
              El contenido de esta pagina es provisional y no debe utilizarse
              como informacion oficial.
            </p>
          </article>
          <aside className="highlight-card">
            <div className="heading-with-icon heading-with-icon--dark">
              <IconoPortal tipo="calendario" className="portal-heading-icon" />
              <h2>Estado</h2>
            </div>
            <dl>
              <div>
                <dt>Publicacion</dt>
                <dd>Pendiente</dd>
              </div>
              <div>
                <dt>Fuente</dt>
                <dd>Por validar</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
    </main>
  )
}
