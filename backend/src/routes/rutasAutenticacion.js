import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  cerrarSesion,
  consultarSesion,
  iniciarSesion,
} from "../controllers/controladorAutenticacion.js";
import { requerirAdministrador } from "../middleware/requerirAdministrador.js";

const rutasAutenticacion = Router();

const limitarInicioSesion = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_solicitud, respuesta) =>
    respuesta.status(429).json({
      exito: false,
      mensaje: "Demasiados intentos. Intenta nuevamente mas tarde",
    }),
});

rutasAutenticacion.post(
  "/iniciar-sesion",
  limitarInicioSesion,
  iniciarSesion
);
rutasAutenticacion.get(
  "/sesion",
  requerirAdministrador,
  consultarSesion
);
rutasAutenticacion.post("/cerrar-sesion", cerrarSesion);

export default rutasAutenticacion;
