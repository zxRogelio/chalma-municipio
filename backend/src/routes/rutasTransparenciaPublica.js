import { Router } from "express";
import {
  consultarCategoria,
  consultarSeccion,
  listarDocumentosDeCategoria,
  listarSecciones,
} from "../controllers/controladorTransparenciaPublica.js";

const rutasTransparenciaPublica = Router();

rutasTransparenciaPublica.get("/secciones", listarSecciones);
rutasTransparenciaPublica.get("/secciones/:slug", consultarSeccion);
rutasTransparenciaPublica.get("/categorias/:slug", consultarCategoria);
rutasTransparenciaPublica.get(
  "/categorias/:slug/documentos",
  listarDocumentosDeCategoria
);

export default rutasTransparenciaPublica;
