import { Link } from 'react-router-dom'
import { usePageTitle } from '../../hooks/usePageTitle'

export function AdminDashboardPage() {
  usePageTitle('Panel administrativo')

  return (
    <main className="admin-page">
      <section className="admin-panel">
        <p className="eyebrow">Administracion</p>
        <h1>Panel administrativo provisional</h1>
        <p>
          Base inicial del panel para futuras herramientas de gestion del portal.
        </p>
        <div className="admin-actions">
          <Link className="button button--primary" to="/admin/login">
            Ir al acceso
          </Link>
          <Link className="button button--secondary" to="/">
            Ver portal publico
          </Link>
        </div>
      </section>
    </main>
  )
}
