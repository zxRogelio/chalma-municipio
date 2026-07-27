import { NavLink } from 'react-router-dom'

export function NavegacionAdministrador() {
  return (
    <nav className="admin-nav" aria-label="Navegacion administrativa">
      <NavLink to="/admin" end>
        Resumen
      </NavLink>
      <NavLink to="/admin/transparencia">
        Transparencia
      </NavLink>
      <span className="admin-nav-disabled" aria-disabled="true">
        Documentos <small>Proximamente</small>
      </span>
    </nav>
  )
}
