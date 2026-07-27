import jwt from "jsonwebtoken";

export function obtenerNombreCookie() {
  return process.env.COOKIE_NAME || "chalma_admin_sesion";
}

function obtenerJwtSecret() {
  const secreto = process.env.JWT_SECRET;

  if (!secreto || secreto.length < 32) {
    throw new Error("La configuracion de JWT no es valida");
  }

  return secreto;
}

export function generarTokenAdministrador(administrador) {
  const payload = {
    sub: String(administrador.id),
    rol: administrador.rol,
    tipo: "administrador",
  };

  return jwt.sign(payload, obtenerJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || "8h",
  });
}

export function verificarTokenAdministrador(token) {
  const payload = jwt.verify(token, obtenerJwtSecret());

  if (
    !payload ||
    typeof payload !== "object" ||
    payload.tipo !== "administrador" ||
    !payload.sub
  ) {
    throw new Error("Token no valido");
  }

  return {
    sub: String(payload.sub),
    rol: typeof payload.rol === "string" ? payload.rol : undefined,
    tipo: "administrador",
  };
}

export function obtenerOpcionesCookie() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 8 * 60 * 60 * 1000,
  };
}

export function obtenerOpcionesParaBorrarCookie() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  };
}
