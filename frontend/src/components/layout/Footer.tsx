import { Link } from 'react-router-dom'
import { IconoPortal } from '../common/IconoPortal'

export function Footer() {
  const currentYear = new Date().getFullYear()

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
        <div>
          <h2 className="footer-title">Contacto</h2>
          <p className="footer-link">
            <IconoPortal tipo="ubicacion" className="footer-icon" />
            Palacio Municipal de Chalma, Veracruz
          </p>
          <p className="footer-link">
            <IconoPortal tipo="telefono" className="footer-icon" />
            Tel. 000 000 00 00
          </p>
          <p className="footer-link">
            <IconoPortal tipo="correo" className="footer-icon" />
            contacto@chalma.gob.mx
          </p>
          <small>Datos provisionales sujetos a sustitucion oficial.</small>
        </div>
      </div>
      <div className="footer-bottom">
        {currentYear} H. Ayuntamiento de Chalma. Todos los derechos reservados.
      </div>
    </footer>
  )
}
