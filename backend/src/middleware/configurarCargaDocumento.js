import multer from "multer";

const tamanoMaximoPredeterminadoMb = 20;

export function obtenerTamanoMaximoArchivoBytes() {
  const valorConfigurado = Number(process.env.MAX_FILE_SIZE_MB);
  const tamanoMb =
    Number.isFinite(valorConfigurado) && valorConfigurado > 0
      ? valorConfigurado
      : tamanoMaximoPredeterminadoMb;

  return tamanoMb * 1024 * 1024;
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
