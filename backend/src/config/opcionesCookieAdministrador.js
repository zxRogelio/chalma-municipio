import { configuracionEntorno } from "./configuracionEntorno.js";

const duraciones = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
};

function convertirDuracionMilisegundos(valor) {
  const texto = String(valor || "").trim().toLowerCase();
  const coincidencia = texto.match(/^(\d+)([smhd])$/);

  if (coincidencia) {
    const cantidad = Number(coincidencia[1]);
    const unidad = coincidencia[2];
    return cantidad * duraciones[unidad];
  }

  const segundos = Number(texto);

  if (Number.isFinite(segundos) && segundos > 0) {
    return segundos * 1000;
  }

  return 8 * 60 * 60 * 1000;
}

function obtenerOpcionesBaseCookieAdministrador() {
  const opciones = {
    httpOnly: true,
    secure: configuracionEntorno.cookieSecure,
    sameSite: configuracionEntorno.cookieSameSite,
    path: "/",
  };

  if (configuracionEntorno.cookieDomain) {
    opciones.domain = configuracionEntorno.cookieDomain;
  }

  return opciones;
}

export function obtenerNombreCookieAdministrador() {
  return configuracionEntorno.cookieName;
}

export function obtenerOpcionesCookieAdministrador() {
  return {
    ...obtenerOpcionesBaseCookieAdministrador(),
    maxAge: convertirDuracionMilisegundos(
      configuracionEntorno.jwtExpiresIn
    ),
  };
}

export function obtenerOpcionesBorradoCookieAdministrador() {
  return obtenerOpcionesBaseCookieAdministrador();
}
