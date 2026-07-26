import { DocumentList } from '../../components/common/DocumentList'
import { InternalHero } from '../../components/common/InternalHero'
import { projectCards } from '../../data/siteContent'
import { usePageTitle } from '../../hooks/usePageTitle'
import type { TransparencySection } from '../../types/site'

interface TransparencyDocumentPageProps {
  section: TransparencySection
}

export function TransparencyDocumentPage({
  section,
}: TransparencyDocumentPageProps) {
  usePageTitle(section.title)
  const isWorksPage = section.route.endsWith('obras-publicas')

  return (
    <main className="internal-main">
      <InternalHero
        eyebrow="Transparencia"
        title={section.title}
        description={section.heroDescription}
        breadcrumbs={[
          { label: 'Transparencia', to: '/transparencia' },
          { label: section.title },
        ]}
      />
      <section className="section">
        <div className="container">
          <div className="section-heading section-heading--split">
            <div>
              <p className="eyebrow">Transparencia</p>
              <h2>{section.title}</h2>
              <p>{section.intro}</p>
            </div>
            <label className="year-filter">
              Ejercicio
              <select defaultValue="2026">
                <option>2026</option>
                <option>2025</option>
                <option>2024</option>
              </select>
            </label>
          </div>

          {isWorksPage ? (
            <div className="project-grid">
              {projectCards.map((project) => (
                <article key={project.title}>
                  <div className="project-visual" aria-hidden="true">
                    <span>{project.status}</span>
                  </div>
                  <div>
                    <span>{project.status}</span>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <button type="button" disabled>
                      Ficha pendiente
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : null}

          <DocumentList documents={section.documents} />
        </div>
      </section>
    </main>
  )
}
