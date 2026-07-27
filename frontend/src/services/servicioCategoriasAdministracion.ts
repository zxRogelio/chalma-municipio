import api from './api'
import type {
  DatosCategoriaAdministracion,
  FiltrosCategoriasAdministracion,
  RespuestaCategoriaAdministracion,
  RespuestaCategoriasAdministracion,
} from '../types/categoriasAdministracion'

function construirParametros(filtros: FiltrosCategoriasAdministracion) {
  return {
    soloRaices: filtros.soloRaices || undefined,
    tipoSeccion: filtros.tipoSeccion || undefined,
    estaActivo:
      filtros.estaActivo && filtros.estaActivo !== 'todos'
        ? filtros.estaActivo
        : undefined,
    categoriaPadreId: filtros.categoriaPadreId ?? undefined,
    busqueda: filtros.busqueda?.trim() || undefined,
  }
}

export async function listarCategoriasAdministracion(
  filtros: FiltrosCategoriasAdministracion = {},
) {
  const respuesta = await api.get<RespuestaCategoriasAdministracion>(
    '/administracion/transparencia/categorias',
    {
      params: construirParametros(filtros),
    },
  )

  return respuesta.data
}

export async function obtenerCategoriaAdministracion(id: number) {
  const respuesta = await api.get<RespuestaCategoriaAdministracion>(
    `/administracion/transparencia/categorias/${id}`,
  )

  return respuesta.data
}

export async function listarSeccionesPrincipales() {
  const respuesta = await api.get<RespuestaCategoriasAdministracion>(
    '/administracion/transparencia/secciones',
  )

  return respuesta.data
}

export async function listarSubcategoriasPorPadre(id: number) {
  const respuesta = await api.get<RespuestaCategoriasAdministracion>(
    `/administracion/transparencia/categorias/${id}/subcategorias`,
  )

  return respuesta.data
}

export async function crearSeccionAdministracion(
  datos: DatosCategoriaAdministracion,
) {
  return crearCategoriaAdministracion({
    ...datos,
    categoriaPadreId: null,
  })
}

export async function crearSubcategoriaAdministracion(
  categoriaPadreId: number,
  datos: DatosCategoriaAdministracion,
) {
  return crearCategoriaAdministracion({
    ...datos,
    categoriaPadreId,
  })
}

export async function crearCategoriaAdministracion(
  datos: DatosCategoriaAdministracion,
) {
  const respuesta = await api.post<RespuestaCategoriaAdministracion>(
    '/administracion/transparencia/categorias',
    datos,
  )

  return respuesta.data
}

export async function actualizarCategoriaAdministracion(
  id: number,
  datos: DatosCategoriaAdministracion,
) {
  const respuesta = await api.put<RespuestaCategoriaAdministracion>(
    `/administracion/transparencia/categorias/${id}`,
    datos,
  )

  return respuesta.data
}

export async function cambiarEstadoCategoriaAdministracion(
  id: number,
  estaActivo: boolean,
) {
  const respuesta = await api.patch<RespuestaCategoriaAdministracion>(
    `/administracion/transparencia/categorias/${id}/estado`,
    { estaActivo },
  )

  return respuesta.data
}
