import { IconoPortal } from '../../components/common/IconoPortal'
import { InternalHero } from '../../components/common/InternalHero'
import { useContacto } from '../../context/useContacto'
import { usePageTitle } from '../../hooks/usePageTitle'
import type { IconoPortalTipo } from '../../types/site'

interface DatoContacto {
  tipo: IconoPortalTipo
  label: string
  value: string
  href?: string
}

function construirEnlaceTelefono(telefono: string) {
  return `tel:${telefono.replace(/[^\d+]/g, '')}`
}

const mapaChalmaUrl =
  'https://www.google.com/maps?q=Palacio+Municipal+de+Chalma,+Veracruz&output=embed'
const comoLlegarUrl =
  'https://www.google.com/maps/dir/?api=1&destination=Palacio+Municipal+de+Chalma,+Veracruz'

export function ContactPage() {
  const {
    configuracion,
    estaCargando,
    mensajeError,
    recargarContacto,
  } = useContacto()
  usePageTitle('Contacto')

  const datosContacto: DatoContacto[] = []

  if (configuracion.mostrarTelefono && configuracion.telefono) {
    datosContacto.push({
      tipo: 'telefono',
      label: 'Telefono',
      value: configuracion.telefono,
      href: construirEnlaceTelefono(configuracion.telefono),
    })
  }

  if (configuracion.mostrarCorreo && configuracion.correo) {
    datosContacto.push({
      tipo: 'correo',
      label: 'Correo electronico',
      value: configuracion.correo,
      href: `mailto:${configuracion.correo}`,
    })
  }

  const tieneDatosVisibles = datosContacto.length > 0

  return (
    <main className="internal-main contact-page">
      <InternalHero
        eyebrow="Atencion ciudadana"
        title="Contacto"
        description="Consulta los medios de atencion habilitados por el Ayuntamiento."
        breadcrumbs={[{ label: 'Contacto' }]}
      />

      <section className="contacto-publico">
        <div className="container contacto-publico__grid">
          <div className="contacto-publico__introduccion">
            <p className="eyebrow">Atencion ciudadana</p>
            <h2>Medios de contacto</h2>
            <p>
              La informacion visible en esta pagina se administra desde el
              panel municipal para mantener publicados solo los datos oficiales.
            </p>
          </div>

          <div className="contacto-publico__datos" aria-label="Medios de contacto">
            {estaCargando ? (
              <div className="contacto-publico__estado" aria-live="polite">
                Cargando medios de contacto.
              </div>
            ) : null}

            {!estaCargando && mensajeError ? (
              <div className="contacto-publico__estado contacto-publico__estado--error">
                <p>{mensajeError}</p>
                <button
                  className="button button--secondary"
                  type="button"
                  onClick={() => void recargarContacto()}
                >
                  Reintentar
                </button>
              </div>
            ) : null}

            {!estaCargando && !mensajeError && !tieneDatosVisibles ? (
              <div className="contacto-publico__estado">
                La informacion de contacto no esta disponible temporalmente.
              </div>
            ) : null}

            {!estaCargando && !mensajeError ? datosContacto.map((dato) => {
              const contenidoDato = (
                <>
                  <span className="contacto-publico__dato-icono" aria-hidden="true">
                    <IconoPortal tipo={dato.tipo} />
                  </span>
                  <span>
                    <strong>{dato.label}</strong>
                    <small>{dato.value}</small>
                  </span>
                </>
              )

              return (
                <a
                  className="contacto-publico__dato"
                  href={dato.href}
                  key={dato.tipo}
                >
                  {contenidoDato}
                </a>
              )
            }) : null}
          </div>
        </div>
      </section>

      <section className="contacto-mapa" aria-labelledby="contacto-mapa-titulo">
        <div className="container">
          <div className="contacto-mapa__encabezado contacto-mapa__encabezado--split">
            <div>
              <p className="eyebrow">Ubicacion</p>
              <h2 id="contacto-mapa-titulo">Palacio Municipal de Chalma</h2>
              <p>Consulta la ubicacion del H. Ayuntamiento de Chalma.</p>
            </div>
            <a
              className="button button--primary"
              href={comoLlegarUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconoPortal tipo="ubicacion" className="button-icon" />
              Como llegar
            </a>
          </div>
          <div className="contacto-mapa__marco">
            <iframe
              src={mapaChalmaUrl}
              title="Ubicacion del H. Ayuntamiento de Chalma"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </main>
  )
}
