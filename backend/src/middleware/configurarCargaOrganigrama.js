import multer from "multer";

const tamanoMaximoOrganigramaBytes = 10 * 1024 * 1024;

export function obtenerTamanoMaximoOrganigramaBytes() {
  return tamanoMaximoOrganigramaBytes;
}

const cargaOrganigrama = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: tamanoMaximoOrganigramaBytes,
    files: 1,
  },
});

export function cargarArchivoOrganigrama(solicitud, respuesta, siguiente) {
  cargaOrganigrama.single("archivo")(solicitud, respuesta, (error) => {
    if (!error) {
      siguiente();
      return;
    }

    const mensaje =
      error instanceof multer.MulterError &&
      error.code === "LIMIT_FILE_SIZE"
        ? "La imagen supera el tamano maximo permitido."
        : "La imagen no es valida.";

    respuesta.status(400).json({
      exito: false,
      mensaje,
    });
  });
}
