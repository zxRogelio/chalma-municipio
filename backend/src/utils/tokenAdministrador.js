import jwt from "jsonwebtoken";
import { configuracionEntorno } from "../config/configuracionEntorno.js";
import {
  obtenerNombreCookieAdministrador,
  obtenerOpcionesBorradoCookieAdministrador,
  obtenerOpcionesCookieAdministrador,
} from "../config/opcionesCookieAdministrador.js";

export function obtenerNombreCookie() {
  return obtenerNombreCookieAdministrador();
}

export function generarTokenAdministrador(administrador) {
  const payload = {
    sub: String(administrador.id),
    rol: administrador.rol,
    tipo: "administrador",
    versionSesion: Number(administrador.versionSesion) || 0,
  };

  return jwt.sign(payload, configuracionEntorno.jwtSecret, {
    expiresIn: configuracionEntorno.jwtExpiresIn,
  });
}

export function verificarTokenAdministrador(token) {
  const payload = jwt.verify(token, configuracionEntorno.jwtSecret);

  if (
    !payload ||
    typeof payload !== "object" ||
    payload.tipo !== "administrador" ||
    !payload.sub ||
    !Number.isInteger(payload.versionSesion)
  ) {
    throw new Error("Token no valido");
  }

  return {
    sub: String(payload.sub),
    rol: typeof payload.rol === "string" ? payload.rol : undefined,
    tipo: "administrador",
    versionSesion: payload.versionSesion,
  };
}

export function obtenerOpcionesCookie() {
  return obtenerOpcionesCookieAdministrador();
}

export function obtenerOpcionesParaBorrarCookie() {
  return obtenerOpcionesBorradoCookieAdministrador();
}
