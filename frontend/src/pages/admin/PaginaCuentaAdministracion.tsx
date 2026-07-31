import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconoPortal } from '../../components/common/IconoPortal'
import { useAutenticacion } from '../../context/useAutenticacion'
import { usePageTitle } from '../../hooks/usePageTitle'
import { esErrorNoAutorizado, obtenerMensajeErrorApi } from '../../services/api'
import { cambiarContrasenaAdministracion } from '../../services/servicioCuentaAdministracion'

type CampoContrasena = 'actual' | 'nueva' | 'confirmacion'

const requisitosContrasena = [
  'Minimo 12 caracteres.',
  'Al menos una letra mayuscula.',
  'Al menos una letra minuscula.',
  'Al menos un numero.',
  'Al menos un simbolo.',
]

function contrasenaEsSegura(contrasena: string) {
  return (
    contrasena.length >= 12 &&
    contrasena.length <= 128 &&
    /[A-Z]/.test(contrasena) &&
    /[a-z]/.test(contrasena) &&
    /[0-9]/.test(contrasena) &&
    /[^A-Za-z0-9\s]/.test(contrasena) &&
    contrasena.trim().length > 0
  )
}

export function PaginaCuentaAdministracion() {
  const navegar = useNavigate()
  const { administrador, cerrarSesion } = useAutenticacion()
  const [contrasenaActual, establecerContrasenaActual] = useState('')
  const [contrasenaNueva, establecerContrasenaNueva] = useState('')
  const [confirmacionContrasena, establecerConfirmacionContrasena] =
    useState('')
  const [camposVisibles, establecerCamposVisibles] = useState<
    Record<CampoContrasena, boolean>
  >({
    actual: false,
    nueva: false,
    confirmacion: false,
  })
  const [estaEnviando, establecerEstaEnviando] = useState(false)
  const [mensajeError, establecerMensajeError] = useState('')
  const [mensajeOperacion, establecerMensajeOperacion] = useState('')

  usePageTitle('Mi cuenta')

  const requisitosCumplidos = useMemo(
    () => contrasenaEsSegura(contrasenaNueva),
    [contrasenaNueva],
  )

  const cambiarVisibilidad = (campo: CampoContrasena) => {
    establecerCamposVisibles((actual) => ({
      ...actual,
      [campo]: !actual[campo],
    }))
  }

  const limpiarFormulario = () => {
    establecerContrasenaActual('')
    establecerContrasenaNueva('')
    establecerConfirmacionContrasena('')
    establecerCamposVisibles({
      actual: false,
      nueva: false,
      confirmacion: false,
    })
  }

  const validarFormulario = () => {
    if (!contrasenaActual || !contrasenaNueva || !confirmacionContrasena) {
      return 'Captura la contrasena actual, la nueva contrasena y su confirmacion.'
    }

    if (!requisitosCumplidos) {
      return 'La contrasena nueva no cumple los requisitos de seguridad.'
    }

    if (contrasenaNueva !== confirmacionContrasena) {
      return 'La contrasena nueva y su confirmacion no coinciden.'
    }

    if (contrasenaNueva === contrasenaActual) {
      return 'La contrasena nueva debe ser diferente de la contrasena actual.'
    }

    return ''
  }

  const enviarFormulario = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    establecerMensajeError('')
    establecerMensajeOperacion('')

    const errorFormulario = validarFormulario()

    if (errorFormulario) {
      establecerMensajeError(errorFormulario)
      return
    }

    establecerEstaEnviando(true)

    try {
      const respuesta = await cambiarContrasenaAdministracion({
        contrasenaActual,
        contrasenaNueva,
        confirmacionContrasena,
      })

      limpiarFormulario()
      establecerMensajeOperacion(respuesta.mensaje)
      await cerrarSesion()
      navegar('/admin/login', {
        replace: true,
        state: {
          mensaje: 'Contrasena actualizada. Inicia sesion nuevamente.',
        },
      })
    } catch (error) {
      if (esErrorNoAutorizado(error)) {
        await cerrarSesion()
        navegar('/admin/login', { replace: true })
        return
      }

      establecerMensajeError(obtenerMensajeErrorApi(error))
    } finally {
      establecerEstaEnviando(false)
    }
  }

  return (
    <div>
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">Seguridad</p>
          <h2>Mi cuenta</h2>
          <p>Administra la seguridad de tu cuenta administrativa.</p>
        </div>
      </div>

      <div className="admin-account-grid">
        <section className="admin-contact-form">
          <div className="admin-organigrama-panel__heading">
            <IconoPortal tipo="persona" />
            <div>
              <h3>Datos de la cuenta</h3>
              <p>Informacion disponible desde tu sesion actual.</p>
            </div>
          </div>
          <dl className="admin-session admin-session--compact">
            <div>
              <dt>Nombre</dt>
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
          </dl>
        </section>

        <form
          className="admin-category-form admin-contact-form"
          onSubmit={enviarFormulario}
        >
          <label htmlFor="cuenta-contrasena-actual">
            Contrasena actual
            <span className="password-field">
              <input
                id="cuenta-contrasena-actual"
                type={camposVisibles.actual ? 'text' : 'password'}
                autoComplete="current-password"
                maxLength={200}
                value={contrasenaActual}
                onChange={(evento) =>
                  establecerContrasenaActual(evento.target.value)
                }
              />
              <button
                type="button"
                onClick={() => cambiarVisibilidad('actual')}
              >
                {camposVisibles.actual ? 'Ocultar' : 'Mostrar'}
              </button>
            </span>
          </label>

          <label htmlFor="cuenta-contrasena-nueva">
            Nueva contrasena
            <span className="password-field">
              <input
                id="cuenta-contrasena-nueva"
                type={camposVisibles.nueva ? 'text' : 'password'}
                autoComplete="new-password"
                minLength={12}
                maxLength={128}
                value={contrasenaNueva}
                onChange={(evento) =>
                  establecerContrasenaNueva(evento.target.value)
                }
              />
              <button
                type="button"
                onClick={() => cambiarVisibilidad('nueva')}
              >
                {camposVisibles.nueva ? 'Ocultar' : 'Mostrar'}
              </button>
            </span>
          </label>

          <label htmlFor="cuenta-confirmacion-contrasena">
            Confirmar nueva contrasena
            <span className="password-field">
              <input
                id="cuenta-confirmacion-contrasena"
                type={camposVisibles.confirmacion ? 'text' : 'password'}
                autoComplete="new-password"
                minLength={12}
                maxLength={128}
                value={confirmacionContrasena}
                onChange={(evento) =>
                  establecerConfirmacionContrasena(evento.target.value)
                }
              />
              <button
                type="button"
                onClick={() => cambiarVisibilidad('confirmacion')}
              >
                {camposVisibles.confirmacion ? 'Ocultar' : 'Mostrar'}
              </button>
            </span>
          </label>

          <div className="admin-password-rules">
            <strong>Requisitos de la nueva contrasena</strong>
            <ul>
              {requisitosContrasena.map((requisito) => (
                <li key={requisito}>{requisito}</li>
              ))}
            </ul>
          </div>

          {mensajeOperacion ? (
            <p className="admin-message" aria-live="polite">
              {mensajeOperacion}
            </p>
          ) : null}

          {mensajeError ? (
            <p className="admin-error" role="alert" aria-live="assertive">
              {mensajeError}
            </p>
          ) : (
            <p className="admin-error" aria-live="assertive" />
          )}

          <div className="admin-actions">
            <button
              className="button button--primary"
              type="submit"
              disabled={estaEnviando}
            >
              {estaEnviando ? 'Actualizando...' : 'Cambiar contrasena'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
