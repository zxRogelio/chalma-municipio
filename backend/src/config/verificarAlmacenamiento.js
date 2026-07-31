import { constants } from "node:fs";
import { access, mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const archivoActual = fileURLToPath(import.meta.url);
const directorioActual = path.dirname(archivoActual);
const directorioBackend = path.resolve(directorioActual, "../..");

export const rutasAlmacenamiento = {
  documentos: path.resolve(directorioBackend, "storage/documents"),
  organigrama: path.resolve(directorioBackend, "storage/organigrama"),
};

async function verificarDirectorio(nombre, rutaDirectorio) {
  try {
    await mkdir(rutaDirectorio, { recursive: true });
    await access(rutaDirectorio, constants.R_OK | constants.W_OK);

    const rutaPrueba = path.join(
      rutaDirectorio,
      `.verificacion-${process.pid}-${Date.now()}.tmp`
    );

    await writeFile(rutaPrueba, "ok", { flag: "wx" });
    await unlink(rutaPrueba);

    return {
      nombre,
      ruta: rutaDirectorio,
      estado: "ok",
    };
  } catch {
    throw new Error(
      `No fue posible verificar permisos de escritura en storage/${nombre}.`
    );
  }
}

export async function verificarAlmacenamiento() {
  const resultados = [];

  for (const [nombre, rutaDirectorio] of Object.entries(
    rutasAlmacenamiento
  )) {
    resultados.push(await verificarDirectorio(nombre, rutaDirectorio));
  }

  return resultados;
}
