import { Router } from "express";
import {
  cambiarContrasena,
} from "../controllers/controladorCuentaAdministracion.js";
import {
  limitarCambioContrasena,
} from "../middleware/limitarCambioContrasena.js";

const rutasCuentaAdministracion = Router();

rutasCuentaAdministracion.put(
  "/contrasena",
  limitarCambioContrasena,
  cambiarContrasena
);

export default rutasCuentaAdministracion;
