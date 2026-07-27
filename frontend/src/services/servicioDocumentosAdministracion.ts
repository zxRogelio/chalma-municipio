import api from './api'
import type {
  DatosDocumentoAdministracion,
  DatosFormularioDocumentoAdministracion,
  FiltrosDocumentosAdministracion,
  RespuestaDocumentoAdministracion,
  RespuestaDocumentosAdministracion,
} from '../types/documentosAdministracion'

function construirParametros(filtros: FiltrosDocumentosAdministracion) {
  return {
    ejercicio: filtros.ejercicio?.trim() || undefined,
    periodo: filtros.periodo || undefined,
    estaActivo:
      filtros.estaActivo && filtros.estaActivo !== 'todos'
        ? filtros.estaActivo
        : undefined,
    busqueda: filtros.busqueda?.trim() || undefined,
  }
}

function construirFormularioDocumento(
  datos: DatosFormularioDocumentoAdministracion,
) {
  const formulario = new FormData()

  if (datos.archivo) {
    formulario.append('archivo', datos.archivo)
  }

  formulario.append('titulo', datos.titulo)
  formulario.append('descripcion', datos.descripcion)
  formulario.append('ejercicioFiscal', String(datos.ejercicioFiscal))
  formulario.append('periodo', datos.periodo)
  formulario.append('orden', String(datos.orden))
  formulario.append('estaActivo', String(datos.estaActivo))

  return formulario
}

export async function listarDocumentosAdministracion(
  categoriaId: number,
  filtros: FiltrosDocumentosAdministracion = {},
) {
  const respuesta = await api.get<RespuestaDocumentosAdministracion>(
    `/administracion/transparencia/categorias/${categoriaId}/documentos`,
    {
      params: construirParametros(filtros),
    },
  )

  return respuesta.data
}

export async function obtenerDocumentoAdministracion(id: number) {
  const respuesta = await api.get<RespuestaDocumentoAdministracion>(
    `/administracion/transparencia/documentos/${id}`,
  )

  return respuesta.data
}

export async function crearDocumentoAdministracion(
  categoriaId: number,
  datos: DatosFormularioDocumentoAdministracion,
) {
  const respuesta = await api.post<RespuestaDocumentoAdministracion>(
    `/administracion/transparencia/categorias/${categoriaId}/documentos`,
    construirFormularioDocumento(datos),
  )

  return respuesta.data
}

export async function actualizarDocumentoAdministracion(
  id: number,
  datos: DatosDocumentoAdministracion,
) {
  const respuesta = await api.put<RespuestaDocumentoAdministracion>(
    `/administracion/transparencia/documentos/${id}`,
    datos,
  )

  return respuesta.data
}

export async function reemplazarArchivoDocumentoAdministracion(
  id: number,
  archivo: File,
) {
  const formulario = new FormData()
  formulario.append('archivo', archivo)

  const respuesta = await api.post<RespuestaDocumentoAdministracion>(
    `/administracion/transparencia/documentos/${id}/reemplazar-archivo`,
    formulario,
  )

  return respuesta.data
}

export async function cambiarEstadoDocumentoAdministracion(
  id: number,
  estaActivo: boolean,
) {
  const respuesta = await api.patch<RespuestaDocumentoAdministracion>(
    `/administracion/transparencia/documentos/${id}/estado`,
    { estaActivo },
  )

  return respuesta.data
}

export function obtenerUrlArchivoDocumentoAdministracion(id: number) {
  const baseUrl = api.defaults.baseURL ?? ''
  return `${baseUrl}/administracion/transparencia/documentos/${id}/archivo?modo=descargar`
}
