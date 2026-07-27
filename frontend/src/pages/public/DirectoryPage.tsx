import { IconoPortal } from '../../components/common/IconoPortal'
import { InternalHero } from '../../components/common/InternalHero'
import { directoryEntries } from '../../data/siteContent'
import { usePageTitle } from '../../hooks/usePageTitle'

export function DirectoryPage() {
  usePageTitle('Directorio')

  return (
    <main className="internal-main">
      <InternalHero
        eyebrow="Gobierno"
        title="Directorio"
        description="Datos de contacto de las areas y servidores publicos municipales."
        breadcrumbs={[{ label: 'Gobierno', to: '/gobierno' }, { label: 'Directorio' }]}
      />
      <section className="section">
        <div className="container">
          <div className="section-heading section-heading--split">
            <div className="heading-with-icon">
              <IconoPortal tipo="directorio" className="portal-heading-icon" />
              <div>
                <p className="eyebrow">Contacto institucional</p>
                <h2>Directorio municipal</h2>
              </div>
            </div>
            <p className="muted-note">Datos provisionales</p>
          </div>
          <div className="table-wrap">
            <table className="directory-table">
              <thead>
                <tr>
                  <th>
                    <IconoPortal tipo="area" className="table-heading-icon" />
                    Area
                  </th>
                  <th>Titular</th>
                  <th>
                    <IconoPortal tipo="telefono" className="table-heading-icon" />
                    Telefono
                  </th>
                  <th>
                    <IconoPortal tipo="correo" className="table-heading-icon" />
                    Correo
                  </th>
                </tr>
              </thead>
              <tbody>
                {directoryEntries.map((entry) => (
                  <tr key={entry.area}>
                    <td>{entry.area}</td>
                    <td>{entry.lead}</td>
                    <td>{entry.phone}</td>
                    <td>{entry.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  )
}
