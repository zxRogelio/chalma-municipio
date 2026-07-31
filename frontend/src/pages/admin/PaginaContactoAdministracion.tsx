import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { usarAutenticacion } from '../../context/ContextoAutenticacion'
import { usePageTitle } from '../../hooks/usePageTitle'
import { esErrorNoAutorizado, obtenerMensajeErrorApi } from '../../services/api'
import {
  actualizarConfiguracionContactoAdministracion,
  obtenerConfiguracionContactoAdministracion,
} from '../../services/servicioContacto'

export function PaginaContactoAdministracion() {
  const navegar = useNavigate()
  const { cerrarSesion } = usarAutenticacion()
  const [telefono, establecerTelefono] = useState('')
  const [correo, establecerCorreo] = useState('')
  const [mostrarTelefono, establecerMostrarTelefono] = useState(false)
  const [mostrarCorreo, establecerMostrarCorreo] = useState(false)
  const [estaCargando, establecerEstaCargando] = useState(true)
  const [estaGuardando, establecerEstaGuardando] = useState(false)
  const [mensajeErrorCarga, establecerMensajeErrorCarga] = useState('')
  const [mensajeErrorFormulario, establecerMensajeErrorFormulario] =
    useState('')
  const [mensajeOperacion, establecerMensajeOperacion] = useState('')

  usePageTitle('Configuracion de contacto')

  const manejarSesionExpirada = async () => {
    await cerrarSesion()
    navegar('/admin/login', { replace: true })
  }

  const cargarConfiguracion = async () => {
    establecerEstaCargando(true)
    establecerMensajeErrorCarga('')
    establecerMensajeErrorFormulario('')

    try {
      const datos = await obtenerConfiguracionContactoAdministracion()

      establecerTelefono(datos.telefono ?? '')
      establecerCorreo(datos.correo ?? '')
      establecerMostrarTelefono(datos.mostrarTelefono)
      establecerMostrarCorreo(datos.mostrarCorreo)
    } catch (error) {
      if (esErrorNoAutorizado(error)) {
        await manejarSesionExpirada()
        return
      }

      establecerMensajeErrorCarga(
        'No fue posible cargar la configuracion de contacto.',
      )
    } finally {
      establecerEstaCargando(false)
    }
  }

  useEffect(() => {
    void cargarConfiguracion()
  }, [])

  const guardarConfiguracion = async (
    evento: FormEvent<HTMLFormElement>,
  ) => {
    evento.preventDefault()

    const telefonoNormalizado = telefono.trim()
    const correoNormalizado = correo.trim()

    establecerMensajeErrorFormulario('')
    establecerMensajeOperacion('')

    if (mostrarTelefono && !telefonoNormalizado) {
      establecerMensajeErrorFormulario(
        'Captura un telefono antes de mostrarlo en el portal.',
      )
      return
    }

    if (mostrarCorreo && !correoNormalizado) {
      establecerMensajeErrorFormulario(
        'Captura un correo electronico antes de mostrarlo en el portal.',
      )
      return
    }

    establecerEstaGuardando(true)

    try {
      const respuesta = await actualizarConfiguracionContactoAdministracion({
        telefono: telefonoNormalizado,
        correo: correoNormalizado,
        mostrarTelefono,
        mostrarCorreo,
      })

      establecerTelefono(respuesta.telefono ?? '')
      establecerCorreo(respuesta.correo ?? '')
      establecerMostrarTelefono(respuesta.mostrarTelefono)
      establecerMostrarCorreo(respuesta.mostrarCorreo)
      establecerMensajeOperacion(
        respuesta.mensaje ??
          'Configuracion de contacto actualizada correctamente.',
      )
    } catch (error) {
      if (esErrorNoAutorizado(error)) {
        await manejarSesionExpirada()
        return
      }

      establecerMensajeErrorFormulario(obtenerMensajeErrorApi(error))
    } finally {
      establecerEstaGuardando(false)
    }
  }

  return (
    <div>
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">Contacto</p>
          <h2>Configuracion de contacto</h2>
          <p>
            Administra los medios de contacto visibles en el portal publico.
          </p>
        </div>
      </div>

      {mensajeOperacion ? (
        <div className="admin-message" aria-live="polite">
          {mensajeOperacion}
        </div>
      ) : null}

      {estaCargando ? (
        <div className="admin-loading" aria-live="polite">
          Cargando configuracion de contacto.
        </div>
      ) : null}

      {!estaCargando && mensajeErrorCarga ? (
        <div className="transparency-empty-state transparency-empty-state--error">
          <h3>{mensajeErrorCarga}</h3>
          <button
            className="button button--primary"
            type="button"
            onClick={() => void cargarConfiguracion()}
          >
            Reintentar
          </button>
        </div>
      ) : null}

      {!estaCargando && !mensajeErrorCarga ? (
        <form
          className="admin-category-form admin-contact-form"
          onSubmit={guardarConfiguracion}
        >
          <label htmlFor="contacto-telefono">
            Telefono
            <input
              id="contacto-telefono"
              type="text"
              maxLength={40}
              value={telefono}
              onChange={(evento) => establecerTelefono(evento.target.value)}
            />
          </label>

          <label className="admin-checkbox" htmlFor="contacto-mostrar-telefono">
            <input
              id="contacto-mostrar-telefono"
              type="checkbox"
              checked={mostrarTelefono}
              onChange={(evento) =>
                establecerMostrarTelefono(evento.target.checked)
              }
            />
            Mostrar telefono en el portal
          </label>

          <label htmlFor="contacto-correo">
            Correo electronico
            <input
              id="contacto-correo"
              type="email"
              maxLength={180}
              value={correo}
              onChange={(evento) => establecerCorreo(evento.target.value)}
            />
          </label>

          <label className="admin-checkbox" htmlFor="contacto-mostrar-correo">
            <input
              id="contacto-mostrar-correo"
              type="checkbox"
              checked={mostrarCorreo}
              onChange={(evento) =>
                establecerMostrarCorreo(evento.target.checked)
              }
            />
            Mostrar correo en el portal
          </label>

          {mensajeErrorFormulario ? (
            <p className="admin-error" role="alert" aria-live="assertive">
              {mensajeErrorFormulario}
            </p>
          ) : (
            <p className="admin-error" aria-live="assertive" />
          )}

          <div className="admin-actions">
            <button
              className="button button--primary"
              type="submit"
              disabled={estaGuardando}
            >
              {estaGuardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  )
}
