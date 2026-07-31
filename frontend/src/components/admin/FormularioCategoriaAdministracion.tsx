import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type {
  CategoriaAdministracion,
  DatosCategoriaAdministracion,
  TipoSeccionTransparencia,
} from '../../types/categoriasAdministracion'
import {
  etiquetasTipoSeccion,
  tiposSeccionTransparencia,
} from '../../types/categoriasAdministracion'

interface PropiedadesFormularioCategoriaAdministracion {
  categoria?: CategoriaAdministracion | null
  categoriaPadreFija?: CategoriaAdministracion | null
  bloquearCategoriaPadre?: boolean
  categoriasDisponibles: CategoriaAdministracion[]
  estaEnviando: boolean
  mensajeError: string
  onGuardar: (datos: DatosCategoriaAdministracion) => Promise<void>
  onCancelar: () => void
}

function obtenerDescendientes(
  categoriaId: number,
  categorias: CategoriaAdministracion[],
) {
  const descendientes = new Set<number>()
  const pendientes = [categoriaId]

  while (pendientes.length > 0) {
    const idActual = pendientes.pop()

    if (!idActual) {
      continue
    }

    categorias
      .filter((categoria) => categoria.categoriaPadreId === idActual)
      .forEach((categoria) => {
        if (!descendientes.has(categoria.id)) {
          descendientes.add(categoria.id)
          pendientes.push(categoria.id)
        }
      })
  }

  return descendientes
}

export function FormularioCategoriaAdministracion({
  categoria,
  categoriaPadreFija,
  bloquearCategoriaPadre = false,
  categoriasDisponibles,
  estaEnviando,
  mensajeError,
  onGuardar,
  onCancelar,
}: PropiedadesFormularioCategoriaAdministracion) {
  const [titulo, establecerTitulo] = useState(categoria?.titulo ?? '')
  const [descripcion, establecerDescripcion] = useState(
    categoria?.descripcion ?? '',
  )
  const [fundamentoLegal, establecerFundamentoLegal] = useState(
    categoria?.fundamentoLegal ?? '',
  )
  const [tipoSeccion, establecerTipoSeccion] =
    useState<TipoSeccionTransparencia>(
      categoria?.tipoSeccion ??
        categoriaPadreFija?.tipoSeccion ??
        'obligaciones_comunes',
    )
  const [categoriaPadreId, establecerCategoriaPadreId] = useState<
    number | null
  >(
    bloquearCategoriaPadre
      ? categoriaPadreFija?.id ?? null
      : categoria?.categoriaPadreId ?? categoriaPadreFija?.id ?? null,
  )
  const [orden, establecerOrden] = useState(categoria?.orden ?? 0)
  const [estaActivo, establecerEstaActivo] = useState(
    categoria?.estaActivo ?? true,
  )

  const categoriasPadreDisponibles = useMemo(() => {
    if (bloquearCategoriaPadre) {
      return []
    }

    if (!categoria) {
      return categoriasDisponibles
    }

    const descendientes = obtenerDescendientes(
      categoria.id,
      categoriasDisponibles,
    )

    return categoriasDisponibles.filter(
      (opcion) =>
        opcion.id !== categoria.id && !descendientes.has(opcion.id),
    )
  }, [bloquearCategoriaPadre, categoria, categoriasDisponibles])

  const categoriaPadreSeleccionada = categoriasPadreDisponibles.find(
    (opcion) => opcion.id === categoriaPadreId,
  )
  const categoriaPadreBloqueada =
    bloquearCategoriaPadre || Boolean(categoriaPadreFija && !categoria)
  const categoriaPadreIdGuardada = categoriaPadreBloqueada
    ? categoriaPadreFija?.id ?? null
    : categoriaPadreId
  const tipoSeccionFormulario =
    categoriaPadreSeleccionada?.tipoSeccion ?? tipoSeccion

  const enviarFormulario = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()

    await onGuardar({
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      fundamentoLegal: fundamentoLegal.trim(),
      tipoSeccion: tipoSeccionFormulario,
      categoriaPadreId: categoriaPadreIdGuardada,
      orden,
      estaActivo,
    })
  }

  return (
    <form className="admin-category-form" onSubmit={enviarFormulario}>
      <label htmlFor="categoria-titulo">
        Titulo
        <input
          id="categoria-titulo"
          required
          minLength={3}
          maxLength={250}
          value={titulo}
          onChange={(evento) => establecerTitulo(evento.target.value)}
        />
      </label>

      <label htmlFor="categoria-descripcion">
        Descripcion
        <textarea
          id="categoria-descripcion"
          maxLength={5000}
          rows={4}
          value={descripcion}
          onChange={(evento) => establecerDescripcion(evento.target.value)}
        />
      </label>

      <label htmlFor="categoria-fundamento">
        Fundamento legal
        <textarea
          id="categoria-fundamento"
          maxLength={3000}
          rows={3}
          value={fundamentoLegal}
          onChange={(evento) =>
            establecerFundamentoLegal(evento.target.value)
          }
        />
      </label>

      <label htmlFor="categoria-padre">
        Categoria padre
        <select
          id="categoria-padre"
          value={categoriaPadreId ?? ''}
          disabled={categoriaPadreBloqueada}
          onChange={(evento) => {
            const valor = evento.target.value
            establecerCategoriaPadreId(valor ? Number(valor) : null)
          }}
        >
          <option value="">Sin categoria padre</option>
          {categoriasPadreDisponibles.map((opcion) => (
            <option value={opcion.id} key={opcion.id}>
              {opcion.titulo}
            </option>
          ))}
        </select>
      </label>

      <label htmlFor="categoria-tipo">
        Tipo de seccion
        <select
          id="categoria-tipo"
          required
          value={tipoSeccionFormulario}
          disabled={Boolean(categoriaPadreSeleccionada)}
          onChange={(evento) =>
            establecerTipoSeccion(
              evento.target.value as TipoSeccionTransparencia,
            )
          }
        >
          {tiposSeccionTransparencia.map((tipo) => (
            <option value={tipo} key={tipo}>
              {etiquetasTipoSeccion[tipo]}
            </option>
          ))}
        </select>
      </label>

      {categoriaPadreSeleccionada ? (
        <p className="admin-form-note">
          El tipo de seccion se ajusta al de la categoria padre.
        </p>
      ) : null}

      <label htmlFor="categoria-orden">
        Orden
        <input
          id="categoria-orden"
          type="number"
          min={0}
          max={9999}
          value={orden}
          onChange={(evento) => establecerOrden(Number(evento.target.value))}
        />
      </label>

      <label className="admin-checkbox" htmlFor="categoria-estado">
        <input
          id="categoria-estado"
          type="checkbox"
          checked={estaActivo}
          onChange={(evento) => establecerEstaActivo(evento.target.checked)}
        />
        Categoria activa
      </label>

      <p className="admin-form-note">
        La direccion publica se generara automaticamente a partir del titulo.
      </p>

      {mensajeError ? (
        <p className="admin-error" role="alert" aria-live="assertive">
          {mensajeError}
        </p>
      ) : (
        <p className="admin-error" aria-live="assertive" />
      )}

      <div className="admin-modal-actions">
        <button
          className="button button--secondary"
          type="button"
          onClick={onCancelar}
        >
          Cancelar
        </button>
        <button
          className="button button--primary"
          type="submit"
          disabled={estaEnviando}
        >
          {estaEnviando ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}
