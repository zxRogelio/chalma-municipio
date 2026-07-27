import { Router } from "express";
import {
  actualizarDocumento,
  cambiarEstadoDocumento,
  crearDocumento,
  listarDocumentosCategoria,
  obtenerDocumento,
  reemplazarArchivoDocumento,
  servirArchivoDocumentoAdministrativo,
} from "../controllers/controladorDocumentosAdministracion.js";
import { cargarArchivoDocumento } from "../middleware/configurarCargaDocumento.js";

const rutasDocumentosAdministracion = Router();

rutasDocumentosAdministracion.get(
  "/categorias/:categoriaId/documentos",
  listarDocumentosCategoria
);
rutasDocumentosAdministracion.post(
  "/categorias/:categoriaId/documentos",
  cargarArchivoDocumento,
  crearDocumento
);
rutasDocumentosAdministracion.get("/documentos/:id", obtenerDocumento);
rutasDocumentosAdministracion.get(
  "/documentos/:id/archivo",
  servirArchivoDocumentoAdministrativo
);
rutasDocumentosAdministracion.put(
  "/documentos/:id",
  actualizarDocumento
);
rutasDocumentosAdministracion.post(
  "/documentos/:id/reemplazar-archivo",
  cargarArchivoDocumento,
  reemplazarArchivoDocumento
);
rutasDocumentosAdministracion.patch(
  "/documentos/:id/estado",
  cambiarEstadoDocumento
);

export default rutasDocumentosAdministracion;
