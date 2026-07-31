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

export function PaginaSeccionTransparenciaAdministracion() {
  const { id } = useParams()
  const idSeccion = Number(id)
  const idSeccionValido = Number.isInteger(idSeccion) && idSeccion > 0
  const navegar = useNavigate()
  const { cerrarSesion } = useAutenticacion()
  const [seccion, establecerSeccion] =
    useState<CategoriaAdministracion | null>(null)
  const [subcategorias, establecerSubcategorias] = useState<
    CategoriaAdministracion[]
  >([])
  const [catalogoCategorias, establecerCatalogoCategorias] = useState<
    CategoriaAdministracion[]
  >([])
  const [estaCargando, establecerEstaCargando] = useState(idSeccionValido)
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

  usePageTitle(seccion?.titulo ?? 'Seccion de transparencia')

  const manejarSesionExpirada = useCallback(async () => {
    await cerrarSesion()
    navegar('/admin/login', { replace: true })
  }, [cerrarSesion, navegar])

  const cargarDatos = useCallback(async () => {
    try {
      const [respuestaSeccion, respuestaHijas, respuestaCatalogo] =
        await Promise.all([
          obtenerCategoriaAdministracion(idSeccion),
          listarSubcategoriasPorPadre(idSeccion),
          listarCategoriasAdministracion({ estaActivo: 'todos' }),
        ])

      establecerSeccion(respuestaSeccion.datos)
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
  }, [idSeccion, manejarSesionExpirada])

  useEffect(() => {
    if (!idSeccionValido) {
      return undefined
    }

    let estaMontado = true

    Promise.all([
      obtenerCategoriaAdministracion(idSeccion),
      listarSubcategoriasPorPadre(idSeccion),
      listarCategoriasAdministracion({ estaActivo: 'todos' }),
    ])
      .then(([respuestaSeccion, respuestaHijas, respuestaCatalogo]) => {
        if (!estaMontado) {
          return
        }

        establecerSeccion(respuestaSeccion.datos)
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
  }, [idSeccion, idSeccionValido, manejarSesionExpirada])

  const guardarCategoria = async (datos: DatosCategoriaAdministracion) => {
    if (!seccion) {
      return
    }

    establecerEstaGuardando(true)
    establecerMensajeErrorFormulario('')
    establecerMensajeOperacion('')

    try {
      const respuesta = categoriaEditando
        ? await actualizarCategoriaAdministracion(categoriaEditando.id, datos)
        : await crearSubcategoriaAdministracion(seccion.id, {
            ...datos,
            tipoSeccion: seccion.tipoSeccion,
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
      <nav className="admin-breadcrumb" aria-label="Ruta administrativa">
        <Link to="/admin">Panel</Link>
        <span>/</span>
        <Link to="/admin/transparencia">Transparencia</Link>
        <span>/</span>
        <span>{seccion?.titulo ?? 'Seccion'}</span>
      </nav>

      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">Seccion</p>
          <h2>{seccion?.titulo ?? 'Seccion de transparencia'}</h2>
          <p>{seccion?.descripcion ?? 'Consulta sus categorias directas.'}</p>
        </div>
        <button
          className="button button--primary"
          type="button"
          disabled={!seccion}
          onClick={() => {
            establecerCategoriaEditando(null)
            establecerMensajeErrorFormulario('')
            establecerModalAbierto(true)
          }}
        >
          Nueva fraccion
        </button>
      </div>

      {seccion ? (
        <div className="admin-detail-grid">
          <div>
            <strong>Fundamento legal</strong>
            <span>{seccion.fundamentoLegal ?? 'Sin fundamento capturado'}</span>
          </div>
          <div>
            <strong>Estado</strong>
            <span>{seccion.estaActivo ? 'Activa' : 'Inactiva'}</span>
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

      {!estaCargando && (mensajeError || !idSeccionValido) ? (
        <div className="transparency-empty-state transparency-empty-state--error">
          <h3>{mensajeError || 'Categoria no encontrada.'}</h3>
          {idSeccionValido ? (
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
      idSeccionValido &&
      subcategorias.length === 0 ? (
        <div className="transparency-empty-state">
          <h3>Esta seccion todavia no tiene fracciones o subcategorias.</h3>
        </div>
      ) : null}

      {!estaCargando && !mensajeError && subcategorias.length > 0 ? (
        <TablaCategoriasAdministracion
          categorias={subcategorias}
          etiquetaAdministrar="Documentos"
          onAdministrar={(categoria) =>
            navegar(`/admin/transparencia/categorias/${categoria.id}/documentos`)
          }
          onInformacion={(categoria) =>
            navegar(`/admin/transparencia/categorias/${categoria.id}`)
          }
          onEditar={(categoria) => {
            establecerCategoriaEditando(categoria)
            establecerModalAbierto(true)
          }}
          onCambiarEstado={establecerCategoriaEstado}
        />
      ) : null}

      <ModalCategoriaAdministracion
        abierto={modalAbierto}
        categoria={categoriaEditando}
        categoriaPadreFija={categoriaEditando ? null : seccion}
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
