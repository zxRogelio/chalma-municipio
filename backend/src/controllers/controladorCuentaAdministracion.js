import {
  obtenerNombreCookie,
  obtenerOpcionesParaBorrarCookie,
} from "../utils/tokenAdministrador.js";
import { esquemaCambiarContrasena } from "../validations/validacionCuentaAdministracion.js";
import {
  cambiarContrasenaAdministrador,
  esErrorCuentaAdministracion,
} from "../services/servicioCuentaAdministracion.js";

function responderDatosInvalidos(respuesta, mensaje) {
  return respuesta.status(400).json({
    exito: false,
    mensaje: mensaje || "Los datos proporcionados no son validos",
  });
}

function responderError(respuesta, error) {
  if (esErrorCuentaAdministracion(error)) {
    return respuesta.status(error.estado || 400).json({
      exito: false,
      mensaje: error.message,
    });
  }

  console.error(
    "Error al actualizar la contrasena administrativa:",
    error instanceof Error ? error.message : "Error desconocido"
  );

  return respuesta.status(500).json({
    exito: false,
    mensaje: "Ocurrio un error al actualizar la contrasena",
  });
}

export async function cambiarContrasena(solicitud, respuesta) {
  const resultado = esquemaCambiarContrasena.safeParse(solicitud.body);

  if (!resultado.success) {
    return responderDatosInvalidos(
      respuesta,
      resultado.error.issues[0]?.message
    );
  }

  try {
    const administradorId = solicitud.administrador?.id;

    if (!administradorId) {
      return respuesta.status(401).json({
        exito: false,
        mensaje: "Sesion no valida",
      });
    }

    await cambiarContrasenaAdministrador(
      administradorId,
      resultado.data
    );

    respuesta.clearCookie(
      obtenerNombreCookie(),
      obtenerOpcionesParaBorrarCookie()
    );

    return respuesta.json({
      exito: true,
      mensaje:
        "La contrasena se actualizo correctamente. Inicia sesion nuevamente.",
    });
  } catch (error) {
    return responderError(respuesta, error);
  }
}
