import {
  buscarAdministradorPorId,
  convertirAdministradorSeguro,
} from "../services/servicioAutenticacion.js";
import {
  obtenerNombreCookie,
  obtenerOpcionesParaBorrarCookie,
  verificarTokenAdministrador,
} from "../utils/tokenAdministrador.js";

function responderSesionNoValida(respuesta, limpiarCookie = false) {
  if (limpiarCookie) {
    respuesta.clearCookie(
      obtenerNombreCookie(),
      obtenerOpcionesParaBorrarCookie()
    );
  }

  return respuesta.status(401).json({
    exito: false,
    mensaje: "Sesion no valida",
  });
}

export async function requerirAdministrador(
  solicitud,
  respuesta,
  siguiente
) {
  const token = solicitud.cookies?.[obtenerNombreCookie()];

  if (!token) {
    return responderSesionNoValida(respuesta);
  }

  try {
    const payload = verificarTokenAdministrador(token);
    const administrador = await buscarAdministradorPorId(payload.sub);

    if (!administrador || !administrador.estaActivo) {
      return responderSesionNoValida(respuesta, true);
    }

    if (
      Number(administrador.versionSesion) !== Number(payload.versionSesion)
    ) {
      return responderSesionNoValida(respuesta, true);
    }

    solicitud.administrador =
      convertirAdministradorSeguro(administrador);
    return siguiente();
  } catch {
    return responderSesionNoValida(respuesta, true);
  }
}
