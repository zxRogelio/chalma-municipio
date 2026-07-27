import { Router } from "express";
import {
  actualizarCategoria,
  cambiarEstadoCategoria,
  crearCategoria,
  listarCategorias,
  obtenerCategoria,
} from "../controllers/controladorCategoriasAdministracion.js";

const rutasCategoriasAdministracion = Router();

rutasCategoriasAdministracion.get("/", listarCategorias);
rutasCategoriasAdministracion.get("/:id", obtenerCategoria);
rutasCategoriasAdministracion.post("/", crearCategoria);
rutasCategoriasAdministracion.put("/:id", actualizarCategoria);
rutasCategoriasAdministracion.patch(
  "/:id/estado",
  cambiarEstadoCategoria
);

export default rutasCategoriasAdministracion;
