import { z } from "zod";
import {
  actualizarUltimoAcceso,
  convertirAdministradorSeguro,
  validarCredenciales,
} from "../services/servicioAutenticacion.js";
import {
  generarTokenAdministrador,
  obtenerNombreCookie,
  obtenerOpcionesCookie,
  obtenerOpcionesParaBorrarCookie,
} from "../utils/tokenAdministrador.js";

const esquemaInicioSesion = z.object({
  nombreUsuario: z
    .string()
    .trim()
    .min(4)
    .max(50)
    .regex(/^[a-zA-Z0-9._-]+$/),
  contrasena: z.string().min(1).max(200),
});

function responderDatosInvalidos(respuesta) {
  return respuesta.status(400).json({
    exito: false,
    mensaje: "Los datos proporcionados no son validos",
  });
}

export async function iniciarSesion(solicitud, respuesta) {
  const resultado = esquemaInicioSesion.safeParse(solicitud.body);

  if (!resultado.success) {
    return responderDatosInvalidos(respuesta);
  }

  const nombreUsuario = resultado.data.nombreUsuario
    .trim()
    .toLowerCase();

  try {
    const administrador = await validarCredenciales(
      nombreUsuario,
      resultado.data.contrasena
    );

    if (!administrador) {
      return respuesta.status(401).json({
        exito: false,
        mensaje: "Usuario o contrasena incorrectos",
      });
    }

    await actualizarUltimoAcceso(administrador);
    const token = generarTokenAdministrador(administrador);

    respuesta.cookie(
      obtenerNombreCookie(),
      token,
      obtenerOpcionesCookie()
    );

    return respuesta.json({
      exito: true,
      datos: {
        administrador: convertirAdministradorSeguro(administrador),
      },
    });
  } catch (error) {
    console.error(
      "No fue posible iniciar sesion administrativa:",
      error instanceof Error ? error.message : "Error desconocido"
    );

    return respuesta.status(500).json({
      exito: false,
      mensaje: "No fue posible iniciar sesion",
    });
  }
}

export function consultarSesion(solicitud, respuesta) {
  return respuesta.json({
    exito: true,
    datos: {
      administrador: solicitud.administrador,
    },
  });
}

export function cerrarSesion(_solicitud, respuesta) {
  respuesta.clearCookie(
    obtenerNombreCookie(),
    obtenerOpcionesParaBorrarCookie()
  );

  return respuesta.json({
    exito: true,
    mensaje: "Sesion cerrada correctamente",
  });
}
