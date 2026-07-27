import { Link } from 'react-router-dom'
import { InternalHero } from '../../components/common/InternalHero'
import { IconoTransparencia } from '../../components/transparencia/IconoTransparencia'
import { transparencyNavigation } from '../../data/navigation'
import { usePageTitle } from '../../hooks/usePageTitle'

const elementosTransparenciaInternos = transparencyNavigation.filter(
  (elemento) => !elemento.external,
)

export function PaginaTransparencia() {
  usePageTitle('Transparencia')

  return (
    <main className="internal-main">
      <InternalHero
        eyebrow="Transparencia"
        title="Transparencia"
        description="Acceso a informacion publica, documentos municipales y rendicion de cuentas."
        breadcrumbs={[{ label: 'Transparencia' }]}
      />
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Gobierno abierto</p>
            <h2>Informacion publica municipal</h2>
            <p>
              Las categorias estan listas para conectarse posteriormente al
              backend y al panel administrativo.
            </p>
          </div>
          <div className="department-grid">
            {elementosTransparenciaInternos.map((elemento) => (
              <article key={elemento.to}>
                <IconoTransparencia
                  tipo={elemento.icono}
                  className="transparency-card-icon"
                />
                <h3>{elemento.label}</h3>
                <p>{elemento.description}</p>
                <Link to={elemento.to}>Consultar</Link>
              </article>
            ))}
          </div>
          <div className="external-feature">
            <IconoTransparencia
              tipo="plataforma"
              className="external-feature-icon"
            />
            <div>
              <p className="eyebrow">Consulta externa</p>
              <h2>Plataforma Nacional de Transparencia</h2>
              <p>
                Acceso al portal nacional para consultar informacion publica de
                sujetos obligados.
              </p>
            </div>
            <a
              className="button button--primary"
              href="https://www.plataformadetransparencia.org.mx/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir plataforma
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
