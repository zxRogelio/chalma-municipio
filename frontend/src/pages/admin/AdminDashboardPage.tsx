import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAutenticacion } from '../../context/useAutenticacion'
import { usePageTitle } from '../../hooks/usePageTitle'
import { esErrorNoAutorizado } from '../../services/api'
import { consultarResumenAdministracion } from '../../services/servicioAutenticacion'

export function AdminDashboardPage() {
  const { administrador, cerrarSesion } = useAutenticacion()
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

  const ultimoAcceso = administrador?.ultimoAcceso
    ? new Intl.DateTimeFormat('es-MX', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(administrador.ultimoAcceso))
    : 'Sin registro'

  return (
    <div>
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">Resumen</p>
          <h2>Panel administrativo</h2>
          <p>{mensajeResumen}</p>
        </div>
      </div>
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
      {estaCargandoResumen ? (
        <p className="admin-status" aria-live="polite">
          Validando ruta protegida.
        </p>
      ) : null}
      <div className="admin-dashboard-actions">
        <Link className="admin-feature-link" to="/admin/transparencia">
          <strong>Gestionar transparencia</strong>
          <span>Administrar secciones, fracciones y subcategorias.</span>
        </Link>
        <span className="admin-feature-link admin-feature-link--disabled">
          <strong>Documentos</strong>
          <span>Proximamente</span>
        </span>
      </div>
    </div>
  )
}
