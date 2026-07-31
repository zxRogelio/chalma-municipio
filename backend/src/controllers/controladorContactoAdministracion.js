import { esquemaActualizarContacto } from "../validations/validacionContacto.js";
import {
  actualizarConfiguracionContactoAdministracion,
  obtenerConfiguracionContactoAdministracion,
} from "../services/servicioContacto.js";

function responderDatosInvalidos(respuesta, mensaje) {
  return respuesta.status(400).json({
    exito: false,
    mensaje: mensaje || "Los datos proporcionados no son validos",
  });
}

function responderError(respuesta, error) {
  console.error(
    "Error al administrar la configuracion de contacto:",
    error instanceof Error ? error.message : "Error desconocido"
  );

  return respuesta.status(500).json({
    exito: false,
    mensaje:
      "Ocurrio un error al administrar la configuracion de contacto",
  });
}

export async function consultarConfiguracionContacto(
  _solicitud,
  respuesta
) {
  try {
    const datos = await obtenerConfiguracionContactoAdministracion();
    return respuesta.json(datos);
  } catch (error) {
    return responderError(respuesta, error);
  }
}

export async function actualizarConfiguracionContacto(
  solicitud,
  respuesta
) {
  const resultado = esquemaActualizarContacto.safeParse(solicitud.body);

  if (!resultado.success) {
    return responderDatosInvalidos(
      respuesta,
      resultado.error.issues[0]?.message
    );
  }

  try {
    const datos = await actualizarConfiguracionContactoAdministracion(
      resultado.data
    );

    return respuesta.json({
      ...datos,
      mensaje: "Configuracion de contacto actualizada correctamente",
    });
  } catch (error) {
    return responderError(respuesta, error);
  }
}
