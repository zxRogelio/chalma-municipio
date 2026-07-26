import { InternalHero } from '../../components/common/InternalHero'
import { departments } from '../../data/siteContent'
import { usePageTitle } from '../../hooks/usePageTitle'

export function DepartmentsPage() {
  usePageTitle('Dependencias')

  return (
    <main className="internal-main">
      <InternalHero
        eyebrow="Gobierno"
        title="Dependencias"
        description="Areas administrativas y servicios del Ayuntamiento."
        breadcrumbs={[{ label: 'Gobierno', to: '/gobierno' }, { label: 'Dependencias' }]}
      />
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Areas municipales</p>
            <h2>Dependencias</h2>
            <p>Agrega o elimina tarjetas conforme al organigrama oficial.</p>
          </div>
          <div className="department-grid">
            {departments.map((department) => (
              <article key={department.title}>
                <span
                  className={`department-icon department-icon--${department.icon}`}
                  aria-hidden="true"
                />
                <h3>{department.title}</h3>
                <p>{department.description}</p>
                <button type="button" disabled>
                  Pendiente
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
