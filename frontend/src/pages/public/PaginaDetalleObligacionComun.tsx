import { Link, useParams } from 'react-router-dom'
import { InternalHero } from '../../components/common/InternalHero'
import { IconoTransparencia } from '../../components/transparencia/IconoTransparencia'
import { TablaDocumentosTransparencia } from '../../components/transparencia/TablaDocumentosTransparencia'
import { obtenerCategoriaObligacionComun } from '../../data/datosTransparencia'
import { usePageTitle } from '../../hooks/usePageTitle'

export function PaginaDetalleObligacionComun() {
  const { slug } = useParams()
  const categoria = obtenerCategoriaObligacionComun(slug)

  usePageTitle(categoria?.titulo ?? 'Categoria no encontrada')

  if (!categoria) {
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
              <Link
                className="button button--primary"
                to="/transparencia/obligaciones-comunes"
              >
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
        title={categoria.titulo}
        description={categoria.descripcion}
        breadcrumbs={[
          { label: 'Transparencia', to: '/transparencia' },
          {
            label: 'Obligaciones Comunes (LGTAIP)',
            to: '/transparencia/obligaciones-comunes',
          },
          { label: categoria.titulo },
        ]}
      />
      <section className="section">
        <div className="container transparency-detail">
          <div className="content-card transparency-detail-card">
            <div className="transparency-detail-heading">
              <IconoTransparencia
                tipo="obligaciones"
                className="transparency-heading-icon"
              />
              <div>
                <p className="eyebrow">Detalle de fraccion</p>
                <h2 title={categoria.titulo}>{categoria.titulo}</h2>
                <p>{categoria.descripcion}</p>
              </div>
            </div>
            {categoria.fundamentoLegal ? (
              <p className="legal-basis">
                <strong>Fundamento legal:</strong> {categoria.fundamentoLegal}
              </p>
            ) : null}
          </div>

          <section
            className="transparency-files"
            aria-labelledby="titulo-archivos-disponibles"
          >
            <div className="section-heading section-heading--split transparency-files-heading">
              <div className="transparency-heading-row">
                <IconoTransparencia
                  tipo="documentos"
                  className="transparency-heading-icon"
                />
                <div>
                  <p className="eyebrow">Documentos</p>
                  <h2 id="titulo-archivos-disponibles">
                    Archivos disponibles
                  </h2>
                  <p>
                    Los archivos mostrados son provisionales y no sustituyen
                    documentos oficiales.
                  </p>
                </div>
              </div>
            </div>
            <TablaDocumentosTransparencia documentos={categoria.documentos} />
          </section>
        </div>
      </section>
    </main>
  )
}
