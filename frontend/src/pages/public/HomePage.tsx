import { Link } from 'react-router-dom'
import { quickAccess, transparencyShortcuts } from '../../data/navigation'
import { usePageTitle } from '../../hooks/usePageTitle'

export function HomePage() {
  usePageTitle('Inicio')

  return (
    <main>
      <section className="hero" id="inicio">
        <div className="hero-content container">
          <img
            className="hero-logo"
            src="/assets/img/logo.svg"
            alt="H. Ayuntamiento de Chalma"
          />
          <p className="hero-kicker">Gobierno municipal</p>
          <h1>Chalma, Veracruz</h1>
          <p className="hero-text">
            Un gobierno cercano, transparente y comprometido con el desarrollo de
            nuestra comunidad.
          </p>
          <div className="hero-actions">
            <Link className="button button--primary" to="/transparencia">
              Consultar transparencia
            </Link>
            <Link className="button button--ghost" to="/tramites-servicios">
              Tramites y servicios
            </Link>
          </div>
        </div>
        <a className="scroll-indicator" href="#accesos" aria-label="Ir a accesos rapidos">
          ↓
        </a>
      </section>

      <section className="section section--light" id="accesos">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Accesos rapidos</p>
            <h2>Informacion para la ciudadania</h2>
            <p>
              Estos bloques ya estan preparados para que despues coloquemos el
              contenido real.
            </p>
          </div>
          <div className="quick-grid">
            {quickAccess.map((item) => (
              <Link className="quick-card" to={item.to} key={item.title}>
                <span className={`quick-icon quick-icon--${item.icon}`} aria-hidden="true" />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section transparency-band">
        <div className="container transparency-grid">
          <div>
            <p className="eyebrow eyebrow--light">Gobierno abierto</p>
            <h2>Transparencia y rendicion de cuentas</h2>
            <p>
              Accede a la informacion publica, documentos financieros, obras,
              licitaciones y obligaciones de transparencia.
            </p>
          </div>
          <div className="document-shortcuts">
            {transparencyShortcuts.map((item) => (
              <Link to={item.to} key={item.to}>
                {item.label}
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section contact-section" id="contacto">
        <div className="container contact-grid">
          <div>
            <p className="eyebrow">Atencion ciudadana</p>
            <h2>Contacto</h2>
            <p>
              Los siguientes datos son provisionales. Mas adelante se sustituyen
              por la informacion oficial.
            </p>
          </div>
          <div className="contact-list">
            <a href="tel:0000000000">
              <span className="contact-icon contact-icon--phone" aria-hidden="true" />
              <strong>Telefono</strong>
              <small>000 000 00 00</small>
            </a>
            <a href="mailto:contacto@chalma.gob.mx">
              <span className="contact-icon contact-icon--mail" aria-hidden="true" />
              <strong>Correo</strong>
              <small>contacto@chalma.gob.mx</small>
            </a>
            <div>
              <span className="contact-icon contact-icon--place" aria-hidden="true" />
              <strong>Direccion</strong>
              <small>Palacio Municipal de Chalma, Veracruz</small>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
