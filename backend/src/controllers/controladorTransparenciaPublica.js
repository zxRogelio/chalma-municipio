import {
  obtenerCategoriaPorSlug,
  obtenerDocumentosPorCategoria,
  obtenerSeccionPorSlug,
  obtenerSeccionesActivas,
} from "../services/servicioTransparencia.js";

const expresionSlug = /^[a-z0-9-]+$/;
const expresionEjercicio = /^\d{4}$/;

function parametrosInvalidos(respuesta) {
  return respuesta.status(400).json({
    exito: false,
    mensaje: "Los parametros proporcionados no son validos",
  });
}

function ocurrioError(respuesta) {
  return respuesta.status(500).json({
    exito: false,
    mensaje: "Ocurrio un error al consultar la informacion",
  });
}

function slugEsValido(slug) {
  return typeof slug === "string" && expresionSlug.test(slug);
}

function filtrosSonValidos(consulta) {
  const { ejercicio, periodo } = consulta;

  if (ejercicio && !expresionEjercicio.test(String(ejercicio))) {
    return false;
  }

  if (periodo && typeof periodo !== "string") {
    return false;
  }

  return true;
}

export async function listarSecciones(_solicitud, respuesta) {
  try {
    const datos = await obtenerSeccionesActivas();

    return respuesta.json({
      exito: true,
      cantidad: datos.length,
      datos,
    });
  } catch (error) {
    console.error(error);
    return ocurrioError(respuesta);
  }
}

export async function consultarSeccion(solicitud, respuesta) {
  const { slug } = solicitud.params;

  if (!slugEsValido(slug)) {
    return parametrosInvalidos(respuesta);
  }

  try {
    const datos = await obtenerSeccionPorSlug(slug);

    if (!datos) {
      return respuesta.status(404).json({
        exito: false,
        mensaje: "Categoria no encontrada",
      });
    }

    return respuesta.json({
      exito: true,
      datos,
    });
  } catch (error) {
    console.error(error);
    return ocurrioError(respuesta);
  }
}

export async function consultarCategoria(solicitud, respuesta) {
  const { slug } = solicitud.params;

  if (!slugEsValido(slug)) {
    return parametrosInvalidos(respuesta);
  }

  try {
    const datos = await obtenerCategoriaPorSlug(slug);

    if (!datos) {
      return respuesta.status(404).json({
        exito: false,
        mensaje: "Categoria no encontrada",
      });
    }

    return respuesta.json({
      exito: true,
      datos,
    });
  } catch (error) {
    console.error(error);
    return ocurrioError(respuesta);
  }
}

export async function listarDocumentosDeCategoria(
  solicitud,
  respuesta
) {
  const { slug } = solicitud.params;
  const { ejercicio, periodo } = solicitud.query;

  if (!slugEsValido(slug) || !filtrosSonValidos(solicitud.query)) {
    return parametrosInvalidos(respuesta);
  }

  try {
    const resultado = await obtenerDocumentosPorCategoria(slug, {
      ejercicio,
      periodo,
    });

    if (!resultado) {
      return respuesta.status(404).json({
        exito: false,
        mensaje: "Categoria no encontrada",
      });
    }

    return respuesta.json({
      exito: true,
      cantidad: resultado.documentos.length,
      datos: resultado.documentos,
    });
  } catch (error) {
    console.error(error);
    return ocurrioError(respuesta);
  }
}
