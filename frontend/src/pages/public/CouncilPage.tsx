import { InternalHero } from '../../components/common/InternalHero'
import { councilMembers } from '../../data/siteContent'
import { usePageTitle } from '../../hooks/usePageTitle'

export function CouncilPage() {
  usePageTitle('Cabildo')

  return (
    <main className="internal-main">
      <InternalHero
        eyebrow="Gobierno"
        title="Cabildo"
        description="Integrantes y representacion del Cabildo Municipal."
        breadcrumbs={[{ label: 'Gobierno', to: '/gobierno' }, { label: 'Cabildo' }]}
      />
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Gobierno municipal</p>
            <h2>Integrantes del Cabildo</h2>
            <p>Las tarjetas estan listas para agregar nombres, cargos y fotografias.</p>
          </div>
          <div className="people-grid">
            {councilMembers.map((member, index) => (
              <article className="person-card" key={`${member.role}-${index}`}>
                <div className="person-photo">Foto</div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
