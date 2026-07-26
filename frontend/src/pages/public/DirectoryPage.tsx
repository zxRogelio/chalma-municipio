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
            <div>
              <p className="eyebrow">Contacto institucional</p>
              <h2>Directorio municipal</h2>
            </div>
            <p className="muted-note">Datos provisionales</p>
          </div>
          <div className="table-wrap">
            <table className="directory-table">
              <thead>
                <tr>
                  <th>Area</th>
                  <th>Titular</th>
                  <th>Telefono</th>
                  <th>Correo</th>
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
