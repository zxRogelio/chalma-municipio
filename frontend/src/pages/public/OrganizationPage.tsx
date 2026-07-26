import { InternalHero } from '../../components/common/InternalHero'
import { usePageTitle } from '../../hooks/usePageTitle'

export function OrganizationPage() {
  usePageTitle('Organigrama')

  return (
    <main className="internal-main">
      <InternalHero
        eyebrow="Gobierno"
        title="Organigrama"
        description="Estructura organica del Gobierno Municipal."
        breadcrumbs={[{ label: 'Gobierno', to: '/gobierno' }, { label: 'Organigrama' }]}
      />
      <section className="section">
        <div className="container">
          <div className="document-feature">
            <div>
              <p className="eyebrow">Estructura municipal</p>
              <h2>Organigrama oficial</h2>
              <p>
                El documento oficial se agregara cuando este disponible desde el
                panel administrativo.
              </p>
            </div>
            <button className="button button--primary" type="button" disabled>
              Documento pendiente
            </button>
          </div>
          <div className="org-placeholder">
            <div>Presidencia Municipal</div>
            <span aria-hidden="true" />
            <div className="org-row">
              <div>Secretaria</div>
              <div>Tesoreria</div>
              <div>Contraloria</div>
            </div>
            <p>Esquema provisional.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
