import { Router } from "express";
import {
  consultarDirectorioPublico,
} from "../controllers/controladorDirectorioPublico.js";

const rutasDirectorioPublico = Router();

rutasDirectorioPublico.get("/", consultarDirectorioPublico);

export default rutasDirectorioPublico;
