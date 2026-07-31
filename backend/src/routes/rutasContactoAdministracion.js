import { Router } from "express";
import {
  actualizarConfiguracionContacto,
  consultarConfiguracionContacto,
} from "../controllers/controladorContactoAdministracion.js";

const rutasContactoAdministracion = Router();

rutasContactoAdministracion.get("/", consultarConfiguracionContacto);
rutasContactoAdministracion.put("/", actualizarConfiguracionContacto);

export default rutasContactoAdministracion;
