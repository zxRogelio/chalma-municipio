import { IconoPortal } from '../../components/common/IconoPortal'
import { InternalHero } from '../../components/common/InternalHero'
import { contactInformation } from '../../data/siteContent'
import { usePageTitle } from '../../hooks/usePageTitle'
import type { IconoPortalTipo } from '../../types/site'

interface DatoContacto {
  tipo: IconoPortalTipo
  label: string
  value: string
  href?: string
  external?: boolean
}

const datosContacto: DatoContacto[] = [
  {
    tipo: 'telefono',
    label: contactInformation.phone.label,
    value: contactInformation.phone.value,
    href: contactInformation.phone.href,
  },
  {
    tipo: 'correo',
    label: contactInformation.email.label,
    value: contactInformation.email.value,
    href: contactInformation.email.href,
  },
  {
    tipo: 'ubicacion',
    label: contactInformation.address.label,
    value: contactInformation.address.value,
    href: contactInformation.address.href,
    external: true,
  },
  {
    tipo: 'horario',
    label: contactInformation.schedule.label,
    value: contactInformation.schedule.value,
  },
]

export function ContactPage() {
  usePageTitle('Contacto')

  return (
    <main className="internal-main contact-page">
      <InternalHero
        eyebrow="Atencion ciudadana"
        title="Contacto"
        description="Consulta nuestros medios de atencion, ubicacion y horarios de servicio."
        breadcrumbs={[{ label: 'Contacto' }]}
      />

      <section className="contacto-publico">
        <div className="container contacto-publico__grid">
          <div className="contacto-publico__introduccion">
            <p className="eyebrow">Atencion ciudadana</p>
            <h2>Como encontrarnos?</h2>
            <p>{contactInformation.intro}</p>

            <div className="contacto-publico__redes" aria-labelledby="redes-contacto">
              <h3 id="redes-contacto">Siguenos en redes sociales</h3>
              {contactInformation.socialLinks.length > 0 ? (
                <div className="contacto-publico__redes-lista">
                  {contactInformation.socialLinks.map((redSocial) => (
                    <a
                      href={redSocial.url}
                      key={redSocial.tipo}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={redSocial.ariaLabel}
                    >
                      <IconoPortal tipo={redSocial.tipo} />
                      <span>{redSocial.nombre}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="contacto-publico__redes-vacio">
                  Redes sociales oficiales pendientes de configurar.
                </p>
              )}
            </div>
          </div>

          <div className="contacto-publico__datos" aria-label="Medios de contacto">
            {datosContacto.map((dato) => {
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

              return dato.href ? (
                <a
                  className="contacto-publico__dato"
                  href={dato.href}
                  key={dato.tipo}
                  target={dato.external ? '_blank' : undefined}
                  rel={dato.external ? 'noopener noreferrer' : undefined}
                >
                  {contenidoDato}
                </a>
              ) : (
                <div className="contacto-publico__dato" key={dato.tipo}>
                  {contenidoDato}
                </div>
              )
            })}
            <p className="contacto-publico__nota">
              {contactInformation.provisionalNote}
            </p>
          </div>
        </div>
      </section>

      <section className="contacto-mapa" aria-labelledby="contacto-mapa-titulo">
        <div className="container">
          <div className="contacto-mapa__encabezado">
            <p className="eyebrow">Ubicacion</p>
            <h2 id="contacto-mapa-titulo">{contactInformation.map.title}</h2>
          </div>
          <div className="contacto-mapa__marco">
            <iframe
              src={contactInformation.map.embedUrl}
              title={contactInformation.map.iframeTitle}
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
