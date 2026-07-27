import "dotenv/config";
import bcrypt from "bcryptjs";
import { pathToFileURL } from "node:url";
import { baseDatos, UsuarioAdministrador } from "../models/index.js";
import { normalizarNombreUsuario } from "../models/UsuarioAdministrador.js";

const expresionNombreUsuario = /^[a-zA-Z0-9._-]+$/;
const valorContrasenaEjemplo = "cambiar_antes_de_ejecutar_el_seed";

export function validarSeguridadContrasena(
  contrasena,
  nombreUsuario = ""
) {
  const errores = [];
  const tieneLongitudMinima = contrasena.length >= 12;
  const tieneLongitudMaxima = contrasena.length <= 200;
  const tieneMayuscula = /[A-Z]/.test(contrasena);
  const tieneMinuscula = /[a-z]/.test(contrasena);
  const tieneNumero = /[0-9]/.test(contrasena);
  const tieneSimbolo = /[^A-Za-z0-9\s]/.test(contrasena);
  const contrasenaNormalizada = contrasena.trim().toLowerCase();

  if (!tieneLongitudMinima) {
    errores.push("Debe tener al menos 12 caracteres.");
  }

  if (!tieneLongitudMaxima) {
    errores.push("Debe tener maximo 200 caracteres.");
  }

  if (!tieneMayuscula) {
    errores.push("Debe contener al menos una letra mayuscula.");
  }

  if (!tieneMinuscula) {
    errores.push("Debe contener al menos una letra minuscula.");
  }

  if (!tieneNumero) {
    errores.push("Debe contener al menos un numero.");
  }

  if (!tieneSimbolo) {
    errores.push("Debe contener al menos un simbolo.");
  }

  if (contrasena.trim().length === 0) {
    errores.push("No puede contener solamente espacios.");
  }

  if (contrasena === valorContrasenaEjemplo) {
    errores.push("No puede usar el valor de ejemplo.");
  }

  if (
    nombreUsuario &&
    contrasenaNormalizada === normalizarNombreUsuario(nombreUsuario)
  ) {
    errores.push("No puede ser igual al nombre de usuario.");
  }

  return {
    esValida: errores.length === 0,
    errores,
  };
}

function imprimirErrores(titulo, errores) {
  console.error(titulo);
  errores.forEach((error) => console.error(`- ${error}`));
}

function validarNombreUsuario(nombreUsuario) {
  const errores = [];

  if (!nombreUsuario) {
    errores.push("El nombre de usuario es obligatorio.");
  }

  if (nombreUsuario.length < 4) {
    errores.push("El nombre de usuario debe tener al menos 4 caracteres.");
  }

  if (nombreUsuario.length > 50) {
    errores.push("El nombre de usuario debe tener maximo 50 caracteres.");
  }

  if (!expresionNombreUsuario.test(nombreUsuario)) {
    errores.push(
      "El nombre de usuario solo puede contener letras, numeros, punto, guion y guion bajo."
    );
  }

  return errores;
}

async function sembrarAdministrador() {
  const nombre = process.env.ADMIN_INICIAL_NOMBRE;
  const nombreUsuario = normalizarNombreUsuario(
    process.env.ADMIN_INICIAL_USUARIO
  );
  const contrasena = process.env.ADMIN_INICIAL_PASSWORD;

  if (!nombre || !nombreUsuario || !contrasena) {
    console.error(
      "Faltan variables ADMIN_INICIAL_NOMBRE, ADMIN_INICIAL_USUARIO o ADMIN_INICIAL_PASSWORD."
    );
    process.exitCode = 1;
    return;
  }

  const erroresUsuario = validarNombreUsuario(nombreUsuario);

  if (erroresUsuario.length > 0) {
    imprimirErrores(
      "El nombre de usuario del administrador no es valido:",
      erroresUsuario
    );
    process.exitCode = 1;
    return;
  }

  const resultadoContrasena = validarSeguridadContrasena(
    contrasena,
    nombreUsuario
  );

  if (!resultadoContrasena.esValida) {
    imprimirErrores(
      "La contrasena del administrador no cumple los requisitos:",
      resultadoContrasena.errores
    );
    process.exitCode = 1;
    return;
  }

  await baseDatos.authenticate();
  await UsuarioAdministrador.sync();

  const administradorExistente = await UsuarioAdministrador.findOne({
    where: { nombreUsuario },
  });

  if (administradorExistente) {
    console.log(
      "El administrador inicial ya existe. No se realizaron cambios."
    );
    return;
  }

  const contrasenaHash = await bcrypt.hash(contrasena, 12);

  await UsuarioAdministrador.create({
    nombre: nombre.trim(),
    nombreUsuario,
    contrasenaHash,
    rol: "administrador",
    estaActivo: true,
  });

  console.log("Administrador inicial creado correctamente.");
}

const esEjecucionDirecta = process.argv[1]
  ? import.meta.url === pathToFileURL(process.argv[1]).href
  : false;

if (esEjecucionDirecta) {
  try {
    await sembrarAdministrador();
  } catch (error) {
    console.error(
      "No fue posible sembrar el administrador inicial:",
      error instanceof Error ? error.message : "Error desconocido"
    );
    process.exitCode = 1;
  } finally {
    await baseDatos.close();
  }
}
