import { Link, useParams } from 'react-router-dom'
import { InternalHero } from '../../components/common/InternalHero'
import { TransparencyDocumentTable } from '../../components/transparency/TransparencyDocumentTable'
import { getCommonObligationCategory } from '../../data/transparencyData'
import { usePageTitle } from '../../hooks/usePageTitle'

export function CommonObligationDetailPage() {
  const { slug } = useParams()
  const category = getCommonObligationCategory(slug)

  usePageTitle(category?.title ?? 'Categoria no encontrada')

  if (!category) {
    return (
      <main className="internal-main">
        <InternalHero
          eyebrow="Transparencia"
          title="Categoria no encontrada"
          description="La fraccion solicitada no existe en el explorador de obligaciones comunes."
          breadcrumbs={[
            { label: 'Transparencia', to: '/transparencia' },
            {
              label: 'Obligaciones Comunes (LGTAIP)',
              to: '/transparencia/obligaciones-comunes',
            },
            { label: 'Categoria no encontrada' },
          ]}
        />
        <section className="section">
          <div className="container">
            <div className="transparency-empty-state">
              <h2>No se encontro la categoria</h2>
              <p>
                Revisa la ruta o vuelve al explorador de obligaciones comunes
                para seleccionar una fraccion disponible.
              </p>
              <Link className="button button--primary" to="/transparencia/obligaciones-comunes">
                Volver al explorador
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
        eyebrow="Transparencia"
        title={category.title}
        description={category.description}
        breadcrumbs={[
          { label: 'Transparencia', to: '/transparencia' },
          {
            label: 'Obligaciones Comunes (LGTAIP)',
            to: '/transparencia/obligaciones-comunes',
          },
          { label: category.title },
        ]}
      />
      <section className="section">
        <div className="container transparency-detail">
          <div className="content-card transparency-detail-card">
            <p className="eyebrow">Detalle de fraccion</p>
            <h2 title={category.title}>{category.title}</h2>
            <p>{category.description}</p>
            {category.legalBasis ? (
              <p className="legal-basis">
                <strong>Fundamento legal:</strong> {category.legalBasis}
              </p>
            ) : null}
          </div>

          <section className="transparency-files" aria-labelledby="available-files-title">
            <div className="section-heading section-heading--split transparency-files-heading">
              <div>
                <p className="eyebrow">Documentos</p>
                <h2 id="available-files-title">Archivos disponibles</h2>
                <p>
                  Los archivos mostrados son provisionales y no sustituyen
                  documentos oficiales.
                </p>
              </div>
            </div>
            <TransparencyDocumentTable documents={category.documents} />
          </section>
        </div>
      </section>
    </main>
  )
}
