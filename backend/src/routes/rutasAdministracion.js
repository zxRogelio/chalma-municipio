import { Router } from "express";
import {
  listarSeccionesPrincipales,
} from "../controllers/controladorCategoriasAdministracion.js";
import rutasCategoriasAdministracion from "./rutasCategoriasAdministracion.js";
import rutasContactoAdministracion from "./rutasContactoAdministracion.js";
import rutasCuentaAdministracion from "./rutasCuentaAdministracion.js";
import rutasDirectorioAdministracion from "./rutasDirectorioAdministracion.js";
import rutasDocumentosAdministracion from "./rutasDocumentosAdministracion.js";
import rutasOrganigramaAdministracion from "./rutasOrganigramaAdministracion.js";

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

rutasAdministracion.use("/contacto", rutasContactoAdministracion);
rutasAdministracion.use("/cuenta", rutasCuentaAdministracion);
rutasAdministracion.use("/directorio", rutasDirectorioAdministracion);
rutasAdministracion.use("/organigrama", rutasOrganigramaAdministracion);

rutasAdministracion.use(
  "/transparencia",
  rutasDocumentosAdministracion
);

rutasAdministracion.use(
  "/transparencia/categorias",
  rutasCategoriasAdministracion
);

export default rutasAdministracion;
