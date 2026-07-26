import { InternalHero } from '../../components/common/InternalHero'
import { usePageTitle } from '../../hooks/usePageTitle'

export function ContactPage() {
  usePageTitle('Contacto')

  return (
    <main className="internal-main">
      <InternalHero
        eyebrow="Atencion ciudadana"
        title="Contacto"
        description="Canales provisionales de comunicacion con el Ayuntamiento."
        breadcrumbs={[{ label: 'Contacto' }]}
      />
      <section className="section contact-section">
        <div className="container contact-grid">
          <div>
            <p className="eyebrow">Datos provisionales</p>
            <h2>Informacion por sustituir</h2>
            <p>
              Telefono, correo y direccion deben reemplazarse con informacion
              oficial antes de publicar el portal en produccion.
            </p>
          </div>
          <div className="contact-list">
            <a href="tel:0000000000">
              <span className="contact-icon contact-icon--phone" aria-hidden="true" />
              <strong>Telefono provisional</strong>
              <small>000 000 00 00</small>
            </a>
            <a href="mailto:contacto@chalma.gob.mx">
              <span className="contact-icon contact-icon--mail" aria-hidden="true" />
              <strong>Correo provisional</strong>
              <small>contacto@chalma.gob.mx</small>
            </a>
            <div>
              <span className="contact-icon contact-icon--place" aria-hidden="true" />
              <strong>Direccion provisional</strong>
              <small>Palacio Municipal de Chalma, Veracruz</small>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
