import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAutenticacion } from '../../context/useAutenticacion'
import { usePageTitle } from '../../hooks/usePageTitle'
import { esErrorNoAutorizado, obtenerMensajeErrorApi } from '../../services/api'
import {
  actualizarRegistroDirectorioAdministracion,
  cambiarEstadoRegistroDirectorioAdministracion,
  crearRegistroDirectorioAdministracion,
  listarDirectorioAdministracion,
} from '../../services/servicioDirectorio'
import type {
  DatosRegistroDirectorio,
  RegistroDirectorioAdministracion,
} from '../../types/directorio'

const datosIniciales: DatosRegistroDirectorio = {
  area: '',
  titular: '',
  cargo: '',
  telefono: '',
  correo: '',
  mostrarTelefono: false,
  mostrarCorreo: false,
  orden: 0,
  estaActivo: true,
}

function normalizarFormulario(
  datos: DatosRegistroDirectorio,
): DatosRegistroDirectorio {
  return {
    ...datos,
    area: datos.area.trim(),
    titular: datos.titular.trim(),
    cargo: datos.cargo.trim(),
    telefono: datos.telefono.trim(),
    correo: datos.correo.trim(),
    orden: Number.isFinite(datos.orden) ? datos.orden : 0,
  }
}

function obtenerFormularioDesdeRegistro(
  registro: RegistroDirectorioAdministracion,
): DatosRegistroDirectorio {
  return {
    area: registro.area,
    titular: registro.titular ?? '',
    cargo: registro.cargo ?? '',
    telefono: registro.telefono ?? '',
    correo: registro.correo ?? '',
    mostrarTelefono: registro.mostrarTelefono,
    mostrarCorreo: registro.mostrarCorreo,
    orden: registro.orden,
    estaActivo: registro.estaActivo,
  }
}

