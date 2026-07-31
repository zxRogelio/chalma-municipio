import { Link } from 'react-router-dom'
import { configuracionPortal } from '../../config/configuracionPortal'
import { useContacto } from '../../context/useContacto'
import type { IconoPortalTipo } from '../../types/site'
import { IconoPortal } from '../common/IconoPortal'

interface RedSocialFooter {
  nombre: string
  tipo: IconoPortalTipo
  url: string
}

const redesSocialesFooter: RedSocialFooter[] = [
  // Reemplaza "#" por la URL oficial de cada red social.
  { nombre: 'Facebook', tipo: 'facebook', url: 'https://www.facebook.com/PresidenciaMunicipaldeChalma/' },
  { nombre: 'Instagram', tipo: 'instagram', url: '#' },
  { nombre: 'X', tipo: 'x', url: '#' },
  { nombre: 'YouTube', tipo: 'youtube', url: '#' },
]

function construirEnlaceTelefono(telefono: string) {
  return `tel:${telefono.replace(/[^\d+]/g, '')}`
}

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { configuracion } = useContacto()
  const redesSocialesVisibles = redesSocialesFooter.filter(
    (redSocial) => redSocial.url.trim() && redSocial.url !== '#',
  )
  const telefonoVisible =
    configuracion.mostrarTelefono && configuracion.telefono
      ? configuracion.telefono
      : null
  const correoVisible =
    configuracion.mostrarCorreo && configuracion.correo
      ? configuracion.correo
      : null
  const tieneContactoVisible = Boolean(telefonoVisible || correoVisible)
  const claseColumnasFooter = tieneContactoVisible
    ? 'footer-grid--with-contact'
    : 'footer-grid--without-contact'

  return (
    <footer className="site-footer">
      <div className={`footer-grid ${claseColumnasFooter} container`}>
        <div>
          <p className="footer-copy">
            Portal oficial del H. Ayuntamiento de Chalma, Veracruz.
          </p>
          {redesSocialesVisibles.length > 0 ? (
            <div className="footer-social" aria-label="Redes sociales oficiales">
              {redesSocialesVisibles.map((redSocial) => (
                <a
                  className="footer-social-link"
                  href={redSocial.url}
                  key={redSocial.nombre}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={redSocial.nombre}
                  title={redSocial.nombre}
                >
                  <IconoPortal tipo={redSocial.tipo} />
                </a>
              ))}
            </div>
          ) : null}
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
          {configuracionPortal.mostrarTramitesServicios ? (
            <Link className="footer-link" to="/tramites-servicios">
              <IconoPortal tipo="tramites" className="footer-icon" />
              Tramites y servicios
            </Link>
          ) : null}
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
