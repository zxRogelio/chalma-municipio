import { Router } from "express";
import {
  consultarContactoPublico,
} from "../controllers/controladorContactoPublico.js";

const rutasContactoPublico = Router();

rutasContactoPublico.get("/", consultarContactoPublico);

export default rutasContactoPublico;