export function PaginaDirectorioAdministracion() {
  const navegar = useNavigate()
  const { cerrarSesion } = useAutenticacion()
  const [registros, establecerRegistros] = useState<
    RegistroDirectorioAdministracion[]
  >([])
  const [busqueda, establecerBusqueda] = useState('')
  const [formulario, establecerFormulario] =
    useState<DatosRegistroDirectorio>(datosIniciales)
  const [registroEditando, establecerRegistroEditando] =
    useState<RegistroDirectorioAdministracion | null>(null)
  const [modalAbierto, establecerModalAbierto] = useState(false)
  const [estaCargando, establecerEstaCargando] = useState(true)
  const [estaGuardando, establecerEstaGuardando] = useState(false)
  const [mensajeError, establecerMensajeError] = useState('')
  const [mensajeFormulario, establecerMensajeFormulario] = useState('')
  const [mensajeOperacion, establecerMensajeOperacion] = useState('')

  usePageTitle('Directorio municipal')

  const manejarSesionExpirada = useCallback(async () => {
    await cerrarSesion()
    navegar('/admin/login', { replace: true })
  }, [cerrarSesion, navegar])

  const cargarRegistros = useCallback(async () => {
    try {
      const respuesta = await listarDirectorioAdministracion()
      establecerRegistros(respuesta.datos)
      establecerMensajeError('')
    } catch (error) {
      if (esErrorNoAutorizado(error)) {
        await manejarSesionExpirada()
        return
      }

      establecerMensajeError('No fue posible cargar el directorio municipal.')
    } finally {
      establecerEstaCargando(false)
    }
  }, [manejarSesionExpirada])

  useEffect(() => {
    let estaMontado = true

    listarDirectorioAdministracion()
      .then((respuesta) => {
        if (!estaMontado) {
          return
        }

        establecerRegistros(respuesta.datos)
        establecerMensajeError('')
      })
      .catch(async (error: unknown) => {
        if (esErrorNoAutorizado(error)) {
          await manejarSesionExpirada()
          return
        }

        if (estaMontado) {
          establecerMensajeError(
            'No fue posible cargar el directorio municipal.',
          )
        }
      })
      .finally(() => {
        if (estaMontado) {
          establecerEstaCargando(false)
        }
      })

    return () => {
      estaMontado = false
    }
  }, [manejarSesionExpirada])

  const registrosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()

    if (!texto) {
      return registros
    }

    return registros.filter((registro) =>
      [registro.area, registro.titular, registro.cargo]
        .filter(Boolean)
        .some((valor) => valor?.toLowerCase().includes(texto)),
    )
  }, [busqueda, registros])

  const abrirNuevoRegistro = () => {
    establecerRegistroEditando(null)
    establecerFormulario(datosIniciales)
    establecerMensajeFormulario('')
    establecerModalAbierto(true)
  }

  const abrirEditarRegistro = (registro: RegistroDirectorioAdministracion) => {
    establecerRegistroEditando(registro)
    establecerFormulario(obtenerFormularioDesdeRegistro(registro))
    establecerMensajeFormulario('')
    establecerModalAbierto(true)
  }

  const actualizarCampo = (
    campo: keyof DatosRegistroDirectorio,
    valor: string | number | boolean,
  ) => {
    establecerFormulario((actual) => ({
      ...actual,
      [campo]: valor,
    }))
  }

  const guardarRegistro = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()

    const datos = normalizarFormulario(formulario)

    establecerMensajeFormulario('')
    establecerMensajeOperacion('')

    if (!datos.area) {
      establecerMensajeFormulario('Captura el area del registro.')
      return
    }

    if (datos.mostrarTelefono && !datos.telefono) {
      establecerMensajeFormulario(
        'Captura un telefono antes de mostrarlo en el portal.',
      )
      return
    }

    if (datos.mostrarCorreo && !datos.correo) {
      establecerMensajeFormulario(
        'Captura un correo electronico antes de mostrarlo en el portal.',
      )
      return
    }

    establecerEstaGuardando(true)

    try {
      const respuesta = registroEditando
        ? await actualizarRegistroDirectorioAdministracion(
            registroEditando.id,
            datos,
          )
        : await crearRegistroDirectorioAdministracion(datos)

      establecerMensajeOperacion(
        respuesta.mensaje ??
          (registroEditando
            ? 'Registro actualizado correctamente.'
            : 'Registro creado correctamente.'),
      )
      establecerModalAbierto(false)
      establecerRegistroEditando(null)
      await cargarRegistros()
    } catch (error) {
      if (esErrorNoAutorizado(error)) {
        await manejarSesionExpirada()
        return
      }

      establecerMensajeFormulario(obtenerMensajeErrorApi(error))
    } finally {
      establecerEstaGuardando(false)
    }
  }

  const cambiarEstado = async (
    registro: RegistroDirectorioAdministracion,
  ) => {
    const siguienteEstado = !registro.estaActivo

    if (
      !siguienteEstado &&
      !window.confirm('Deseas ocultar este registro del portal publico?')
    ) {
      return
    }

    establecerEstaGuardando(true)
    establecerMensajeOperacion('')

    try {
      const respuesta = await cambiarEstadoRegistroDirectorioAdministracion(
        registro.id,
        siguienteEstado,
      )
      establecerMensajeOperacion(
        respuesta.mensaje ?? 'Estado actualizado correctamente.',
      )
      await cargarRegistros()
    } catch (error) {
      if (esErrorNoAutorizado(error)) {
        await manejarSesionExpirada()
        return
      }

      establecerMensajeOperacion('No fue posible actualizar el estado.')
    } finally {
      establecerEstaGuardando(false)
    }
  }

  return (
    <div>
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">Gobierno</p>
          <h2>Directorio municipal</h2>
          <p>Administra los registros visibles en el directorio publico.</p>
        </div>
        <button
          className="button button--primary"
          type="button"
          onClick={abrirNuevoRegistro}
        >
          Agregar registro
        </button>
      </div>

      <div className="admin-message" aria-live="polite">
        {mensajeOperacion}
      </div>

      <div className="admin-filters admin-filters--compact">
        <label htmlFor="directorio-busqueda">
          Buscar
          <input
            id="directorio-busqueda"
            type="search"
            value={busqueda}
            onChange={(evento) => establecerBusqueda(evento.target.value)}
            placeholder="Area, titular o cargo"
          />
        </label>
      </div>

      {estaCargando ? (
        <div className="admin-loading" aria-live="polite">
          Cargando directorio municipal.
        </div>
      ) : null}

      {!estaCargando && mensajeError ? (
        <div className="transparency-empty-state transparency-empty-state--error">
          <h3>{mensajeError}</h3>
          <button
            className="button button--primary"
            type="button"
            onClick={() => {
              establecerEstaCargando(true)
              establecerMensajeError('')
              void cargarRegistros()
            }}
          >
            Reintentar
          </button>
        </div>
      ) : null}

      {!estaCargando && !mensajeError && registrosFiltrados.length === 0 ? (
        <div className="transparency-empty-state">
          <h3>No hay registros en el directorio municipal.</h3>
        </div>
      ) : null}

      {!estaCargando && !mensajeError && registrosFiltrados.length > 0 ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Area</th>
                <th>Titular</th>
                <th>Cargo</th>
                <th>Contacto visible</th>
                <th>Orden</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {registrosFiltrados.map((registro) => (
                <tr key={registro.id}>
                  <td>
                    <strong className="admin-table-title">
                      {registro.area}
                    </strong>
                  </td>
                  <td>{registro.titular ?? '-'}</td>
                  <td>{registro.cargo ?? '-'}</td>
                  <td>
                    <small>
                      Tel: {registro.mostrarTelefono ? 'Visible' : 'Oculto'}
                    </small>
                    <br />
                    <small>
                      Correo: {registro.mostrarCorreo ? 'Visible' : 'Oculto'}
                    </small>
                  </td>
                  <td>{registro.orden}</td>
                  <td>
                    <span
                      className={`admin-badge ${
                        registro.estaActivo
                          ? 'admin-badge--active'
                          : 'admin-badge--inactive'
                      }`}
                    >
                      {registro.estaActivo ? 'Activo' : 'Oculto'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <button
                        type="button"
                        onClick={() => abrirEditarRegistro(registro)}
                        disabled={estaGuardando}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => void cambiarEstado(registro)}
                        disabled={estaGuardando}
                      >
                        {registro.estaActivo ? 'Ocultar' : 'Activar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {modalAbierto ? (
        <div className="admin-modal-backdrop" role="presentation">
          <div className="admin-modal" role="dialog" aria-modal="true">
            <div className="admin-modal-header">
              <h2>{registroEditando ? 'Editar registro' : 'Agregar registro'}</h2>
              <button
                type="button"
                onClick={() => establecerModalAbierto(false)}
                aria-label="Cerrar"
              >
                x
              </button>
            </div>
            <form className="admin-category-form" onSubmit={guardarRegistro}>
              <label htmlFor="directorio-area">
                Area
                <input
                  id="directorio-area"
                  required
                  minLength={2}
                  maxLength={180}
                  value={formulario.area}
                  onChange={(evento) =>
                    actualizarCampo('area', evento.target.value)
                  }
                />
              </label>
              <label htmlFor="directorio-titular">
                Titular
                <input
                  id="directorio-titular"
                  maxLength={180}
                  value={formulario.titular}
                  onChange={(evento) =>
                    actualizarCampo('titular', evento.target.value)
                  }
                />
              </label>
              <label htmlFor="directorio-cargo">
                Cargo
                <input
                  id="directorio-cargo"
                  maxLength={180}
                  value={formulario.cargo}
                  onChange={(evento) =>
                    actualizarCampo('cargo', evento.target.value)
                  }
                />
              </label>
              <label htmlFor="directorio-telefono">
                Telefono
                <input
                  id="directorio-telefono"
                  maxLength={40}
                  value={formulario.telefono}
                  onChange={(evento) =>
                    actualizarCampo('telefono', evento.target.value)
                  }
                />
              </label>
              <label className="admin-checkbox" htmlFor="directorio-mostrar-telefono">
                <input
                  id="directorio-mostrar-telefono"
                  type="checkbox"
                  checked={formulario.mostrarTelefono}
                  onChange={(evento) =>
                    actualizarCampo('mostrarTelefono', evento.target.checked)
                  }
                />
                Mostrar telefono
              </label>
              <label htmlFor="directorio-correo">
                Correo electronico
                <input
                  id="directorio-correo"
                  type="email"
                  maxLength={180}
                  value={formulario.correo}
                  onChange={(evento) =>
                    actualizarCampo('correo', evento.target.value)
                  }
                />
              </label>
              <label className="admin-checkbox" htmlFor="directorio-mostrar-correo">
                <input
                  id="directorio-mostrar-correo"
                  type="checkbox"
                  checked={formulario.mostrarCorreo}
                  onChange={(evento) =>
                    actualizarCampo('mostrarCorreo', evento.target.checked)
                  }
                />
                Mostrar correo
              </label>
              <label htmlFor="directorio-orden">
                Orden
                <input
                  id="directorio-orden"
                  type="number"
                  min={0}
                  value={formulario.orden}
                  onChange={(evento) =>
                    actualizarCampo('orden', Number(evento.target.value))
                  }
                />
              </label>
              <label className="admin-checkbox" htmlFor="directorio-activo">
                <input
                  id="directorio-activo"
                  type="checkbox"
                  checked={formulario.estaActivo}
                  onChange={(evento) =>
                    actualizarCampo('estaActivo', evento.target.checked)
                  }
                />
                Estado activo
              </label>

              {mensajeFormulario ? (
                <p className="admin-error" role="alert">
                  {mensajeFormulario}
                </p>
              ) : (
                <p className="admin-error" />
              )}

              <div className="admin-modal-actions">
                <button
                  className="button button--secondary"
                  type="button"
                  onClick={() => establecerModalAbierto(false)}
                >
                  Cancelar
                </button>
                <button
                  className="button button--primary"
                  type="submit"
                  disabled={estaGuardando}
                >
                  {estaGuardando ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}
