import { NavLink } from 'react-router-dom'

export function NavegacionAdministrador() {
  return (
    <nav className="admin-nav" aria-label="Navegacion administrativa">
      <NavLink to="/admin" end>
        Resumen
      </NavLink>
      <NavLink to="/admin/cuenta">
        Mi cuenta
      </NavLink>
      <NavLink to="/admin/transparencia">
        Transparencia
      </NavLink>
      <NavLink to="/admin/contacto">
        Contacto
      </NavLink>
      <NavLink to="/admin/directorio">
        Directorio municipal
      </NavLink>
      <NavLink to="/admin/organigrama">
        Organigrama
      </NavLink>
      <span className="admin-nav-disabled" aria-disabled="true">
        Documentos <small>Proximamente</small>
      </span>
    </nav>
  )
}
