import { Link } from 'react-router-dom'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-grid container">
        <div>
          <img
            className="footer-logo"
            src="/assets/img/logo.svg"
            alt="H. Ayuntamiento de Chalma"
          />
          <p className="footer-copy">
            Sitio frontal provisional del H. Ayuntamiento de Chalma.
          </p>
        </div>
        <div>
          <h2 className="footer-title">Enlaces</h2>
          <Link to="/gobierno">Gobierno</Link>
          <Link to="/transparencia">Transparencia</Link>
          <Link to="/tramites-servicios">Tramites y servicios</Link>
          <Link to="/contacto">Contacto</Link>
        </div>
        <div>
          <h2 className="footer-title">Contacto</h2>
          <p>Palacio Municipal de Chalma, Veracruz</p>
          <p>Tel. 000 000 00 00</p>
          <p>contacto@chalma.gob.mx</p>
          <small>Datos provisionales sujetos a sustitucion oficial.</small>
        </div>
      </div>
      <div className="footer-bottom">
        {currentYear} H. Ayuntamiento de Chalma. Todos los derechos reservados.
      </div>
    </footer>
  )
}
