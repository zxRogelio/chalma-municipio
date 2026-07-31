import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ConfirmacionEstadoCategoria } from '../../components/admin/ConfirmacionEstadoCategoria'
import { ModalCategoriaAdministracion } from '../../components/admin/ModalCategoriaAdministracion'
import { TablaCategoriasAdministracion } from '../../components/admin/TablaCategoriasAdministracion'
import { useAutenticacion } from '../../context/useAutenticacion'
import { usePageTitle } from '../../hooks/usePageTitle'
import { esErrorNoAutorizado } from '../../services/api'
import {
  actualizarCategoriaAdministracion,
  cambiarEstadoCategoriaAdministracion,
  crearSubcategoriaAdministracion,
  listarCategoriasAdministracion,
  listarSubcategoriasPorPadre,
  obtenerCategoriaAdministracion,
} from '../../services/servicioCategoriasAdministracion'
import type {
  CategoriaAdministracion,
  DatosCategoriaAdministracion,
} from '../../types/categoriasAdministracion'
import {
  etiquetasTipoSeccion,
  puedeCrearSubcategorias,
} from '../../types/categoriasAdministracion'
import { obtenerRutaPublicaCategoria } from '../../utils/rutasCategoriasAdministracion'

export function PaginaDetalleCategoriaAdministracion() {
  const { id } = useParams()
  const idCategoria = Number(id)
  const idCategoriaValido =
    Number.isInteger(idCategoria) && idCategoria > 0
  const navegar = useNavigate()
  const { cerrarSesion } = useAutenticacion()
  const [categoria, establecerCategoria] =
    useState<CategoriaAdministracion | null>(null)
  const [subcategorias, establecerSubcategorias] = useState<
    CategoriaAdministracion[]
  >([])
  const [catalogoCategorias, establecerCatalogoCategorias] = useState<
    CategoriaAdministracion[]
  >([])
  const [estaCargando, establecerEstaCargando] =
    useState(idCategoriaValido)
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

  usePageTitle(categoria?.titulo ?? 'Detalle de categoria')

  const manejarSesionExpirada = useCallback(async () => {
    await cerrarSesion()
    navegar('/admin/login', { replace: true })
  }, [cerrarSesion, navegar])

  const cargarDatos = useCallback(async () => {
    try {
      const [respuestaCategoria, respuestaHijas, respuestaCatalogo] =
        await Promise.all([
          obtenerCategoriaAdministracion(idCategoria),
          listarSubcategoriasPorPadre(idCategoria),
          listarCategoriasAdministracion({ estaActivo: 'todos' }),
        ])

      establecerCategoria(respuestaCategoria.datos)
      establecerSubcategorias(respuestaHijas.datos)
      establecerCatalogoCategorias(respuestaCatalogo.datos)
      establecerMensajeError('')
    } catch (error) {
      if (esErrorNoAutorizado(error)) {
        await manejarSesionExpirada()
        return
      }

      establecerMensajeError('No fue posible cargar la informacion.')
    } finally {
      establecerEstaCargando(false)
    }
  }, [idCategoria, manejarSesionExpirada])

  useEffect(() => {
    if (!idCategoriaValido) {
      return undefined
    }

    let estaMontado = true

    Promise.all([
      obtenerCategoriaAdministracion(idCategoria),
      listarSubcategoriasPorPadre(idCategoria),
      listarCategoriasAdministracion({ estaActivo: 'todos' }),
    ])
      .then(([respuestaCategoria, respuestaHijas, respuestaCatalogo]) => {
        if (!estaMontado) {
          return
        }

        establecerCategoria(respuestaCategoria.datos)
        establecerSubcategorias(respuestaHijas.datos)
        establecerCatalogoCategorias(respuestaCatalogo.datos)
        establecerMensajeError('')
      })
      .catch(async (error: unknown) => {
        if (esErrorNoAutorizado(error)) {
          await manejarSesionExpirada()
          return
        }

        if (estaMontado) {
          establecerMensajeError('No fue posible cargar la informacion.')
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
  }, [idCategoria, idCategoriaValido, manejarSesionExpirada])

  const guardarCategoria = async (datos: DatosCategoriaAdministracion) => {
    if (!categoria) {
      return
    }

    establecerEstaGuardando(true)
    establecerMensajeErrorFormulario('')
    establecerMensajeOperacion('')

    try {
      const respuesta = categoriaEditando
        ? await actualizarCategoriaAdministracion(categoriaEditando.id, datos)
        : await crearSubcategoriaAdministracion(categoria.id, {
            ...datos,
            tipoSeccion: categoria.tipoSeccion,
          })

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
    const categoriaObjetivo = categoriaEstado ?? categoria

    if (!categoriaObjetivo) {
      return
    }

    establecerEstaGuardando(true)

    try {
      const respuesta = await cambiarEstadoCategoriaAdministracion(
        categoriaObjetivo.id,
        !categoriaObjetivo.estaActivo,
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

  const rutaPublica = categoria ? obtenerRutaPublicaCategoria(categoria) : null
  const permiteSubcategorias = categoria
    ? puedeCrearSubcategorias(categoria)
    : false

  return (
    <div>
      <nav className="admin-breadcrumb" aria-label="Ruta administrativa">
        <Link to="/admin">Panel</Link>
        <span>/</span>
        <Link to="/admin/transparencia">Transparencia</Link>
        <span>/</span>
        {categoria?.categoriaPadre ? (
          <>
            <Link to={`/admin/transparencia/categorias/${categoria.categoriaPadre.id}`}>
              {categoria.categoriaPadre.titulo}
            </Link>
            <span>/</span>
          </>
        ) : null}
        <span>{categoria?.titulo ?? 'Categoria'}</span>
      </nav>

      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">Detalle</p>
          <h2>{categoria?.titulo ?? 'Categoria de transparencia'}</h2>
          <p>{categoria?.descripcion ?? 'Informacion de la categoria.'}</p>
        </div>
        <div className="admin-heading-actions">
          <button
            className="button button--primary"
            type="button"
            disabled={!categoria}
            onClick={() =>
              navegar(`/admin/transparencia/categorias/${categoria?.id}/documentos`)
            }
          >
            Administrar documentos
          </button>
          <button
            className="button button--secondary"
            type="button"
            disabled={!categoria}
            onClick={() => {
              establecerCategoriaEditando(categoria)
              establecerModalAbierto(true)
            }}
          >
            Editar informacion
          </button>
          <button
            className="button button--secondary"
            type="button"
            disabled={!categoria}
            onClick={() => establecerCategoriaEstado(categoria)}
          >
            {categoria?.estaActivo ? 'Desactivar' : 'Activar'}
          </button>
          {rutaPublica ? (
            <a
              className="button button--secondary"
              href={rutaPublica}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver en el portal
            </a>
          ) : null}
        </div>
      </div>

      {categoria ? (
        <div className="admin-detail-grid">
          <div>
            <strong>Seccion padre</strong>
            <span>{categoria.categoriaPadre?.titulo ?? 'Sin categoria padre'}</span>
          </div>
          <div>
            <strong>Tipo de seccion</strong>
            <span>{etiquetasTipoSeccion[categoria.tipoSeccion]}</span>
          </div>
          <div>
            <strong>Fundamento legal</strong>
            <span>{categoria.fundamentoLegal ?? 'Sin fundamento capturado'}</span>
          </div>
          <div>
            <strong>Orden</strong>
            <span>{categoria.orden}</span>
          </div>
          <div>
            <strong>Slug</strong>
            <span>{categoria.slug}</span>
          </div>
          <div>
            <strong>Estado</strong>
            <span>{categoria.estaActivo ? 'Activa' : 'Inactiva'}</span>
          </div>
          {permiteSubcategorias ? (
            <div>
              <strong>Subcategorias</strong>
              <span>{categoria.cantidadSubcategorias}</span>
            </div>
          ) : null}
          <div>
            <strong>Documentos</strong>
            <span>{categoria.cantidadDocumentos}</span>
          </div>
        </div>
      ) : null}

      <div className="admin-message" aria-live="polite">
        {mensajeOperacion}
      </div>

      {estaCargando ? (
        <div className="admin-loading" aria-live="polite">
          Cargando informacion.
        </div>
      ) : null}

      {!estaCargando && (mensajeError || !idCategoriaValido) ? (
        <div className="transparency-empty-state transparency-empty-state--error">
          <h3>{mensajeError || 'Categoria no encontrada.'}</h3>
          {idCategoriaValido ? (
            <button
              className="button button--primary"
              type="button"
              onClick={() => {
                establecerEstaCargando(true)
                establecerMensajeError('')
                void cargarDatos()
              }}
            >
              Reintentar
            </button>
          ) : null}
        </div>
      ) : null}

      {!estaCargando &&
      !mensajeError &&
      idCategoriaValido &&
      permiteSubcategorias ? (
        <section className="admin-subsection">
          <div className="admin-page-heading">
            <div>
              <p className="eyebrow">Subcategorias</p>
              <h3>Hijas directas</h3>
            </div>
            <button
              className="button button--primary"
              type="button"
              disabled={!categoria}
              onClick={() => {
                establecerCategoriaEditando(null)
                establecerMensajeErrorFormulario('')
                establecerModalAbierto(true)
              }}
            >
              Nueva subcategoria
            </button>
          </div>

          {subcategorias.length === 0 ? (
            <div className="transparency-empty-state">
              <h3>Esta categoria todavia no tiene subcategorias.</h3>
            </div>
          ) : (
            <TablaCategoriasAdministracion
              categorias={subcategorias}
              onAdministrar={(subcategoria) =>
                navegar(`/admin/transparencia/categorias/${subcategoria.id}`)
              }
              onEditar={(subcategoria) => {
                establecerCategoriaEditando(subcategoria)
                establecerModalAbierto(true)
              }}
              onCambiarEstado={establecerCategoriaEstado}
            />
          )}
        </section>
      ) : null}

      <ModalCategoriaAdministracion
        abierto={modalAbierto}
        categoria={categoriaEditando}
        categoriaPadreFija={categoriaEditando ? null : categoria}
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
