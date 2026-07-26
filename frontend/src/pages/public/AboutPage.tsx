import { InternalHero } from '../../components/common/InternalHero'
import { usePageTitle } from '../../hooks/usePageTitle'

export function AboutPage() {
  usePageTitle('Acerca de')

  return (
    <main className="internal-main">
      <InternalHero
        eyebrow="Gobierno"
        title="Acerca de"
        description="Informacion institucional del H. Ayuntamiento de Chalma."
        breadcrumbs={[{ label: 'Gobierno', to: '/gobierno' }, { label: 'Acerca de' }]}
      />
      <section className="section">
        <div className="container content-grid">
          <article className="content-card content-card--large">
            <p className="eyebrow">Municipio</p>
            <h2>Acerca del Ayuntamiento</h2>
            <p>
              En este espacio se colocara la presentacion institucional,
              historia, mision, vision y objetivos del Gobierno Municipal de
              Chalma.
            </p>
            <p>
              El texto actual es provisional y puede reemplazarse directamente
              cuando se comparta el contenido oficial.
            </p>
          </article>
          <aside className="highlight-card">
            <h2>Datos rapidos</h2>
            <dl>
              <div>
                <dt>Municipio</dt>
                <dd>Chalma</dd>
              </div>
              <div>
                <dt>Estado</dt>
                <dd>Veracruz</dd>
              </div>
              <div>
                <dt>Administracion</dt>
                <dd>Por definir</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
      <section className="section section--light">
        <div className="container value-grid">
          <article>
            <span>01</span>
            <h3>Mision</h3>
            <p>Texto oficial pendiente.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Vision</h3>
            <p>Texto oficial pendiente.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Valores</h3>
            <p>Texto oficial pendiente.</p>
          </article>
        </div>
      </section>
    </main>
  )
}
