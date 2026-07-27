import { Router } from "express";

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

export default rutasAdministracion;
