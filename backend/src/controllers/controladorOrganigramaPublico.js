import { createReadStream } from "node:fs";
import {
  obtenerArchivoOrganigramaPublico,
  obtenerOrganigramaPublico,
} from "../services/servicioOrganigrama.js";

function responderNoEncontrado(respuesta) {
  return respuesta.status(404).json({
    mensaje: "Organigrama no encontrado",
  });
}

export async function consultarOrganigramaPublico(_solicitud, respuesta) {
  try {
    const datos = await obtenerOrganigramaPublico();
    return respuesta.json(datos);
  } catch (error) {
    console.error(
      "Error al consultar organigrama publico:",
      error instanceof Error ? error.message : "Error desconocido"
    );

    return respuesta.status(500).json({
      titulo: null,
      descripcion: null,
      mostrarOrganigrama: false,
      urlArchivo: null,
      mensaje: "No fue posible consultar el organigrama municipal",
    });
  }
}

export async function servirArchivoOrganigramaPublico(
  _solicitud,
  respuesta
) {
  try {
    const archivo = await obtenerArchivoOrganigramaPublico();

    if (!archivo) {
      return responderNoEncontrado(respuesta);
    }

    respuesta.setHeader("Content-Type", archivo.tipoMime);
    respuesta.setHeader(
      "Content-Disposition",
      `inline; filename="${archivo.nombreOriginal}"`
    );

    const flujo = createReadStream(archivo.rutaFisica);

    flujo.on("error", () => {
      if (!respuesta.headersSent) {
        respuesta.status(404).json({
          mensaje: "Organigrama no encontrado",
        });
        return;
      }

      respuesta.destroy();
    });

    flujo.pipe(respuesta);
  } catch (error) {
    console.error(
      "Error al servir organigrama publico:",
      error instanceof Error ? error.message : "Error desconocido"
    );

    return respuesta.status(500).json({
      mensaje: "No fue posible consultar el organigrama municipal",
    });
  }
}
