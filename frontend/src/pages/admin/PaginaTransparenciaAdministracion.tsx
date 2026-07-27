import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ConfirmacionEstadoCategoria } from '../../components/admin/ConfirmacionEstadoCategoria'
import { ModalCategoriaAdministracion } from '../../components/admin/ModalCategoriaAdministracion'
import { usarAutenticacion } from '../../context/ContextoAutenticacion'
import { usePageTitle } from '../../hooks/usePageTitle'
import { esErrorNoAutorizado } from '../../services/api'
import {
  actualizarCategoriaAdministracion,
  cambiarEstadoCategoriaAdministracion,
  crearSeccionAdministracion,
  listarCategoriasAdministracion,
  listarSeccionesPrincipales,
} from '../../services/servicioCategoriasAdministracion'
import type {
  CategoriaAdministracion,
  DatosCategoriaAdministracion,
} from '../../types/categoriasAdministracion'
import { etiquetasTipoSeccion } from '../../types/categoriasAdministracion'

export function PaginaTransparenciaAdministracion() {
  const navegar = useNavigate()
  const { cerrarSesion } = usarAutenticacion()
  const [secciones, establecerSecciones] = useState<CategoriaAdministracion[]>(
    [],
  )
  const [catalogoCategorias, establecerCatalogoCategorias] = useState<
    CategoriaAdministracion[]
  >([])
  const [estaCargando, establecerEstaCargando] = useState(true)
  const [mensajeError, establecerMensajeError] = useState('')
  const [mensajeOperacion, establecerMensajeOperacion] = useState('')
  const [modalAbierto, establecerModalAbierto] = useState(false)
  const [categoriaEditando, establecerCategoriaEditando] =
    useState<CategoriaAdministracion | null>(null)
  const [categoriaEstado, establecerCategoriaEstado] =
    useState<CategoriaAdministracion | null>(null)
  const [estaGuardando, establecerEstaGuardando] = useState(false)
  const [mensajeErrorFormulario, establecerMensajeErrorFormulario] =
    useState('')

  usePageTitle('Transparencia administrativa')

  const manejarSesionExpirada = async () => {
    await cerrarSesion()
    navegar('/admin/login', { replace: true })
  }

  const cargarDatos = async () => {
    establecerEstaCargando(true)
    establecerMensajeError('')

    try {
      const [respuestaSecciones, respuestaCatalogo] = await Promise.all([
        listarSeccionesPrincipales(),
        listarCategoriasAdministracion({ estaActivo: 'todos' }),
      ])

      establecerSecciones(respuestaSecciones.datos)
      establecerCatalogoCategorias(respuestaCatalogo.datos)
    } catch (error) {
      if (esErrorNoAutorizado(error)) {
        await manejarSesionExpirada()
        return
      }

      establecerMensajeError('No fue posible cargar la informacion.')
    } finally {
      establecerEstaCargando(false)
    }
  }

  useEffect(() => {
    void cargarDatos()
  }, [])

  const guardarCategoria = async (datos: DatosCategoriaAdministracion) => {
    establecerEstaGuardando(true)
    establecerMensajeErrorFormulario('')
    establecerMensajeOperacion('')

    try {
      const respuesta = categoriaEditando
        ? await actualizarCategoriaAdministracion(categoriaEditando.id, {
            ...datos,
            categoriaPadreId: null,
          })
        : await crearSeccionAdministracion(datos)

      establecerMensajeOperacion(
        respuesta.mensaje ??
          (categoriaEditando
            ? 'Categoria actualizada correctamente'
            : 'Categoria creada correctamente'),
      )
      establecerModalAbierto(false)
      establecerCategoriaEditando(null)
      await cargarDatos()
    } catch (error) {
      if (esErrorNoAutorizado(error)) {
        await manejarSesionExpirada()
        return
      }

      establecerMensajeErrorFormulario(
        'No fue posible guardar la categoria. Revisa los datos.',
      )
    } finally {
      establecerEstaGuardando(false)
    }
  }

  const confirmarCambioEstado = async () => {
    if (!categoriaEstado) {
      return
    }

    establecerEstaGuardando(true)

    try {
      const respuesta = await cambiarEstadoCategoriaAdministracion(
        categoriaEstado.id,
        !categoriaEstado.estaActivo,
      )
      establecerMensajeOperacion(
        respuesta.advertencia ??
          respuesta.mensaje ??
          'Estado de la categoria actualizado correctamente',
      )
      establecerCategoriaEstado(null)
      await cargarDatos()
    } catch (error) {
      if (esErrorNoAutorizado(error)) {
        await manejarSesionExpirada()
        return
      }

      establecerMensajeOperacion(
        'No fue posible actualizar el estado de la categoria.',
      )
    } finally {
      establecerEstaGuardando(false)
    }
  }

  return (
    <div>
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">Transparencia</p>
          <h2>Secciones principales</h2>
          <p>Administra la estructura principal de transparencia.</p>
        </div>
        <button
          className="button button--primary"
          type="button"
          onClick={() => {
            establecerCategoriaEditando(null)
            establecerMensajeErrorFormulario('')
            establecerModalAbierto(true)
          }}
        >
          Nueva seccion
        </button>
      </div>

      <div className="admin-message" aria-live="polite">
        {mensajeOperacion}
      </div>

      {estaCargando ? (
        <div className="admin-loading" aria-live="polite">
          Cargando secciones.
        </div>
      ) : null}

      {!estaCargando && mensajeError ? (
        <div className="transparency-empty-state transparency-empty-state--error">
          <h3>{mensajeError}</h3>
          <button
            className="button button--primary"
            type="button"
            onClick={() => void cargarDatos()}
          >
            Reintentar
          </button>
        </div>
      ) : null}

      {!estaCargando && !mensajeError && secciones.length === 0 ? (
        <div className="transparency-empty-state">
          <h3>No hay secciones de transparencia registradas.</h3>
        </div>
      ) : null}

      {!estaCargando && !mensajeError && secciones.length > 0 ? (
        <div className="admin-section-grid">
          {secciones.map((seccion) => (
            <article className="admin-section-card" key={seccion.id}>
              <span className="admin-section-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M4 5h16v14H4z" />
                  <path d="M8 9h8M8 13h8M8 17h5" />
                </svg>
              </span>
              <div>
                <span
                  className={`admin-badge ${
                    seccion.estaActivo
                      ? 'admin-badge--active'
                      : 'admin-badge--inactive'
                  }`}
                >
                  {seccion.estaActivo ? 'Activa' : 'Inactiva'}
                </span>
                <h3>{seccion.titulo}</h3>
                <p>
                  {seccion.descripcion ??
                    etiquetasTipoSeccion[seccion.tipoSeccion]}
                </p>
                <dl>
                  <div>
                    <dt>Subcategorias</dt>
                    <dd>{seccion.cantidadSubcategorias}</dd>
                  </div>
                  <div>
                    <dt>Documentos</dt>
                    <dd>{seccion.cantidadDocumentos}</dd>
                  </div>
                </dl>
              </div>
              <div className="admin-card-actions">
                <Link
                  className="button button--primary"
                  to={`/admin/transparencia/secciones/${seccion.id}`}
                >
                  Administrar
                </Link>
                <button
                  className="button button--secondary"
                  type="button"
                  onClick={() => {
                    establecerCategoriaEditando(seccion)
                    establecerModalAbierto(true)
                  }}
                >
                  Editar
                </button>
                <button
                  className="button button--secondary"
                  type="button"
                  onClick={() => establecerCategoriaEstado(seccion)}
                >
                  {seccion.estaActivo ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      <ModalCategoriaAdministracion
        abierto={modalAbierto}
        categoria={categoriaEditando}
        bloquearCategoriaPadre
        categoriasDisponibles={catalogoCategorias}
        estaEnviando={estaGuardando}
        mensajeError={mensajeErrorFormulario}
        onCerrar={() => {
          establecerModalAbierto(false)
          establecerCategoriaEditando(null)
        }}
        onGuardar={guardarCategoria}
      />

      <ConfirmacionEstadoCategoria
        categoria={categoriaEstado}
        estaEnviando={estaGuardando}
        onCancelar={() => establecerCategoriaEstado(null)}
        onConfirmar={confirmarCambioEstado}
      />
    </div>
  )
}
