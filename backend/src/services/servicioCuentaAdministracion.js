import bcrypt from "bcryptjs";
import { UsuarioAdministrador } from "../models/index.js";

class ErrorCuentaAdministracion extends Error {
  constructor(mensaje, estado = 400) {
    super(mensaje);
    this.name = "ErrorCuentaAdministracion";
    this.estado = estado;
  }
}

export async function cambiarContrasenaAdministrador(
  administradorId,
  datos
) {
  const administrador = await UsuarioAdministrador.findByPk(
    administradorId
  );

  if (!administrador || !administrador.estaActivo) {
    throw new ErrorCuentaAdministracion("Sesion no valida", 401);
  }

  const contrasenaActualEsValida = await bcrypt.compare(
    datos.contrasenaActual,
    administrador.contrasenaHash
  );

  if (!contrasenaActualEsValida) {
    throw new ErrorCuentaAdministracion(
      "La contrasena actual es incorrecta.",
      400
    );
  }

  const coincideConActual = await bcrypt.compare(
    datos.contrasenaNueva,
    administrador.contrasenaHash
  );

  if (coincideConActual) {
    throw new ErrorCuentaAdministracion(
      "La contrasena nueva debe ser diferente de la contrasena actual.",
      400
    );
  }

  administrador.contrasenaHash = await bcrypt.hash(
    datos.contrasenaNueva,
    12
  );
  administrador.versionSesion =
    Number(administrador.versionSesion || 0) + 1;

  await administrador.save();

  return {
    versionSesion: administrador.versionSesion,
  };
}

export function esErrorCuentaAdministracion(error) {
  return error instanceof ErrorCuentaAdministracion;
}
