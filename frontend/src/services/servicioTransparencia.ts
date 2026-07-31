import api from './api'
import type {
  CategoriaPublicaTransparencia,
  CategoriaTransparencia,
  CategoriaTransparenciaRespuesta,
  DocumentoTransparencia,
  FiltrosDocumentosTransparencia,
  OpcionesConsultaApi,
  RespuestaApi,
} from '../types/transparencia'

function normalizarDocumento(
  documento: DocumentoTransparencia,
): DocumentoTransparencia {
  return {
    ...documento,
    descripcion: documento.descripcion ?? null,
    tipoMime: documento.tipoMime ?? null,
    nombreOriginal: documento.nombreOriginal ?? null,
    urlPublica: documento.urlPublica ?? null,
    tamanoBytes: documento.tamanoBytes ?? null,
    fechaPublicacion: documento.fechaPublicacion ?? null,
  }
}

function normalizarResumenCategoria(
  categoria: CategoriaTransparenciaRespuesta,
) {
  return {
    id: categoria.id,
    categoriaPadreId: categoria.categoriaPadreId ?? null,
    titulo: categoria.titulo,
    slug: categoria.slug,
    descripcion: categoria.descripcion ?? null,
    fundamentoLegal: categoria.fundamentoLegal ?? null,
    tipoSeccion: categoria.tipoSeccion,
    orden: categoria.orden,
    estaActivo: categoria.estaActivo,
    cantidadDocumentos: categoria.cantidadDocumentos ?? 0,
  }
}

function normalizarCategoriaPublica(
  datos: CategoriaPublicaTransparencia,
): CategoriaPublicaTransparencia {
  return {
    categoria: normalizarResumenCategoria(datos.categoria),
    categoriaPadre: datos.categoriaPadre
      ? normalizarResumenCategoria(datos.categoriaPadre)
      : null,
    breadcrumbs: datos.breadcrumbs.map(normalizarResumenCategoria),
    subcategorias: datos.subcategorias.map(normalizarResumenCategoria),
    documentos: datos.documentos.map(normalizarDocumento),
  }
}

function normalizarCategoria(
  categoria: CategoriaTransparenciaRespuesta,
): CategoriaTransparencia {
  const documentos = categoria.documentos?.map(normalizarDocumento)
  const categoriasHijas = categoria.categoriasHijas?.map(normalizarCategoria)

  return {
    ...categoria,
    categoriaPadreId: categoria.categoriaPadreId ?? null,
    descripcion: categoria.descripcion ?? null,
    fundamentoLegal: categoria.fundamentoLegal ?? null,
    cantidadDocumentos: categoria.cantidadDocumentos ?? documentos?.length ?? 0,
    categoriaPadre: categoria.categoriaPadre ?? undefined,
    categoriasHijas,
    documentos,
  }
}

export async function obtenerSeccionesTransparencia(
  opciones: OpcionesConsultaApi = {},
) {
  const respuesta = await api.get<
    RespuestaApi<CategoriaTransparenciaRespuesta[]>
  >('/transparencia/secciones', {
    signal: opciones.signal,
  })

  return respuesta.data.datos.map(normalizarCategoria)
}

export async function obtenerSeccionPorSlug(
  slug: string,
  opciones: OpcionesConsultaApi = {},
) {
  const respuesta = await api.get<RespuestaApi<CategoriaTransparenciaRespuesta>>(
    `/transparencia/secciones/${slug}`,
    {
      signal: opciones.signal,
    },
  )

  return normalizarCategoria(respuesta.data.datos)
}

export async function obtenerCategoriaPorSlug(
  slug: string,
  opciones: OpcionesConsultaApi = {},
) {
  const respuesta = await api.get<RespuestaApi<CategoriaTransparenciaRespuesta>>(
    `/transparencia/categorias/${slug}`,
    {
      signal: opciones.signal,
    },
  )

  return normalizarCategoria(respuesta.data.datos)
}

export async function obtenerCategoriaPublicaPorSlug(
  slug: string,
  opciones: OpcionesConsultaApi = {},
) {
  const respuesta = await api.get<RespuestaApi<CategoriaPublicaTransparencia>>(
    `/transparencia/categorias/slug/${slug}`,
    {
      signal: opciones.signal,
    },
  )

  return normalizarCategoriaPublica(respuesta.data.datos)
}

export async function obtenerDocumentosPorCategoria(
  slug: string,
  filtros: FiltrosDocumentosTransparencia = {},
  opciones: OpcionesConsultaApi = {},
) {
  const respuesta = await api.get<RespuestaApi<DocumentoTransparencia[]>>(
    `/transparencia/categorias/${slug}/documentos`,
    {
      params: filtros,
      signal: opciones.signal,
    },
  )

  return respuesta.data.datos.map(normalizarDocumento)
}
