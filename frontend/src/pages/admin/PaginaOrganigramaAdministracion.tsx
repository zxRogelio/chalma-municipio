import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconoPortal } from '../../components/common/IconoPortal'
import { usarAutenticacion } from '../../context/ContextoAutenticacion'
import { usePageTitle } from '../../hooks/usePageTitle'
import { esErrorNoAutorizado, obtenerMensajeErrorApi } from '../../services/api'
import {
  actualizarOrganigramaAdministracion,
  construirUrlArchivoOrganigrama,
  obtenerOrganigramaAdministracion,
  reemplazarArchivoOrganigramaAdministracion,
} from '../../services/servicioOrganigrama'
import type { OrganigramaAdministracion } from '../../types/organigrama'

const tamanoMaximoImagen = 10 * 1024 * 1024
const tiposPermitidos = ['image/png', 'image/jpeg']

function formatearTamano(tamanoBytes: number | null) {
  if (!tamanoBytes || tamanoBytes <= 0) {
    return 'Sin archivo'
  }

  if (tamanoBytes < 1024 * 1024) {
    return `${(tamanoBytes / 1024).toFixed(1)} KB`
  }

  return `${(tamanoBytes / (1024 * 1024)).toFixed(1)} MB`
}

export function PaginaOrganigramaAdministracion() {
  const navegar = useNavigate()
  const { cerrarSesion } = usarAutenticacion()
  const [organigrama, establecerOrganigrama] =
    useState<OrganigramaAdministracion | null>(null)
  const [titulo, establecerTitulo] = useState('')
  const [descripcion, establecerDescripcion] = useState('')
  const [mostrarOrganigrama, establecerMostrarOrganigrama] = useState(false)
  const [archivo, establecerArchivo] = useState<File | null>(null)
  const [estaCargando, establecerEstaCargando] = useState(true)
  const [estaGuardando, establecerEstaGuardando] = useState(false)
  const [mensajeErrorCarga, establecerMensajeErrorCarga] = useState('')
  const [mensajeErrorFormulario, establecerMensajeErrorFormulario] =
    useState('')
  const [mensajeArchivo, establecerMensajeArchivo] = useState('')
  const [mensajeOperacion, establecerMensajeOperacion] = useState('')

  usePageTitle('Organigrama administrativo')

  const urlVistaPrevia = useMemo(() => {
    const url = construirUrlArchivoOrganigrama(organigrama?.urlArchivo ?? null)

    if (!url || !organigrama?.updatedAt) {
      return url
    }

    return `${url}${url.includes('?') ? '&' : '?'}v=${encodeURIComponent(
      organigrama.updatedAt,
    )}`
  }, [organigrama])

  const manejarSesionExpirada = async () => {
    await cerrarSesion()
    navegar('/admin/login', { replace: true })
  }

  const cargarOrganigrama = async () => {
    establecerEstaCargando(true)
    establecerMensajeErrorCarga('')
    establecerMensajeErrorFormulario('')
    establecerMensajeArchivo('')

    try {
      const datos = await obtenerOrganigramaAdministracion()

      establecerOrganigrama(datos)
      establecerTitulo(datos.titulo ?? '')
      establecerDescripcion(datos.descripcion ?? '')
      establecerMostrarOrganigrama(datos.mostrarOrganigrama)
    } catch (error) {
      if (esErrorNoAutorizado(error)) {
        await manejarSesionExpirada()
        return
      }

      establecerMensajeErrorCarga('No fue posible cargar el organigrama.')
    } finally {
      establecerEstaCargando(false)
    }
  }

  useEffect(() => {
    void cargarOrganigrama()
  }, [])

  const guardarInformacion = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    establecerMensajeErrorFormulario('')
    establecerMensajeOperacion('')

    if (mostrarOrganigrama && !organigrama?.tieneArchivo) {
      establecerMensajeErrorFormulario(
        'Sube una imagen antes de mostrar el organigrama en el portal.',
      )
      return
    }

    establecerEstaGuardando(true)

    try {
      const datos = await actualizarOrganigramaAdministracion({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        mostrarOrganigrama,
      })

      establecerOrganigrama(datos)
      establecerTitulo(datos.titulo ?? '')
      establecerDescripcion(datos.descripcion ?? '')
      establecerMostrarOrganigrama(datos.mostrarOrganigrama)
      establecerMensajeOperacion(
        datos.mensaje ?? 'Organigrama actualizado correctamente.',
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

  const seleccionarArchivo = (archivoSeleccionado: File | null) => {
    establecerArchivo(null)
    establecerMensajeArchivo('')

    if (!archivoSeleccionado) {
      return
    }

    if (!tiposPermitidos.includes(archivoSeleccionado.type)) {
      establecerMensajeArchivo('Selecciona una imagen PNG, JPG o JPEG.')
      return
    }

    if (archivoSeleccionado.size > tamanoMaximoImagen) {
      establecerMensajeArchivo('La imagen supera el limite de 10 MB.')
      return
    }

    establecerArchivo(archivoSeleccionado)
  }

  const reemplazarImagen = async () => {
    if (!archivo) {
      establecerMensajeArchivo('Selecciona una imagen para reemplazar.')
      return
    }

    if (
      organigrama?.tieneArchivo &&
      !window.confirm('Deseas reemplazar la imagen actual del organigrama?')
    ) {
      return
    }

    establecerEstaGuardando(true)
    establecerMensajeArchivo('')
    establecerMensajeOperacion('')

    try {
      const datos = await reemplazarArchivoOrganigramaAdministracion(archivo)
      establecerOrganigrama(datos)
      establecerArchivo(null)
      establecerMensajeOperacion(
        datos.mensaje ?? 'Imagen del organigrama actualizada correctamente.',
      )
    } catch (error) {
      if (esErrorNoAutorizado(error)) {
        await manejarSesionExpirada()
        return
      }

      establecerMensajeArchivo(obtenerMensajeErrorApi(error))
    } finally {
      establecerEstaGuardando(false)
    }
  }

  return (
    <div>
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">Gobierno</p>
          <h2>Organigrama</h2>
          <p>Configura la imagen del organigrama visible en el portal.</p>
        </div>
      </div>

      <div className="admin-message" aria-live="polite">
        {mensajeOperacion}
      </div>

      {estaCargando ? (
        <div className="admin-loading" aria-live="polite">
          Cargando organigrama.
        </div>
      ) : null}

      {!estaCargando && mensajeErrorCarga ? (
        <div className="transparency-empty-state transparency-empty-state--error">
          <h3>{mensajeErrorCarga}</h3>
          <button
            className="button button--primary"
            type="button"
            onClick={() => void cargarOrganigrama()}
          >
            Reintentar
          </button>
        </div>
      ) : null}

      {!estaCargando && !mensajeErrorCarga ? (
        <div className="admin-organigrama-grid">
          <form
            className="admin-category-form admin-contact-form"
            onSubmit={guardarInformacion}
          >
            <label htmlFor="organigrama-titulo">
              Titulo
              <input
                id="organigrama-titulo"
                maxLength={180}
                value={titulo}
                onChange={(evento) => establecerTitulo(evento.target.value)}
              />
            </label>

            <label htmlFor="organigrama-descripcion">
              Descripcion
              <textarea
                id="organigrama-descripcion"
                maxLength={2000}
                rows={5}
                value={descripcion}
                onChange={(evento) =>
                  establecerDescripcion(evento.target.value)
                }
              />
            </label>

            <label className="admin-checkbox" htmlFor="organigrama-visible">
              <input
                id="organigrama-visible"
                type="checkbox"
                checked={mostrarOrganigrama}
                onChange={(evento) =>
                  establecerMostrarOrganigrama(evento.target.checked)
                }
              />
              Mostrar organigrama en el portal
            </label>

            {mensajeErrorFormulario ? (
              <p className="admin-error" role="alert">
                {mensajeErrorFormulario}
              </p>
            ) : (
              <p className="admin-error" />
            )}

            <div className="admin-actions">
              <button
                className="button button--primary"
                type="submit"
                disabled={estaGuardando}
              >
                {estaGuardando ? 'Guardando...' : 'Guardar informacion'}
              </button>
            </div>
          </form>

          <section className="admin-contact-form admin-organigrama-panel">
            <div className="admin-organigrama-panel__heading">
              <IconoPortal tipo="imagen" />
              <div>
                <h3>Imagen actual</h3>
                <p>
                  {organigrama?.nombreOriginal
                    ? `${organigrama.nombreOriginal} (${formatearTamano(
                        organigrama.tamanoBytes,
                      )})`
                    : 'No hay imagen configurada.'}
                </p>
              </div>
            </div>

            {urlVistaPrevia ? (
              <div className="admin-organigrama-preview">
                <img src={urlVistaPrevia} alt="Vista previa del organigrama" />
              </div>
            ) : (
              <div className="admin-organigrama-empty">
                No hay imagen de organigrama para mostrar.
              </div>
            )}

            <label htmlFor="organigrama-archivo" className="admin-upload-field">
              <span>Seleccionar imagen</span>
              <input
                id="organigrama-archivo"
                type="file"
                accept="image/png,image/jpeg"
                onChange={(evento) =>
                  seleccionarArchivo(evento.target.files?.[0] ?? null)
                }
              />
            </label>

            {archivo ? (
              <p className="admin-form-note">
                Archivo seleccionado: {archivo.name} ({formatearTamano(archivo.size)})
              </p>
            ) : null}

            {mensajeArchivo ? (
              <p className="admin-error" role="alert">
                {mensajeArchivo}
              </p>
            ) : (
              <p className="admin-error" />
            )}

            <button
              className="button button--primary"
              type="button"
              disabled={estaGuardando || !archivo}
              onClick={() => void reemplazarImagen()}
            >
              <IconoPortal tipo="subir" className="button-icon" />
              {organigrama?.tieneArchivo ? 'Reemplazar imagen' : 'Subir imagen'}
            </button>
          </section>
        </div>
      ) : null}
    </div>
  )
}
