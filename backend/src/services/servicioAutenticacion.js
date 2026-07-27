import bcrypt from "bcryptjs";
import { UsuarioAdministrador } from "../models/index.js";
import { normalizarNombreUsuario } from "../models/UsuarioAdministrador.js";

export async function buscarAdministradorPorNombreUsuario(
  nombreUsuario
) {
  return UsuarioAdministrador.findOne({
    where: {
      nombreUsuario: normalizarNombreUsuario(nombreUsuario),
    },
  });
}

export async function buscarAdministradorPorId(id) {
  return UsuarioAdministrador.findByPk(id);
}

export async function validarCredenciales(
  nombreUsuario,
  contrasena
) {
  const administrador = await buscarAdministradorPorNombreUsuario(
    nombreUsuario
  );

  if (!administrador || !administrador.estaActivo) {
    return null;
  }

  const contrasenaEsValida = await bcrypt.compare(
    contrasena,
    administrador.contrasenaHash
  );

  return contrasenaEsValida ? administrador : null;
}

export async function actualizarUltimoAcceso(administrador) {
  administrador.ultimoAcceso = new Date();
  await administrador.save();
  return administrador;
}

export function convertirAdministradorSeguro(administrador) {
  const datos = administrador.get
    ? administrador.get({ plain: true })
    : administrador;

  return {
    id: datos.id,
    nombre: datos.nombre,
    nombreUsuario: datos.nombreUsuario,
    rol: datos.rol,
    estaActivo: datos.estaActivo,
    ultimoAcceso: datos.ultimoAcceso,
  };
}
