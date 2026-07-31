import "dotenv/config";
import bcrypt from "bcryptjs";
import { pathToFileURL } from "node:url";
import { z } from "zod";
import {
  baseDatos,
  UsuarioAdministrador,
} from "../models/index.js";
import { normalizarNombreUsuario } from "../models/UsuarioAdministrador.js";

const expresionNombreUsuario = /^[a-zA-Z0-9._-]+$/;
const expresionMayuscula = /[A-Z]/;
const expresionMinuscula = /[a-z]/;
const expresionNumero = /[0-9]/;
const expresionSimbolo = /[^A-Za-z0-9\s]/;

const esquemaAdministradorInicial = z
  .object({
    ADMIN_NOMBRE: z.string().trim().min(2).max(150),
    ADMIN_USUARIO: z
      .string()
      .trim()
      .min(4)
      .max(50)
      .regex(expresionNombreUsuario),
    ADMIN_CONTRASENA: z
      .string()
      .min(12)
      .max(128)
      .regex(expresionMayuscula)
      .regex(expresionMinuscula)
      .regex(expresionNumero)
      .regex(expresionSimbolo)
      .refine((valor) => valor.trim().length > 0),
  })
  .strict()
  .superRefine((datos, contexto) => {
    const usuario = normalizarNombreUsuario(datos.ADMIN_USUARIO);

    if (datos.ADMIN_CONTRASENA.trim().toLowerCase() === usuario) {
      contexto.addIssue({
        code: "custom",
        path: ["ADMIN_CONTRASENA"],
        message: "La contrasena no puede ser igual al usuario.",
      });
    }
  });

function validarAdministradorInicial(entorno) {
  const resultado = esquemaAdministradorInicial.safeParse({
    ADMIN_NOMBRE: entorno.ADMIN_NOMBRE,
    ADMIN_USUARIO: entorno.ADMIN_USUARIO,
    ADMIN_CONTRASENA: entorno.ADMIN_CONTRASENA,
  });

  if (!resultado.success) {
    throw new Error(
      "Las variables temporales ADMIN_NOMBRE, ADMIN_USUARIO y ADMIN_CONTRASENA no son validas."
    );
  }

  return {
    nombre: resultado.data.ADMIN_NOMBRE.trim(),
    nombreUsuario: normalizarNombreUsuario(resultado.data.ADMIN_USUARIO),
    contrasena: resultado.data.ADMIN_CONTRASENA,
  };
}

export async function crearAdministradorInicial() {
  const datos = validarAdministradorInicial(process.env);

  await baseDatos.authenticate();
  await UsuarioAdministrador.sync();

  const administradorExistente = await UsuarioAdministrador.findOne({
    where: { nombreUsuario: datos.nombreUsuario },
  });

  if (administradorExistente) {
    throw new Error(
      "Ya existe un administrador con el nombre de usuario indicado."
    );
  }

  const contrasenaHash = await bcrypt.hash(datos.contrasena, 12);

  await UsuarioAdministrador.create({
    nombre: datos.nombre,
    nombreUsuario: datos.nombreUsuario,
    contrasenaHash,
    rol: "administrador",
    estaActivo: true,
    versionSesion: 0,
  });

  console.log("Administrador inicial creado correctamente.");
}

function obtenerMensajeSeguroError(error) {
  const mensaje =
    error instanceof Error
      ? error.message
      : "No fue posible crear el administrador inicial.";

  if (
    mensaje.startsWith("Las variables temporales") ||
    mensaje.startsWith("Ya existe")
  ) {
    return mensaje;
  }

  return "No fue posible crear el administrador inicial. Revisa la configuracion del entorno y la conexion MySQL.";
}

const esEjecucionDirecta = process.argv[1]
  ? import.meta.url === pathToFileURL(process.argv[1]).href
  : false;

if (esEjecucionDirecta) {
  try {
    await crearAdministradorInicial();
  } catch (error) {
    console.error(obtenerMensajeSeguroError(error));
    process.exitCode = 1;
  } finally {
    await baseDatos.close();
  }
}
