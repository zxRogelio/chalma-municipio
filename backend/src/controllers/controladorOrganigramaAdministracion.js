import { createReadStream } from "node:fs";
import { esquemaActualizarOrganigrama } from "../validations/validacionOrganigrama.js";
import {
  actualizarOrganigramaAdministracion,
  esErrorOrganigrama,
  obtenerArchivoOrganigramaAdministracion,
  obtenerOrganigramaAdministracion,
  reemplazarArchivoOrganigramaAdministracion,
} from "../services/servicioOrganigrama.js";

function responderDatosInvalidos(respuesta, mensaje) {
  return respuesta.status(400).json({
    exito: false,
    mensaje: mensaje || "Los datos proporcionados no son validos",
  });
}

function responderNoEncontrado(respuesta) {
  return respuesta.status(404).json({
    exito: false,
    mensaje: "Organigrama no encontrado",
  });
}

function responderError(respuesta, error) {
  if (esErrorOrganigrama(error)) {
    return respuesta.status(error.estado || 400).json({
      exito: false,
      mensaje: error.message,
    });
  }

  console.error(
    "Error al administrar organigrama:",
    error instanceof Error ? error.message : "Error desconocido"
  );

  return respuesta.status(500).json({
    exito: false,
    mensaje: "Ocurrio un error al administrar el organigrama",
  });
}

export async function consultarOrganigrama(_solicitud, respuesta) {
  try {
    const datos = await obtenerOrganigramaAdministracion();
    return respuesta.json(datos);
  } catch (error) {
    return responderError(respuesta, error);
  }
}

export async function actualizarOrganigrama(solicitud, respuesta) {
  const resultado = esquemaActualizarOrganigrama.safeParse(
    solicitud.body
  );

  if (!resultado.success) {
    return responderDatosInvalidos(
      respuesta,
      resultado.error.issues[0]?.message
    );
  }

  try {
    const datos = await actualizarOrganigramaAdministracion(
      resultado.data
    );

    return respuesta.json({
      ...datos,
      mensaje: "Organigrama actualizado correctamente",
    });
  } catch (error) {
    return responderError(respuesta, error);
  }
}

export async function reemplazarArchivoOrganigrama(solicitud, respuesta) {
  try {
    const datos = await reemplazarArchivoOrganigramaAdministracion(
      solicitud.file
    );

    return respuesta.json({
      ...datos,
      mensaje: "Imagen del organigrama actualizada correctamente",
    });
  } catch (error) {
    return responderError(respuesta, error);
  }
}

export async function servirArchivoOrganigramaAdministracion(
  _solicitud,
  respuesta
) {
  try {
    const archivo = await obtenerArchivoOrganigramaAdministracion();

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
          exito: false,
          mensaje: "Organigrama no encontrado",
        });
        return;
      }

      respuesta.destroy();
    });

    flujo.pipe(respuesta);
  } catch (error) {
    return responderError(respuesta, error);
  }
}
