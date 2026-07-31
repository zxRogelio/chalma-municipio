import {
  esquemaActualizarDirectorio,
  esquemaCambiarEstadoDirectorio,
  esquemaCrearDirectorio,
} from "../validations/validacionDirectorio.js";
import {
  actualizarRegistroDirectorio,
  cambiarEstadoRegistroDirectorio,
  crearRegistroDirectorio,
  listarDirectorioAdministracion,
} from "../services/servicioDirectorio.js";

function obtenerIdParametro(solicitud) {
  const id = Number(solicitud.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function responderDatosInvalidos(respuesta, mensaje) {
  return respuesta.status(400).json({
    exito: false,
    mensaje: mensaje || "Los datos proporcionados no son validos",
  });
}

function responderNoEncontrado(respuesta) {
  return respuesta.status(404).json({
    exito: false,
    mensaje: "Registro de directorio no encontrado",
  });
}

function responderError(respuesta, error) {
  console.error(
    "Error al administrar directorio:",
    error instanceof Error ? error.message : "Error desconocido"
  );

  return respuesta.status(500).json({
    exito: false,
    mensaje: "Ocurrio un error al administrar el directorio",
  });
}

export async function listarDirectorio(_solicitud, respuesta) {
  try {
    const datos = await listarDirectorioAdministracion();

    return respuesta.json({
      exito: true,
      cantidad: datos.length,
      datos,
    });
  } catch (error) {
    return responderError(respuesta, error);
  }
}

export async function crearRegistro(solicitud, respuesta) {
  const resultado = esquemaCrearDirectorio.safeParse(solicitud.body);

  if (!resultado.success) {
    return responderDatosInvalidos(
      respuesta,
      resultado.error.issues[0]?.message
    );
  }

  try {
    const datos = await crearRegistroDirectorio(resultado.data);

    return respuesta.status(201).json({
      exito: true,
      mensaje: "Registro creado correctamente",
      datos,
    });
  } catch (error) {
    return responderError(respuesta, error);
  }
}

export async function actualizarRegistro(solicitud, respuesta) {
  const id = obtenerIdParametro(solicitud);
  const resultado = esquemaActualizarDirectorio.safeParse(solicitud.body);

  if (!id || !resultado.success) {
    return responderDatosInvalidos(
      respuesta,
      resultado.error?.issues[0]?.message
    );
  }

  try {
    const datos = await actualizarRegistroDirectorio(id, resultado.data);

    if (!datos) {
      return responderNoEncontrado(respuesta);
    }

    return respuesta.json({
      exito: true,
      mensaje: "Registro actualizado correctamente",
      datos,
    });
  } catch (error) {
    return responderError(respuesta, error);
  }
}

export async function cambiarEstadoRegistro(solicitud, respuesta) {
  const id = obtenerIdParametro(solicitud);
  const resultado = esquemaCambiarEstadoDirectorio.safeParse(
    solicitud.body
  );

  if (!id || !resultado.success) {
    return responderDatosInvalidos(respuesta);
  }

  try {
    const datos = await cambiarEstadoRegistroDirectorio(
      id,
      resultado.data.estaActivo
    );

    if (!datos) {
      return responderNoEncontrado(respuesta);
    }

    return respuesta.json({
      exito: true,
      mensaje: "Estado del registro actualizado correctamente",
      datos,
    });
  } catch (error) {
    return responderError(respuesta, error);
  }
}
