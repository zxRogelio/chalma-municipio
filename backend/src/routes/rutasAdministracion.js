import { Router } from "express";
import {
  listarSeccionesPrincipales,
} from "../controllers/controladorCategoriasAdministracion.js";
import rutasCategoriasAdministracion from "./rutasCategoriasAdministracion.js";
import rutasDocumentosAdministracion from "./rutasDocumentosAdministracion.js";

const rutasAdministracion = Router();

rutasAdministracion.get("/resumen", (solicitud, respuesta) => {
  respuesta.json({
    exito: true,
    datos: {
      administrador: solicitud.administrador,
      mensaje: "Panel administrativo disponible",
    },
  });
});

rutasAdministracion.get(
  "/transparencia/secciones",
  listarSeccionesPrincipales
);

rutasAdministracion.use(
  "/transparencia",
  rutasDocumentosAdministracion
);

rutasAdministracion.use(
  "/transparencia/categorias",
  rutasCategoriasAdministracion
);

export default rutasAdministracion;
