import multer from "multer";
import { configuracionEntorno } from "../config/configuracionEntorno.js";

export function obtenerTamanoMaximoArchivoBytes() {
  return configuracionEntorno.maxFileSizeMb * 1024 * 1024;
}

const cargaDocumento = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: obtenerTamanoMaximoArchivoBytes(),
    files: 1,
  },
});

export function cargarArchivoDocumento(solicitud, respuesta, siguiente) {
  cargaDocumento.single("archivo")(solicitud, respuesta, (error) => {
    if (!error) {
      siguiente();
      return;
    }

    const mensaje =
      error instanceof multer.MulterError &&
      error.code === "LIMIT_FILE_SIZE"
        ? "El archivo supera el tamano maximo permitido."
        : "El archivo no es valido.";

    respuesta.status(400).json({
      exito: false,
      mensaje,
    });
  });
}
