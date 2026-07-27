import { createReadStream } from "node:fs";
import path from "node:path";
import {
  esquemaActualizarDocumento,
  esquemaCambiarEstadoDocumento,
  esquemaCrearDocumento,
  esquemaListarDocumentos,
  validarIdParametro,
} from "../validations/validacionDocumentoAdministracion.js";
import {
  actualizarDocumentoAdministracion,
  cambiarEstadoDocumentoAdministracion,
  crearDocumentoAdministracion,
  esErrorDocumentoAdministracion,
  listarDocumentosAdministracion,
  obtenerArchivoDocumentoAdministrativo,
  obtenerArchivoDocumentoActivo,
  obtenerDocumentoAdministracionPorId,
  reemplazarArchivoDocumentoAdministracion,
} from "../services/servicioDocumentosAdministracion.js";

function responderDatosInvalidos(respuesta) {
  return respuesta.status(400).json({
    exito: false,
    mensaje: "Los datos proporcionados no son validos.",
  });
}

function responderDocumentoNoEncontrado(respuesta) {
  return respuesta.status(404).json({
    exito: false,
    mensaje: "Documento no encontrado.",
  });
}

function responderErrorControlado(respuesta, error, mensajeGeneral) {
  if (esErrorDocumentoAdministracion(error)) {
    return respuesta.status(error.estado || 400).json({
      exito: false,
      mensaje: error.message,
    });
  }

  console.error(
    mensajeGeneral,
    error instanceof Error ? error.message : "Error desconocido"
  );

  return respuesta.status(500).json({
    exito: false,
    mensaje: mensajeGeneral,
  });
}

function obtenerIdDocumento(solicitud) {
  return validarIdParametro(solicitud.params.id);
}

function obtenerIdCategoria(solicitud) {
  return validarIdParametro(solicitud.params.categoriaId);
}

function obtenerNombreDescarga(nombreOriginal) {
  return path
    .basename(nombreOriginal || "documento")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, "_")
    .replace(/[\r\n"]/g, "")
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, "_")
    .slice(0, 180);
}

function obtenerModoArchivo(solicitud) {
  const modo = solicitud.query.modo;

  if (modo !== "descargar") {
    return null;
  }

  return modo;
}

export async function listarDocumentosCategoria(solicitud, respuesta) {
  const categoriaId = obtenerIdCategoria(solicitud);
  const resultado = esquemaListarDocumentos.safeParse(solicitud.query);

  if (!categoriaId || !resultado.success) {
    return responderDatosInvalidos(respuesta);
  }

  try {
    const datos = await listarDocumentosAdministracion(
      categoriaId,
      resultado.data
    );

    if (!datos) {
      return respuesta.status(404).json({
        exito: false,
        mensaje: "Categoria no encontrada.",
      });
    }

    return respuesta.json({
      exito: true,
      cantidad: datos.length,
      datos,
    });
  } catch (error) {
    return responderErrorControlado(
      respuesta,
      error,
      "No fue posible cargar los documentos."
    );
  }
}

export async function obtenerDocumento(solicitud, respuesta) {
  const id = obtenerIdDocumento(solicitud);

  if (!id) {
    return responderDatosInvalidos(respuesta);
  }

  try {
    const datos = await obtenerDocumentoAdministracionPorId(id);

    if (!datos) {
      return responderDocumentoNoEncontrado(respuesta);
    }

    return respuesta.json({
      exito: true,
      datos,
    });
  } catch (error) {
    return responderErrorControlado(
      respuesta,
      error,
      "No fue posible cargar los documentos."
    );
  }
}

export async function crearDocumento(solicitud, respuesta) {
  const categoriaId = obtenerIdCategoria(solicitud);
  const resultado = esquemaCrearDocumento.safeParse(solicitud.body);

  if (!categoriaId || !resultado.success) {
    return responderDatosInvalidos(respuesta);
  }

  if (!solicitud.file) {
    return respuesta.status(400).json({
      exito: false,
      mensaje: "El archivo no es valido.",
    });
  }

  try {
    const datos = await crearDocumentoAdministracion(
      categoriaId,
      resultado.data,
      solicitud.file
    );

    return respuesta.status(201).json({
      exito: true,
      mensaje: "Documento publicado correctamente",
      datos,
    });
  } catch (error) {
    return responderErrorControlado(
      respuesta,
      error,
      "No fue posible publicar el documento."
    );
  }
}

