import { Router } from "express";
import {
  consultarOrganigramaPublico,
  servirArchivoOrganigramaPublico,
} from "../controllers/controladorOrganigramaPublico.js";

const rutasOrganigramaPublico = Router();

rutasOrganigramaPublico.get("/", consultarOrganigramaPublico);
rutasOrganigramaPublico.get("/archivo", servirArchivoOrganigramaPublico);

export default rutasOrganigramaPublico;
