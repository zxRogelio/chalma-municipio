import {
  listarDirectorioPublico,
} from "../services/servicioDirectorio.js";

export async function consultarDirectorioPublico(_solicitud, respuesta) {
  try {
    const directorio = await listarDirectorioPublico();

    return respuesta.json({
      directorio,
    });
  } catch (error) {
    console.error(
      "Error al consultar directorio publico:",
      error instanceof Error ? error.message : "Error desconocido"
    );

    return respuesta.status(500).json({
      directorio: [],
      mensaje: "No fue posible consultar el directorio municipal",
    });
  }
}