export async function actualizarDocumento(solicitud, respuesta) {
  const id = obtenerIdDocumento(solicitud);
  const resultado = esquemaActualizarDocumento.safeParse(solicitud.body);

  if (!id || !resultado.success) {
    return responderDatosInvalidos(respuesta);
  }

  try {
    const datos = await actualizarDocumentoAdministracion(
      id,
      resultado.data
    );

    if (!datos) {
      return responderDocumentoNoEncontrado(respuesta);
    }

    return respuesta.json({
      exito: true,
      mensaje: "Documento actualizado correctamente",
      datos,
    });
  } catch (error) {
    return responderErrorControlado(
      respuesta,
      error,
      "No fue posible actualizar el documento."
    );
  }
}

export async function reemplazarArchivoDocumento(solicitud, respuesta) {
  const id = obtenerIdDocumento(solicitud);

  if (!id) {
    return responderDatosInvalidos(respuesta);
  }

  if (!solicitud.file) {
    return respuesta.status(400).json({
      exito: false,
      mensaje: "El archivo no es valido.",
    });
  }

  try {
    const datos = await reemplazarArchivoDocumentoAdministracion(
      id,
      solicitud.file
    );

    return respuesta.json({
      exito: true,
      mensaje: "Archivo reemplazado correctamente",
      datos,
    });
  } catch (error) {
    return responderErrorControlado(
      respuesta,
      error,
      "No fue posible reemplazar el archivo."
    );
  }
}

export async function cambiarEstadoDocumento(solicitud, respuesta) {
  const id = obtenerIdDocumento(solicitud);
  const resultado = esquemaCambiarEstadoDocumento.safeParse(
    solicitud.body
  );

  if (!id || !resultado.success) {
    return responderDatosInvalidos(respuesta);
  }

  try {
    const datos = await cambiarEstadoDocumentoAdministracion(
      id,
      resultado.data.estaActivo
    );

    if (!datos) {
      return responderDocumentoNoEncontrado(respuesta);
    }

    return respuesta.json({
      exito: true,
      mensaje: "Estado del documento actualizado correctamente",
      datos,
    });
  } catch (error) {
    return responderErrorControlado(
      respuesta,
      error,
      "No fue posible actualizar el documento."
    );
  }
}

export async function servirArchivoDocumentoPublico(solicitud, respuesta) {
  const id = obtenerIdDocumento(solicitud);
  const modo = obtenerModoArchivo(solicitud);

  if (!id || !modo) {
    return responderDatosInvalidos(respuesta);
  }

  try {
    const archivo = await obtenerArchivoDocumentoActivo(id);

    if (!archivo) {
      return responderDocumentoNoEncontrado(respuesta);
    }

    const nombreDescarga = obtenerNombreDescarga(
      archivo.nombreOriginal
    );

    respuesta.setHeader("Content-Type", archivo.tipoMime);
    respuesta.setHeader(
      "Content-Disposition",
      `attachment; filename="${nombreDescarga}"`
    );

    const flujo = createReadStream(archivo.rutaFisica);

    flujo.on("error", () => {
      if (!respuesta.headersSent) {
        respuesta.status(404).json({
          exito: false,
          mensaje: "Documento no encontrado.",
        });
        return;
      }

      respuesta.destroy();
    });

    flujo.pipe(respuesta);
  } catch (error) {
    return responderErrorControlado(
      respuesta,
      error,
      "No fue posible cargar los documentos."
    );
  }
}

export async function servirArchivoDocumentoAdministrativo(
  solicitud,
  respuesta
) {
  const id = obtenerIdDocumento(solicitud);

  if (!id) {
    return responderDatosInvalidos(respuesta);
  }

  try {
    const archivo = await obtenerArchivoDocumentoAdministrativo(id);

    if (!archivo) {
      return responderDocumentoNoEncontrado(respuesta);
    }

    const nombreDescarga = obtenerNombreDescarga(
      archivo.nombreOriginal
    );

    respuesta.setHeader("Content-Type", archivo.tipoMime);
    respuesta.setHeader(
      "Content-Disposition",
      `attachment; filename="${nombreDescarga}"`
    );

    const flujo = createReadStream(archivo.rutaFisica);

    flujo.on("error", () => {
      if (!respuesta.headersSent) {
        respuesta.status(404).json({
          exito: false,
          mensaje: "Documento no encontrado.",
        });
        return;
      }

      respuesta.destroy();
    });

    flujo.pipe(respuesta);
  } catch (error) {
    return responderErrorControlado(
      respuesta,
      error,
      "No fue posible cargar los documentos."
    );
  }
}
