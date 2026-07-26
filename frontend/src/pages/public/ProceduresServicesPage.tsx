import { InternalHero } from '../../components/common/InternalHero'
import { usePageTitle } from '../../hooks/usePageTitle'

export function ProceduresServicesPage() {
  usePageTitle('Tramites y servicios')

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
            <p className="eyebrow">Proximamente</p>
            <h2>Catalogo municipal</h2>
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
            <h2>Estado</h2>
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
