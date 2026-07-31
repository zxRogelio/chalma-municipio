import { Link } from 'react-router-dom'
import { usarContacto } from '../../context/ContextoContacto'
import { IconoPortal } from '../common/IconoPortal'

function construirEnlaceTelefono(telefono: string) {
  return `tel:${telefono.replace(/[^\d+]/g, '')}`
}

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { configuracion } = usarContacto()
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
    <footer className="site-footer">
      <div className="footer-grid container">
        <div>
          <p className="footer-copy">
            Sitio frontal provisional del H. Ayuntamiento de Chalma.
          </p>
        </div>
        <div>
          <h2 className="footer-title">Enlaces</h2>
          <Link className="footer-link" to="/gobierno">
            <IconoPortal tipo="gobierno" className="footer-icon" />
            Gobierno
          </Link>
          <Link className="footer-link" to="/transparencia">
            <IconoPortal tipo="transparencia" className="footer-icon" />
            Transparencia
          </Link>
          <Link className="footer-link" to="/tramites-servicios">
            <IconoPortal tipo="tramites" className="footer-icon" />
            Tramites y servicios
          </Link>
          <Link className="footer-link" to="/contacto">
            <IconoPortal tipo="contacto" className="footer-icon" />
            Contacto
          </Link>
        </div>
        {tieneContactoVisible ? (
          <div>
            <h2 className="footer-title">Contacto</h2>
            {telefonoVisible ? (
              <a
                className="footer-link"
                href={construirEnlaceTelefono(telefonoVisible)}
              >
                <IconoPortal tipo="telefono" className="footer-icon" />
                {telefonoVisible}
              </a>
            ) : null}
            {correoVisible ? (
              <a className="footer-link" href={`mailto:${correoVisible}`}>
                <IconoPortal tipo="correo" className="footer-icon" />
                {correoVisible}
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="footer-bottom">
        {currentYear} H. Ayuntamiento de Chalma. Todos los derechos reservados.
      </div>
    </footer>
  )
}
