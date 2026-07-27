import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { usarAutenticacion } from '../../context/ContextoAutenticacion'

export function RutaAdministrador() {
  const { estaAutenticado, estaCargando } = usarAutenticacion()
  const ubicacion = useLocation()

  if (estaCargando) {
    return (
      <main className="admin-page">
        <section className="admin-panel" aria-live="polite">
          <p className="eyebrow">Administracion</p>
          <h1>Verificando sesion</h1>
          <p>Espera un momento.</p>
        </section>
      </main>
    )
  }

  if (!estaAutenticado) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: ubicacion }}
      />
    )
  }

  return <Outlet />
}
