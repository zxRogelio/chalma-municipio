import { Link } from 'react-router-dom'
import { IconoPortal } from '../../components/common/IconoPortal'
import { IconoTransparencia } from '../../components/transparencia/IconoTransparencia'
import { configuracionPortal } from '../../config/configuracionPortal'
import { usarContacto } from '../../context/ContextoContacto'
import { quickAccess, transparencyShortcuts } from '../../data/navigation'
import { usePageTitle } from '../../hooks/usePageTitle'

function construirEnlaceTelefono(telefono: string) {
  return `tel:${telefono.replace(/[^\d+]/g, '')}`
}

export function HomePage() {
  const { configuracion, estaCargando, mensajeError } = usarContacto()
  usePageTitle('Inicio')

  const telefonoVisible =
    configuracion.mostrarTelefono && configuracion.telefono
      ? configuracion.telefono
      : null
  const correoVisible =
    configuracion.mostrarCorreo && configuracion.correo
      ? configuracion.correo
      : null
  const tieneContactoVisible = Boolean(telefonoVisible || correoVisible)

  return (
    <main>
      <section className="hero" id="inicio">
        <div className="hero-content container">
          <img
            className="hero-logo"
            src="/assets/img/logo_sin_fondo.png"
            alt="Logo oficial del H. Ayuntamiento de Chalma"
          />
          <p className="hero-kicker">Gobierno municipal</p>
          <h1>Chalma, Veracruz</h1>
          <p className="hero-text">
            Un gobierno cercano, transparente y comprometido con el desarrollo de
            nuestra comunidad.
          </p>
          <div className="hero-actions">
            <Link className="button button--primary" to="/transparencia">
              <IconoPortal tipo="transparencia" className="button-icon" />
              Consultar transparencia
            </Link>
            {configuracionPortal.mostrarTramitesServicios ? (
              <Link className="button button--ghost" to="/tramites-servicios">
                <IconoPortal tipo="tramites" className="button-icon" />
                Tramites y servicios
              </Link>
            ) : null}
          </div>
        </div>
        <a className="scroll-indicator" href="#accesos" aria-label="Ir a accesos rapidos">
          <IconoPortal tipo="flecha" className="scroll-indicator-icon" />
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
                <IconoPortal tipo={item.icon} className="quick-icon" />
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
                <span>
                  <IconoTransparencia
                    tipo={item.icono}
                    className="document-shortcut-icon"
                  />
                  {item.label}
                </span>
                <IconoPortal tipo="flecha" className="shortcut-arrow" />
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
              Consulta los medios de contacto oficiales disponibles para
              atencion ciudadana.
            </p>
          </div>
          <div className="contact-list" aria-label="Medios de contacto">
            {estaCargando ? (
              <div aria-live="polite">
                <span className="contact-icon" aria-hidden="true">
                  <IconoPortal tipo="contacto" />
                </span>
                <strong>Contacto</strong>
                <small>Cargando informacion de contacto.</small>
              </div>
            ) : null}

            {!estaCargando && (mensajeError || !tieneContactoVisible) ? (
              <div>
                <span className="contact-icon" aria-hidden="true">
                  <IconoPortal tipo="contacto" />
                </span>
                <strong>Contacto</strong>
                <small>
                  La informaci&oacute;n de contacto no est&aacute; disponible
                  temporalmente.
                </small>
              </div>
            ) : null}

            {!estaCargando && !mensajeError && telefonoVisible ? (
              <a href={construirEnlaceTelefono(telefonoVisible)}>
                <span className="contact-icon" aria-hidden="true">
                  <IconoPortal tipo="telefono" />
                </span>
                <strong>Telefono</strong>
                <small>{telefonoVisible}</small>
              </a>
            ) : null}

            {!estaCargando && !mensajeError && correoVisible ? (
              <a href={`mailto:${correoVisible}`}>
                <span className="contact-icon" aria-hidden="true">
                  <IconoPortal tipo="correo" />
                </span>
                <strong>Correo</strong>
                <small>{correoVisible}</small>
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  )
}
