import { Router } from "express";
import {
  actualizarOrganigrama,
  consultarOrganigrama,
  reemplazarArchivoOrganigrama,
  servirArchivoOrganigramaAdministracion,
} from "../controllers/controladorOrganigramaAdministracion.js";
import {
  cargarArchivoOrganigrama,
} from "../middleware/configurarCargaOrganigrama.js";

const rutasOrganigramaAdministracion = Router();

rutasOrganigramaAdministracion.get("/", consultarOrganigrama);
rutasOrganigramaAdministracion.put("/", actualizarOrganigrama);
rutasOrganigramaAdministracion.get(
  "/archivo",
  servirArchivoOrganigramaAdministracion
);
rutasOrganigramaAdministracion.post(
  "/archivo",
  cargarArchivoOrganigrama,
  reemplazarArchivoOrganigrama
);

export default rutasOrganigramaAdministracion;
