import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ConfirmacionEstadoDocumento } from '../../components/admin/documentos/ConfirmacionEstadoDocumento'
import { ModalDocumentoAdministracion } from '../../components/admin/documentos/ModalDocumentoAdministracion'
import { ReemplazarArchivoDocumento } from '../../components/admin/documentos/ReemplazarArchivoDocumento'
import { TablaDocumentosAdministracion } from '../../components/admin/documentos/TablaDocumentosAdministracion'
import { usarAutenticacion } from '../../context/ContextoAutenticacion'
import { usePageTitle } from '../../hooks/usePageTitle'
import {
  esErrorNoAutorizado,
  obtenerMensajeErrorApi,
} from '../../services/api'
import { obtenerCategoriaAdministracion } from '../../services/servicioCategoriasAdministracion'
import {
  actualizarDocumentoAdministracion,
  cambiarEstadoDocumentoAdministracion,
  crearDocumentoAdministracion,
  listarDocumentosAdministracion,
  reemplazarArchivoDocumentoAdministracion,
} from '../../services/servicioDocumentosAdministracion'
import type { CategoriaAdministracion } from '../../types/categoriasAdministracion'
import type {
  DatosFormularioDocumentoAdministracion,
  DocumentoAdministracion,
  FiltrosDocumentosAdministracion,
  PeriodoDocumentoAdministracion,
} from '../../types/documentosAdministracion'
import { periodosDocumentoAdministracion } from '../../types/documentosAdministracion'

const filtrosIniciales: FiltrosDocumentosAdministracion = {
  ejercicio: '',
  periodo: '',
  estaActivo: 'todos',
  busqueda: '',
}

const mensajeGenericoApi =
  'No fue posible cargar la informacion de transparencia.'

function obtenerMensajeDocumentos(error: unknown, respaldo: string) {
  const mensaje = obtenerMensajeErrorApi(error)
  return mensaje === mensajeGenericoApi ? respaldo : mensaje
}

