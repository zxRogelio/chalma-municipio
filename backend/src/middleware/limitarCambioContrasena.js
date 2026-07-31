import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const limitarCambioContrasena = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (solicitud) => {
    const claveIp = ipKeyGenerator(solicitud.ip);
    const administradorId = solicitud.administrador?.id ?? "sin-sesion";
    return `${claveIp}:${administradorId}`;
  },
  handler: (_solicitud, respuesta) =>
    respuesta.status(429).json({
      exito: false,
      mensaje:
        "Demasiados intentos. Intenta nuevamente mas tarde.",
    }),
});
