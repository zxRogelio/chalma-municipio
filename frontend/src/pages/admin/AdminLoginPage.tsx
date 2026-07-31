import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Location } from 'react-router-dom'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { usarAutenticacion } from '../../context/ContextoAutenticacion'
import { usePageTitle } from '../../hooks/usePageTitle'
import type { EstadoLoginAdministracion } from '../../types/cuentaAdministracion'

interface EstadoRutaAdministrador {
  from?: Location
  mensaje?: string
}

export function AdminLoginPage() {
  const {
    estaAutenticado,
    estaCargando,
    iniciarSesion,
  } = usarAutenticacion()
  const ubicacion = useLocation()
  const navegar = useNavigate()
  const estadoRuta = ubicacion.state as
    | (EstadoRutaAdministrador & EstadoLoginAdministracion)
    | null
  const rutaOrigen = estadoRuta?.from
  const destino =
    rutaOrigen && rutaOrigen.pathname !== '/admin/login'
      ? `${rutaOrigen.pathname}${rutaOrigen.search}`
      : '/admin'
  const [nombreUsuario, establecerNombreUsuario] = useState('')
  const [contrasena, establecerContrasena] = useState('')
  const [mostrarContrasena, establecerMostrarContrasena] = useState(false)
  const [estaEnviando, establecerEstaEnviando] = useState(false)
  const [mensajeError, establecerMensajeError] = useState('')
  const mensajeInformativo = estadoRuta?.mensaje ?? ''

  usePageTitle('Inicio de sesion administrativo')

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

  if (estaAutenticado) {
    return <Navigate to="/admin" replace />
  }

  const enviarFormulario = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    establecerEstaEnviando(true)
    establecerMensajeError('')

    try {
      await iniciarSesion({
        nombreUsuario: nombreUsuario.trim(),
        contrasena,
      })
      navegar(destino, { replace: true })
    } catch {
      establecerMensajeError('Usuario o contrasena incorrectos')
    } finally {
      establecerEstaEnviando(false)
    }
  }

  return (
    <main className="admin-page">
      <section className="admin-panel">
        <p className="eyebrow">Administracion</p>
        <h1>Inicio de sesion administrativo</h1>
        {mensajeInformativo ? (
          <p className="admin-note" role="status">
            {mensajeInformativo}
          </p>
        ) : null}
        <form className="login-form" onSubmit={enviarFormulario}>
          <label htmlFor="nombreUsuario">
            Usuario
            <input
              id="nombreUsuario"
              type="text"
              name="nombreUsuario"
              autoComplete="username"
              minLength={4}
              maxLength={50}
              required
              value={nombreUsuario}
              onChange={(evento) =>
                establecerNombreUsuario(evento.target.value)
              }
            />
          </label>
          <label htmlFor="contrasena">
            Contrasena
            <span className="password-field">
              <input
                id="contrasena"
                type={mostrarContrasena ? 'text' : 'password'}
                name="contrasena"
                autoComplete="current-password"
                maxLength={200}
                required
                value={contrasena}
                onChange={(evento) =>
                  establecerContrasena(evento.target.value)
                }
              />
              <button
                type="button"
                onClick={() =>
                  establecerMostrarContrasena((valorActual) => !valorActual)
                }
              >
                {mostrarContrasena ? 'Ocultar' : 'Mostrar'}
              </button>
            </span>
          </label>
          {mensajeError ? (
            <p className="admin-error" role="alert" aria-live="assertive">
              {mensajeError}
            </p>
          ) : (
            <p className="admin-error" aria-live="assertive" />
          )}
          <button type="submit" disabled={estaEnviando}>
            {estaEnviando ? 'Iniciando sesion...' : 'Iniciar sesion'}
          </button>
        </form>
        <Link to="/">Volver al portal</Link>
      </section>
    </main>
  )
}
