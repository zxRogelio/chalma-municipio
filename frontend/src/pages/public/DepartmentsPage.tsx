import { IconoPortal } from '../../components/common/IconoPortal'
import { InternalHero } from '../../components/common/InternalHero'
import { departments } from '../../data/siteContent'
import { usePageTitle } from '../../hooks/usePageTitle'
import type { IconoPortalTipo } from '../../types/site'

const iconosPorDependencia: Record<string, IconoPortalTipo> = {
  home: 'gobierno',
  cash: 'finanzas',
  works: 'obras',
  people: 'area',
  shield: 'informacion',
  services: 'servicios',
}

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
                <IconoPortal
                  tipo={iconosPorDependencia[department.icon] ?? 'area'}
                  className="department-icon"
                />
                <h3>{department.title}</h3>
                <p>{department.description}</p>
                <button type="button" disabled>
                  <IconoPortal tipo="horario" className="button-icon" />
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
