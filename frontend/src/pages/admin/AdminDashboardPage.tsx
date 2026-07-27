import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usarAutenticacion } from '../../context/ContextoAutenticacion'
import { usePageTitle } from '../../hooks/usePageTitle'
import { esErrorNoAutorizado } from '../../services/api'
import { consultarResumenAdministracion } from '../../services/servicioAutenticacion'

export function AdminDashboardPage() {
  const { administrador, cerrarSesion } = usarAutenticacion()
  const navegar = useNavigate()
  const [mensajeResumen, establecerMensajeResumen] = useState(
    'Comprobando acceso administrativo.',
  )
  const [estaCargandoResumen, establecerEstaCargandoResumen] = useState(true)

  usePageTitle('Panel administrativo')

  useEffect(() => {
    let estaMontado = true

    async function cargarResumen() {
      try {
        const respuesta = await consultarResumenAdministracion()

        if (estaMontado) {
          establecerMensajeResumen(
            respuesta.datos?.mensaje ?? 'Panel administrativo disponible',
          )
        }
      } catch (error) {
        if (esErrorNoAutorizado(error)) {
          await cerrarSesion()
          navegar('/admin/login', { replace: true })
          return
        }

        if (estaMontado) {
          establecerMensajeResumen(
            'No fue posible comprobar el resumen administrativo.',
          )
        }
      } finally {
        if (estaMontado) {
          establecerEstaCargandoResumen(false)
        }
      }
    }

    void cargarResumen()

    return () => {
      estaMontado = false
    }
  }, [cerrarSesion, navegar])

  const cerrarSesionAdministrador = async () => {
    await cerrarSesion()
    navegar('/admin/login', { replace: true })
  }

  const ultimoAcceso = administrador?.ultimoAcceso
    ? new Intl.DateTimeFormat('es-MX', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(administrador.ultimoAcceso))
    : 'Sin registro'

  return (
    <main className="admin-page">
      <section className="admin-panel">
        <p className="eyebrow">Administracion</p>
        <h1>Panel administrativo</h1>
        <p>{mensajeResumen}</p>
        <dl className="admin-session">
          <div>
            <dt>Administrador</dt>
            <dd>{administrador?.nombre}</dd>
          </div>
          <div>
            <dt>Usuario</dt>
            <dd>{administrador?.nombreUsuario}</dd>
          </div>
          <div>
            <dt>Rol</dt>
            <dd>{administrador?.rol}</dd>
          </div>
          <div>
            <dt>Ultimo acceso</dt>
            <dd>{ultimoAcceso}</dd>
          </div>
        </dl>
        <p className="admin-note">
          La gestion de transparencia se agregara en la siguiente fase.
        </p>
        {estaCargandoResumen ? (
          <p className="admin-status" aria-live="polite">
            Validando ruta protegida.
          </p>
        ) : null}
        <div className="admin-actions">
          <button
            className="button button--primary"
            type="button"
            onClick={cerrarSesionAdministrador}
          >
            Cerrar sesion
          </button>
          <Link className="button button--secondary" to="/">
            Ver portal publico
          </Link>
        </div>
      </section>
    </main>
  )
}
