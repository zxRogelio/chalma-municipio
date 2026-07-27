import { Link } from 'react-router-dom'
import { IconoPortal } from '../../components/common/IconoPortal'
import { InternalHero } from '../../components/common/InternalHero'
import { governmentNavigation } from '../../data/navigation'
import { usePageTitle } from '../../hooks/usePageTitle'

export function GovernmentPage() {
  usePageTitle('Gobierno')

  return (
    <main className="internal-main">
      <InternalHero
        eyebrow="Gobierno"
        title="Gobierno"
        description="Secciones institucionales del Gobierno Municipal de Chalma."
        breadcrumbs={[{ label: 'Gobierno' }]}
      />
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Ayuntamiento</p>
            <h2>Informacion institucional</h2>
            <p>Consulta la estructura y areas municipales disponibles.</p>
          </div>
          <div className="quick-grid quick-grid--wide">
            {governmentNavigation.map((item) => (
              <Link className="quick-card" to={item.to} key={item.to}>
                <IconoPortal
                  tipo={item.iconoPortal ?? 'gobierno'}
                  className="quick-icon"
                />
                <h3>{item.label}</h3>
                <p>{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
