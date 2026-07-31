import { Router } from "express";
import {
  actualizarRegistro,
  cambiarEstadoRegistro,
  crearRegistro,
  listarDirectorio,
} from "../controllers/controladorDirectorioAdministracion.js";

const rutasDirectorioAdministracion = Router();

rutasDirectorioAdministracion.get("/", listarDirectorio);
rutasDirectorioAdministracion.post("/", crearRegistro);
rutasDirectorioAdministracion.put("/:id", actualizarRegistro);
rutasDirectorioAdministracion.patch("/:id/estado", cambiarEstadoRegistro);

export default rutasDirectorioAdministracion;
