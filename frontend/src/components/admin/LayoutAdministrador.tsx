import { Link, Outlet, useNavigate } from 'react-router-dom'
import { usarAutenticacion } from '../../context/ContextoAutenticacion'
import { NavegacionAdministrador } from './NavegacionAdministrador'

export function LayoutAdministrador() {
  const { administrador, cerrarSesion } = usarAutenticacion()
  const navegar = useNavigate()

  const cerrarSesionAdministrador = async () => {
    await cerrarSesion()
    navegar('/admin/login', { replace: true })
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Administracion</p>
          <h1>Panel administrativo</h1>
        </div>
        <div className="admin-header-actions">
          <span>{administrador?.nombre}</span>
          <Link className="button button--secondary" to="/">
            Ver portal publico
          </Link>
          <button
            className="button button--primary"
            type="button"
            onClick={cerrarSesionAdministrador}
          >
            Cerrar sesion
          </button>
        </div>
      </header>
      <div className="admin-shell-grid">
        <aside className="admin-sidebar">
          <NavegacionAdministrador />
        </aside>
        <section className="admin-content">
          <Outlet />
        </section>
      </div>
    </main>
  )
}
