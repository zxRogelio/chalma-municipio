import { InternalHero } from '../../components/common/InternalHero'
import { TransparencyCategoryGrid } from '../../components/transparency/TransparencyCategoryGrid'
import {
  commonObligationCategories,
  commonObligationIntro,
} from '../../data/transparencyData'
import { usePageTitle } from '../../hooks/usePageTitle'

export function CommonObligationsPage() {
  usePageTitle('Obligaciones Comunes (LGTAIP)')

  return (
    <main className="internal-main">
      <InternalHero
        eyebrow="Transparencia"
        title="Obligaciones Comunes (LGTAIP)"
        description="Explorador provisional de fracciones y documentos de transparencia."
        breadcrumbs={[
          { label: 'Transparencia', to: '/transparencia' },
          { label: 'Obligaciones Comunes (LGTAIP)' },
        ]}
      />
      <section className="section">
        <div className="container transparency-explorer">
          <div className="transparency-intro">
            <p className="eyebrow">Articulo 15</p>
            <h2>Fracciones de obligaciones comunes</h2>
            <p>{commonObligationIntro}</p>
          </div>
          <TransparencyCategoryGrid categories={commonObligationCategories} />
        </div>
      </section>
    </main>
  )
}
