import {
  esquemaActualizarCategoria,
  esquemaCambiarEstadoCategoria,
  esquemaCrearCategoria,
  esquemaListarCategorias,
} from "../validations/validacionCategoriaAdministracion.js";
import {
  actualizarCategoriaAdministracion,
  cambiarEstadoCategoriaAdministracion,
  crearCategoriaAdministracion,
  esErrorCategoriaAdministracion,
  listarCategoriasAdministracion,
  listarSeccionesPrincipalesAdministracion,
  listarSubcategoriasAdministracion,
  obtenerCategoriaAdministracionPorId,
} from "../services/servicioCategoriasAdministracion.js";

function obtenerIdParametro(solicitud) {
  const id = Number(solicitud.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function responderDatosInvalidos(respuesta) {
  return respuesta.status(400).json({
    exito: false,
    mensaje: "Los datos proporcionados no son validos",
  });
}

function responderNoEncontrada(respuesta) {
  return respuesta.status(404).json({
    exito: false,
    mensaje: "Categoria no encontrada",
  });
}

function responderErrorControlado(respuesta, error) {
  if (esErrorCategoriaAdministracion(error)) {
    return respuesta.status(error.estado || 409).json({
      exito: false,
      mensaje:
        error.estado === 400
          ? error.message
          : "No es posible realizar esta operacion",
    });
  }

  console.error(
    "Error al administrar categoria:",
    error instanceof Error ? error.message : "Error desconocido"
  );

  return respuesta.status(500).json({
    exito: false,
    mensaje: "Ocurrio un error al administrar la categoria",
  });
}

export async function listarCategorias(solicitud, respuesta) {
  const resultado = esquemaListarCategorias.safeParse(solicitud.query);

  if (!resultado.success) {
    return responderDatosInvalidos(respuesta);
  }

  try {
    const datos = await listarCategoriasAdministracion(resultado.data);

    return respuesta.json({
      exito: true,
      cantidad: datos.length,
      datos,
    });
  } catch (error) {
    return responderErrorControlado(respuesta, error);
  }
}

export async function listarSeccionesPrincipales(_solicitud, respuesta) {
  try {
    const datos = await listarSeccionesPrincipalesAdministracion();

    return respuesta.json({
      exito: true,
      cantidad: datos.length,
      datos,
    });
  } catch (error) {
    return responderErrorControlado(respuesta, error);
  }
}

export async function listarSubcategorias(solicitud, respuesta) {
  const id = obtenerIdParametro(solicitud);

  if (!id) {
    return responderDatosInvalidos(respuesta);
  }

  try {
    const categoria = await obtenerCategoriaAdministracionPorId(id);

    if (!categoria) {
      return responderNoEncontrada(respuesta);
    }

    const datos = await listarSubcategoriasAdministracion(id);

    return respuesta.json({
      exito: true,
      cantidad: datos.length,
      datos,
    });
  } catch (error) {
    return responderErrorControlado(respuesta, error);
  }
}

export async function obtenerCategoria(solicitud, respuesta) {
  const id = obtenerIdParametro(solicitud);

  if (!id) {
    return responderDatosInvalidos(respuesta);
  }

  try {
    const datos = await obtenerCategoriaAdministracionPorId(id);

    if (!datos) {
      return responderNoEncontrada(respuesta);
    }

    return respuesta.json({
      exito: true,
      datos,
    });
  } catch (error) {
    return responderErrorControlado(respuesta, error);
  }
}

export async function crearCategoria(solicitud, respuesta) {
  const resultado = esquemaCrearCategoria.safeParse(solicitud.body);

  if (!resultado.success) {
    return responderDatosInvalidos(respuesta);
  }

  try {
    const datos = await crearCategoriaAdministracion(resultado.data);

    return respuesta.status(201).json({
      exito: true,
      mensaje: "Categoria creada correctamente",
      datos,
    });
  } catch (error) {
    return responderErrorControlado(respuesta, error);
  }
}

export async function actualizarCategoria(solicitud, respuesta) {
  const id = obtenerIdParametro(solicitud);
  const resultado = esquemaActualizarCategoria.safeParse(solicitud.body);

  if (!id || !resultado.success) {
    return responderDatosInvalidos(respuesta);
  }

  try {
    const datos = await actualizarCategoriaAdministracion(
      id,
      resultado.data
    );

    if (!datos) {
      return responderNoEncontrada(respuesta);
    }

    return respuesta.json({
      exito: true,
      mensaje: "Categoria actualizada correctamente",
      datos,
    });
  } catch (error) {
    return responderErrorControlado(respuesta, error);
  }
}

export async function cambiarEstadoCategoria(solicitud, respuesta) {
  const id = obtenerIdParametro(solicitud);
  const resultado = esquemaCambiarEstadoCategoria.safeParse(
    solicitud.body
  );

  if (!id || !resultado.success) {
    return responderDatosInvalidos(respuesta);
  }

  try {
    const resultadoEstado =
      await cambiarEstadoCategoriaAdministracion(
        id,
        resultado.data.estaActivo
      );

    if (!resultadoEstado) {
      return responderNoEncontrada(respuesta);
    }

    return respuesta.json({
      exito: true,
      mensaje: "Estado de la categoria actualizado correctamente",
      datos: resultadoEstado.categoria,
      advertencia: resultadoEstado.advertencia,
    });
  } catch (error) {
    return responderErrorControlado(respuesta, error);
  }
}