export function PaginaDocumentosCategoriaAdministracion() {
  const { id } = useParams()
  const idCategoria = Number(id)
  const navegar = useNavigate()
  const { cerrarSesion } = usarAutenticacion()
  const [categoria, establecerCategoria] =
    useState<CategoriaAdministracion | null>(null)
  const [documentos, establecerDocumentos] = useState<
    DocumentoAdministracion[]
  >([])
  const [filtros, establecerFiltros] =
    useState<FiltrosDocumentosAdministracion>(filtrosIniciales)
  const [filtrosAplicados, establecerFiltrosAplicados] =
    useState<FiltrosDocumentosAdministracion>(filtrosIniciales)
  const [estaCargando, establecerEstaCargando] = useState(true)
  const [mensajeError, establecerMensajeError] = useState('')
  const [mensajeOperacion, establecerMensajeOperacion] = useState('')
  const [modalDocumentoAbierto, establecerModalDocumentoAbierto] =
    useState(false)
  const [documentoEditando, establecerDocumentoEditando] =
    useState<DocumentoAdministracion | null>(null)
  const [documentoReemplazo, establecerDocumentoReemplazo] =
    useState<DocumentoAdministracion | null>(null)
  const [documentoEstado, establecerDocumentoEstado] =
    useState<DocumentoAdministracion | null>(null)
  const [estaGuardando, establecerEstaGuardando] = useState(false)
  const [mensajeErrorFormulario, establecerMensajeErrorFormulario] =
    useState('')

  usePageTitle(
    categoria
      ? `Documentos de ${categoria.titulo}`
      : 'Documentos de transparencia',
  )

  const manejarSesionExpirada = async () => {
    await cerrarSesion()
    navegar('/admin/login', { replace: true })
  }

  const cargarDatos = async (
    filtrosConsulta: FiltrosDocumentosAdministracion = filtrosAplicados,
  ) => {
    if (!Number.isInteger(idCategoria) || idCategoria <= 0) {
      establecerMensajeError('Categoria no encontrada.')
      establecerEstaCargando(false)
      return
    }

    establecerEstaCargando(true)
    establecerMensajeError('')

    try {
      const [respuestaCategoria, respuestaDocumentos] = await Promise.all([
        obtenerCategoriaAdministracion(idCategoria),
        listarDocumentosAdministracion(idCategoria, filtrosConsulta),
      ])

      establecerCategoria(respuestaCategoria.datos)
      establecerDocumentos(respuestaDocumentos.datos)
    } catch (error) {
      if (esErrorNoAutorizado(error)) {
        await manejarSesionExpirada()
        return
      }

      establecerMensajeError(
        obtenerMensajeDocumentos(
          error,
          'No fue posible cargar los documentos.',
        ),
      )
    } finally {
      establecerEstaCargando(false)
    }
  }

  useEffect(() => {
    void cargarDatos()
  }, [idCategoria])

  const aplicarFiltros = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    establecerFiltrosAplicados(filtros)
    void cargarDatos(filtros)
  }

  const limpiarFiltros = () => {
    establecerFiltros(filtrosIniciales)
    establecerFiltrosAplicados(filtrosIniciales)
    void cargarDatos(filtrosIniciales)
  }

  const guardarDocumento = async (
    datos: DatosFormularioDocumentoAdministracion,
  ) => {
    establecerEstaGuardando(true)
    establecerMensajeErrorFormulario('')
    establecerMensajeOperacion('')

    try {
      const respuesta = documentoEditando
        ? await actualizarDocumentoAdministracion(documentoEditando.id, {
            titulo: datos.titulo,
            descripcion: datos.descripcion,
            ejercicioFiscal: datos.ejercicioFiscal,
            periodo: datos.periodo,
            orden: datos.orden,
            estaActivo: datos.estaActivo,
          })
        : await crearDocumentoAdministracion(idCategoria, datos)

      establecerMensajeOperacion(
        respuesta.mensaje ??
          (documentoEditando
            ? 'Documento actualizado correctamente'
            : 'Documento publicado correctamente'),
      )
      establecerModalDocumentoAbierto(false)
      establecerDocumentoEditando(null)
      await cargarDatos()
    } catch (error) {
      if (esErrorNoAutorizado(error)) {
        await manejarSesionExpirada()
        return
      }

      establecerMensajeErrorFormulario(
        obtenerMensajeDocumentos(
          error,
          'No fue posible publicar el documento.',
        ),
      )
    } finally {
      establecerEstaGuardando(false)
    }
  }

  const reemplazarArchivo = async (archivo: File) => {
    if (!documentoReemplazo) {
      return
    }

    establecerEstaGuardando(true)
    establecerMensajeErrorFormulario('')
    establecerMensajeOperacion('')

    try {
      const respuesta = await reemplazarArchivoDocumentoAdministracion(
        documentoReemplazo.id,
        archivo,
      )

      establecerMensajeOperacion(
        respuesta.mensaje ?? 'Archivo reemplazado correctamente',
      )
      establecerDocumentoReemplazo(null)
      await cargarDatos()
    } catch (error) {
      if (esErrorNoAutorizado(error)) {
        await manejarSesionExpirada()
        return
      }

      establecerMensajeErrorFormulario(
        obtenerMensajeDocumentos(error, 'El archivo no es valido.'),
      )
    } finally {
      establecerEstaGuardando(false)
    }
  }

  const confirmarCambioEstado = async () => {
    if (!documentoEstado) {
      return
    }

    establecerEstaGuardando(true)
    establecerMensajeOperacion('')

    try {
      const respuesta = await cambiarEstadoDocumentoAdministracion(
        documentoEstado.id,
        !documentoEstado.estaActivo,
      )

      establecerMensajeOperacion(
        respuesta.mensaje ??
          'Estado del documento actualizado correctamente',
      )
      establecerDocumentoEstado(null)
      await cargarDatos()
    } catch (error) {
      if (esErrorNoAutorizado(error)) {
        await manejarSesionExpirada()
        return
      }

      establecerMensajeOperacion(
        obtenerMensajeDocumentos(
          error,
          'No fue posible actualizar el documento.',
        ),
      )
    } finally {
      establecerEstaGuardando(false)
    }
  }

  const seccionPadre =
    categoria?.categoriaPadre?.titulo ?? 'Seccion de transparencia'

  return (
    <div>
      <nav className="admin-breadcrumb" aria-label="Ruta administrativa">
        <Link to="/admin">Panel</Link>
        <span>/</span>
        <Link to="/admin/transparencia">Transparencia</Link>
        <span>/</span>
        {categoria?.categoriaPadre ? (
          <>
            <Link
              to={`/admin/transparencia/secciones/${categoria.categoriaPadre.id}`}
            >
              {categoria.categoriaPadre.titulo}
            </Link>
            <span>/</span>
          </>
        ) : null}
        <Link to={`/admin/transparencia/categorias/${idCategoria}`}>
          {categoria?.titulo ?? 'Categoria'}
        </Link>
        <span>/</span>
        <span>Documentos</span>
      </nav>

      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">Documentos</p>
          <h2>{categoria?.titulo ?? 'Documentos de transparencia'}</h2>
          <p>
            Administra los archivos publicados para esta fraccion o categoria.
          </p>
        </div>
        <button
          className="button button--primary"
          type="button"
          disabled={!categoria}
          onClick={() => {
            establecerDocumentoEditando(null)
            establecerMensajeErrorFormulario('')
            establecerModalDocumentoAbierto(true)
          }}
        >
          Subir documento
        </button>
      </div>

      {categoria ? (
        <div className="admin-detail-grid">
          <div>
            <strong>Seccion padre</strong>
            <span>{seccionPadre}</span>
          </div>
          <div>
            <strong>Fraccion</strong>
            <span>{categoria.titulo}</span>
          </div>
          <div>
            <strong>Fundamento legal</strong>
            <span>{categoria.fundamentoLegal ?? 'Sin fundamento capturado'}</span>
          </div>
          <div>
            <strong>Documentos</strong>
            <span>{categoria.cantidadDocumentos}</span>
          </div>
        </div>
      ) : null}

      {categoria?.descripcion ? (
        <section className="admin-panel admin-document-summary">
          <h3>Descripcion</h3>
          <p>{categoria.descripcion}</p>
        </section>
      ) : null}

      <div className="admin-message" aria-live="polite">
        {mensajeOperacion}
      </div>

      <form className="admin-filters" onSubmit={aplicarFiltros}>
        <label htmlFor="filtro-documentos-busqueda">
          Busqueda
          <input
            id="filtro-documentos-busqueda"
            value={filtros.busqueda ?? ''}
            onChange={(evento) =>
              establecerFiltros((valorActual) => ({
                ...valorActual,
                busqueda: evento.target.value,
              }))
            }
          />
        </label>
        <label htmlFor="filtro-documentos-ejercicio">
          Ejercicio
          <input
            id="filtro-documentos-ejercicio"
            type="number"
            min={2000}
            max={2100}
            value={filtros.ejercicio ?? ''}
            onChange={(evento) =>
              establecerFiltros((valorActual) => ({
                ...valorActual,
                ejercicio: evento.target.value,
              }))
            }
          />
        </label>
        <label htmlFor="filtro-documentos-periodo">
          Periodo
          <select
            id="filtro-documentos-periodo"
            value={filtros.periodo ?? ''}
            onChange={(evento) =>
              establecerFiltros((valorActual) => ({
                ...valorActual,
                periodo: evento.target.value as
                  | PeriodoDocumentoAdministracion
                  | '',
              }))
            }
          >
            <option value="">Todos</option>
            {periodosDocumentoAdministracion.map((periodo) => (
              <option value={periodo} key={periodo}>
                {periodo}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="filtro-documentos-estado">
          Estado
          <select
            id="filtro-documentos-estado"
            value={filtros.estaActivo ?? 'todos'}
            onChange={(evento) =>
              establecerFiltros((valorActual) => ({
                ...valorActual,
                estaActivo: evento.target.value as
                  | 'todos'
                  | 'activas'
                  | 'inactivas',
              }))
            }
          >
            <option value="todos">Todos</option>
            <option value="activas">Activos</option>
            <option value="inactivas">Inactivos</option>
          </select>
        </label>
        <div className="admin-filter-actions">
          <button className="button button--primary" type="submit">
            Filtrar
          </button>
          <button
            className="button button--secondary"
            type="button"
            onClick={limpiarFiltros}
          >
            Limpiar
          </button>
        </div>
      </form>

      {estaCargando ? (
        <div className="admin-loading" aria-live="polite">
          Cargando documentos.
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

      {!estaCargando && !mensajeError && documentos.length === 0 ? (
        <div className="transparency-empty-state">
          <h3>No hay documentos publicados en esta fraccion.</h3>
        </div>
      ) : null}

      {!estaCargando && !mensajeError && documentos.length > 0 ? (
        <TablaDocumentosAdministracion
          documentos={documentos}
          onEditar={(documento) => {
            establecerDocumentoEditando(documento)
            establecerMensajeErrorFormulario('')
            establecerModalDocumentoAbierto(true)
          }}
          onReemplazarArchivo={(documento) => {
            establecerDocumentoReemplazo(documento)
            establecerMensajeErrorFormulario('')
          }}
          onCambiarEstado={establecerDocumentoEstado}
        />
      ) : null}

      <ModalDocumentoAdministracion
        abierto={modalDocumentoAbierto}
        documento={documentoEditando}
        estaEnviando={estaGuardando}
        mensajeError={mensajeErrorFormulario}
        onCerrar={() => {
          establecerModalDocumentoAbierto(false)
          establecerDocumentoEditando(null)
        }}
        onGuardar={guardarDocumento}
      />

      <ReemplazarArchivoDocumento
        documento={documentoReemplazo}
        estaEnviando={estaGuardando}
        mensajeError={mensajeErrorFormulario}
        onCancelar={() => establecerDocumentoReemplazo(null)}
        onGuardar={reemplazarArchivo}
      />

      <ConfirmacionEstadoDocumento
        documento={documentoEstado}
        estaEnviando={estaGuardando}
        onCancelar={() => establecerDocumentoEstado(null)}
        onConfirmar={confirmarCambioEstado}
      />
    </div>
  )
}
