import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConfirmacionEstadoCategoria } from '../../components/admin/ConfirmacionEstadoCategoria'
import { ModalCategoriaAdministracion } from '../../components/admin/ModalCategoriaAdministracion'
import { TablaCategoriasAdministracion } from '../../components/admin/TablaCategoriasAdministracion'
import { usarAutenticacion } from '../../context/ContextoAutenticacion'
import { usePageTitle } from '../../hooks/usePageTitle'
import { esErrorNoAutorizado } from '../../services/api'
import {
  actualizarCategoriaAdministracion,
  cambiarEstadoCategoriaAdministracion,
  crearCategoriaAdministracion,
  listarCategoriasAdministracion,
} from '../../services/servicioCategoriasAdministracion'
import type {
  CategoriaAdministracion,
  DatosCategoriaAdministracion,
  FiltrosCategoriasAdministracion,
  TipoSeccionTransparencia,
} from '../../types/categoriasAdministracion'
import {
  etiquetasTipoSeccion,
  tiposSeccionTransparencia,
} from '../../types/categoriasAdministracion'

const filtrosIniciales: FiltrosCategoriasAdministracion = {
  tipoSeccion: '',
  estaActivo: 'todos',
  categoriaPadreId: null,
  busqueda: '',
}

export function PaginaCategoriasAdministracion() {
  const navegar = useNavigate()
  const { cerrarSesion } = usarAutenticacion()
  const [categorias, establecerCategorias] = useState<
    CategoriaAdministracion[]
  >([])
  const [catalogoCategorias, establecerCatalogoCategorias] = useState<
    CategoriaAdministracion[]
  >([])
  const [filtrosFormulario, establecerFiltrosFormulario] =
    useState<FiltrosCategoriasAdministracion>(filtrosIniciales)
  const [filtrosAplicados, establecerFiltrosAplicados] =
    useState<FiltrosCategoriasAdministracion>(filtrosIniciales)
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

  usePageTitle('Categorias y fracciones')

  const manejarSesionExpirada = async () => {
    await cerrarSesion()
    navegar('/admin/login', { replace: true })
  }

  const cargarCatalogoCategorias = async () => {
    const respuesta = await listarCategoriasAdministracion({
      estaActivo: 'todos',
    })
    establecerCatalogoCategorias(respuesta.datos)
  }

  const cargarCategorias = async (
    filtros: FiltrosCategoriasAdministracion,
  ) => {
    establecerEstaCargando(true)
    establecerMensajeError('')

    try {
      const respuesta = await listarCategoriasAdministracion(filtros)
      establecerCategorias(respuesta.datos)
    } catch (error) {
      if (esErrorNoAutorizado(error)) {
        await manejarSesionExpirada()
        return
      }

      establecerMensajeError(
        'No fue posible cargar las categorias de transparencia.',
      )
    } finally {
      establecerEstaCargando(false)
    }
  }

  useEffect(() => {
    let estaMontado = true

    async function cargarDatosIniciales() {
      try {
        const [respuestaListado, respuestaCatalogo] = await Promise.all([
          listarCategoriasAdministracion(filtrosAplicados),
          listarCategoriasAdministracion({ estaActivo: 'todos' }),
        ])

        if (estaMontado) {
          establecerCategorias(respuestaListado.datos)
          establecerCatalogoCategorias(respuestaCatalogo.datos)
          establecerMensajeError('')
        }
      } catch (error) {
        if (esErrorNoAutorizado(error)) {
          await manejarSesionExpirada()
          return
        }

        if (estaMontado) {
          establecerMensajeError(
            'No fue posible cargar las categorias de transparencia.',
          )
        }
      } finally {
        if (estaMontado) {
          establecerEstaCargando(false)
        }
      }
    }

    void cargarDatosIniciales()

    return () => {
      estaMontado = false
    }
  }, [filtrosAplicados])

  const buscarCategorias = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    establecerFiltrosAplicados(filtrosFormulario)
  }

  const abrirModalNuevo = () => {
    establecerCategoriaEditando(null)
    establecerMensajeErrorFormulario('')
    establecerModalAbierto(true)
  }

  const abrirModalEditar = (categoria: CategoriaAdministracion) => {
    establecerCategoriaEditando(categoria)
    establecerMensajeErrorFormulario('')
    establecerModalAbierto(true)
  }

  const cerrarModal = () => {
    establecerModalAbierto(false)
    establecerCategoriaEditando(null)
    establecerMensajeErrorFormulario('')
  }

  const guardarCategoria = async (
    datos: DatosCategoriaAdministracion,
  ) => {
    establecerEstaGuardando(true)
    establecerMensajeErrorFormulario('')
    establecerMensajeOperacion('')

    try {
      const respuesta = categoriaEditando
        ? await actualizarCategoriaAdministracion(
            categoriaEditando.id,
            datos,
          )
        : await crearCategoriaAdministracion(datos)

      establecerMensajeOperacion(
        respuesta.mensaje ??
          (categoriaEditando
            ? 'Categoria actualizada correctamente'
            : 'Categoria creada correctamente'),
      )
      cerrarModal()
      await Promise.all([
        cargarCatalogoCategorias(),
        cargarCategorias(filtrosAplicados),
      ])
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
    establecerMensajeOperacion('')

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
      await Promise.all([
        cargarCatalogoCategorias(),
        cargarCategorias(filtrosAplicados),
      ])
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
          <h2>Categorias y fracciones</h2>
          <p>
            Administra secciones, fracciones y subcategorias de transparencia.
          </p>
        </div>
        <button
          className="button button--primary"
          type="button"
          onClick={abrirModalNuevo}
        >
          Nueva categoria
        </button>
      </div>

      <form className="admin-filters" onSubmit={buscarCategorias}>
        <label htmlFor="filtro-tipo-seccion">
          Tipo de seccion
          <select
            id="filtro-tipo-seccion"
            value={filtrosFormulario.tipoSeccion ?? ''}
            onChange={(evento) =>
              establecerFiltrosFormulario((actual) => ({
                ...actual,
                tipoSeccion: evento.target.value as
                  | TipoSeccionTransparencia
                  | '',
              }))
            }
          >
            <option value="">Todas</option>
            {tiposSeccionTransparencia.map((tipo) => (
              <option value={tipo} key={tipo}>
                {etiquetasTipoSeccion[tipo]}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="filtro-estado">
          Estado
          <select
            id="filtro-estado"
            value={filtrosFormulario.estaActivo ?? 'todos'}
            onChange={(evento) =>
              establecerFiltrosFormulario((actual) => ({
                ...actual,
                estaActivo: evento.target.value as
                  | 'todos'
                  | 'activas'
                  | 'inactivas',
              }))
            }
          >
            <option value="todos">Todas</option>
            <option value="activas">Activas</option>
            <option value="inactivas">Inactivas</option>
          </select>
        </label>

        <label htmlFor="filtro-padre">
          Categoria padre
          <select
            id="filtro-padre"
            value={filtrosFormulario.categoriaPadreId ?? ''}
            onChange={(evento) =>
              establecerFiltrosFormulario((actual) => ({
                ...actual,
                categoriaPadreId: evento.target.value
                  ? Number(evento.target.value)
                  : null,
              }))
            }
          >
            <option value="">Todas</option>
            {catalogoCategorias.map((categoria) => (
              <option value={categoria.id} key={categoria.id}>
                {categoria.titulo}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="filtro-busqueda">
          Busqueda
          <input
            id="filtro-busqueda"
            value={filtrosFormulario.busqueda ?? ''}
            onChange={(evento) =>
              establecerFiltrosFormulario((actual) => ({
                ...actual,
                busqueda: evento.target.value,
              }))
            }
          />
        </label>

        <button className="button button--secondary" type="submit">
          Buscar
        </button>
      </form>

      <div className="admin-message" aria-live="polite">
        {mensajeOperacion}
      </div>

      {estaCargando ? (
        <div className="admin-loading" aria-live="polite">
          Cargando categorias.
        </div>
      ) : null}

      {!estaCargando && mensajeError ? (
        <div className="transparency-empty-state transparency-empty-state--error">
          <h3>{mensajeError}</h3>
          <button
            className="button button--primary"
            type="button"
            onClick={() => void cargarCategorias(filtrosAplicados)}
          >
            Reintentar
          </button>
        </div>
      ) : null}

      {!estaCargando && !mensajeError && categorias.length === 0 ? (
        <div className="transparency-empty-state">
          <h3>No hay categorias disponibles con los filtros seleccionados.</h3>
        </div>
      ) : null}

      {!estaCargando && !mensajeError && categorias.length > 0 ? (
        <TablaCategoriasAdministracion
          categorias={categorias}
          onEditar={abrirModalEditar}
          onCambiarEstado={establecerCategoriaEstado}
        />
      ) : null}

      <ModalCategoriaAdministracion
        abierto={modalAbierto}
        categoria={categoriaEditando}
        categoriasDisponibles={catalogoCategorias}
        estaEnviando={estaGuardando}
        mensajeError={mensajeErrorFormulario}
        onCerrar={cerrarModal}
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
