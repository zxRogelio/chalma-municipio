import {
  obtenerConfiguracionContactoPublica,
} from "../services/servicioContacto.js";

export async function consultarContactoPublico(_solicitud, respuesta) {
  try {
    const datos = await obtenerConfiguracionContactoPublica();
    return respuesta.json(datos);
  } catch (error) {
    console.error(
      "Error al consultar la configuracion publica de contacto:",
      error instanceof Error ? error.message : "Error desconocido"
    );

    return respuesta.status(500).json({
      telefono: null,
      correo: null,
      mostrarTelefono: false,
      mostrarCorreo: false,
      mensaje: "No fue posible consultar la informacion de contacto",
    });
  }
}
