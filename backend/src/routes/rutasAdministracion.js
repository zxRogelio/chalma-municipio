import { Router } from "express";
import rutasCategoriasAdministracion from "./rutasCategoriasAdministracion.js";

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

rutasAdministracion.use(
  "/transparencia/categorias",
  rutasCategoriasAdministracion
);

export default rutasAdministracion;
