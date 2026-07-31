import { randomBytes } from "node:crypto";
import { access, mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ConfiguracionOrganigrama } from "../models/index.js";
import {
  obtenerTamanoMaximoOrganigramaBytes,
} from "../middleware/configurarCargaOrganigrama.js";

const ID_CONFIGURACION_ORGANIGRAMA = 1;
const archivoActual = fileURLToPath(import.meta.url);
const directorioActual = path.dirname(archivoActual);
const directorioOrganigrama = path.resolve(
  directorioActual,
  "../../storage/organigrama"
);

const extensionesPermitidas = new Map([
  ["png", ["image/png"]],
  ["jpg", ["image/jpeg"]],
  ["jpeg", ["image/jpeg"]],
]);

class ErrorOrganigrama extends Error {
  constructor(mensaje, estado = 400) {
    super(mensaje);
    this.name = "ErrorOrganigrama";
    this.estado = estado;
  }
}

function normalizarNullable(valor) {
  if (valor === undefined || valor === null || valor === "") {
    return null;
  }

  return valor;
}

function crearUrlArchivoPublica() {
  return "/api/organigrama/archivo";
}

function crearUrlArchivoAdministracion() {
  return "/api/administracion/organigrama/archivo";
}

function convertirOrganigramaAdministracion(registro) {
  const datos = registro.get ? registro.get({ plain: true }) : registro;
  const tieneArchivo = Boolean(datos.nombreAlmacenado);

  return {
    id: datos.id,
    titulo: datos.titulo ?? null,
    descripcion: datos.descripcion ?? null,
    nombreOriginal: datos.nombreOriginal ?? null,
    tipoMime: datos.tipoMime ?? null,
    tamanoBytes: datos.tamanoBytes ?? null,
    mostrarOrganigrama: Boolean(datos.mostrarOrganigrama),
    tieneArchivo,
    urlArchivo: tieneArchivo ? crearUrlArchivoAdministracion() : null,
    createdAt: datos.createdAt,
    updatedAt: datos.updatedAt,
  };
}

function convertirOrganigramaPublico(registro) {
  if (!registro) {
    return {
      titulo: null,
      descripcion: null,
      mostrarOrganigrama: false,
      urlArchivo: null,
    };
  }

  const datos = registro.get ? registro.get({ plain: true }) : registro;
  const visible = Boolean(
    datos.mostrarOrganigrama && datos.nombreAlmacenado
  );

  return {
    titulo: datos.titulo ?? null,
    descripcion: datos.descripcion ?? null,
    mostrarOrganigrama: visible,
    urlArchivo: visible ? crearUrlArchivoPublica() : null,
  };
}

async function obtenerOCrearConfiguracionOrganigrama() {
  const [configuracion] = await ConfiguracionOrganigrama.findOrCreate({
    where: { id: ID_CONFIGURACION_ORGANIGRAMA },
    defaults: {
      id: ID_CONFIGURACION_ORGANIGRAMA,
      titulo: null,
      descripcion: null,
      nombreOriginal: null,
      nombreAlmacenado: null,
      tipoMime: null,
      tamanoBytes: null,
      mostrarOrganigrama: false,
    },
  });

  return configuracion;
}

function obtenerExtension(nombreOriginal = "") {
  const extension = path.extname(nombreOriginal).replace(".", "").toLowerCase();

  if (!extension || !extensionesPermitidas.has(extension)) {
    throw new ErrorOrganigrama("La imagen no es valida.", 400);
  }

  return extension;
}

function validarMime(extension, tipoMime = "") {
  const mimesPermitidos = extensionesPermitidas.get(extension) || [];
  const mimeNormalizado = tipoMime.toLowerCase().split(";")[0].trim();
  return mimesPermitidos.includes(mimeNormalizado);
}

function obtenerNombreOriginalSeguro(nombreOriginal = "organigrama") {
  const nombreBase = path
    .basename(nombreOriginal)
    .replace(/[\r\n"]/g, "")
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, "_")
    .trim();

  return (nombreBase || "organigrama").slice(0, 255);
}

function validarArchivoOrganigrama(archivo) {
  if (!archivo || !archivo.buffer || !archivo.originalname) {
    throw new ErrorOrganigrama("La imagen no es valida.", 400);
  }

  if (archivo.size > obtenerTamanoMaximoOrganigramaBytes()) {
    throw new ErrorOrganigrama(
      "La imagen supera el tamano maximo permitido.",
      400
    );
  }

  const extension = obtenerExtension(archivo.originalname);

  if (!validarMime(extension, archivo.mimetype)) {
    throw new ErrorOrganigrama("La imagen no es valida.", 400);
  }

  return {
    extension,
    tipoMime: archivo.mimetype.toLowerCase(),
    nombreOriginal: obtenerNombreOriginalSeguro(archivo.originalname),
    tamanoBytes: archivo.size,
  };
}

function obtenerNombreAlmacenado(extension) {
  const marcaTiempo = Date.now();
  const aleatorio = randomBytes(8).toString("hex");
  return `organigrama-${marcaTiempo}-${aleatorio}.${extension}`;
}

export function obtenerRutaFisicaOrganigrama(nombreAlmacenado) {
  if (!nombreAlmacenado) {
    return null;
  }

  const rutaFisica = path.resolve(directorioOrganigrama, nombreAlmacenado);
  const directorioSeguro = `${directorioOrganigrama}${path.sep}`;

  if (!rutaFisica.startsWith(directorioSeguro)) {
    return null;
  }

  return rutaFisica;
}

async function guardarArchivoFisico(archivo, metadatos) {
  const nombreAlmacenado = obtenerNombreAlmacenado(metadatos.extension);
  const rutaFisica = obtenerRutaFisicaOrganigrama(nombreAlmacenado);

  if (!rutaFisica) {
    throw new ErrorOrganigrama("La imagen no es valida.", 400);
  }

  await mkdir(path.dirname(rutaFisica), { recursive: true });
  await writeFile(rutaFisica, archivo.buffer, { flag: "wx" });

  return nombreAlmacenado;
}

async function eliminarArchivoSiExiste(nombreAlmacenado) {
  const rutaFisica = obtenerRutaFisicaOrganigrama(nombreAlmacenado);

  if (!rutaFisica) {
    return;
  }

  try {
    await unlink(rutaFisica);
  } catch (error) {
    if (error?.code !== "ENOENT") {
      console.error("No fue posible eliminar el organigrama anterior.");
    }
  }
}

async function obtenerArchivoDesdeRegistro(registro, permitirOculto) {
  if (!registro) {
    return null;
  }

  const datos = registro.get ? registro.get({ plain: true }) : registro;

  if (!permitirOculto && !datos.mostrarOrganigrama) {
    return null;
  }

  const rutaFisica = obtenerRutaFisicaOrganigrama(datos.nombreAlmacenado);

  if (!rutaFisica) {
    return null;
  }

  try {
    await access(rutaFisica);
  } catch {
    return null;
  }

  return {
    rutaFisica,
    tipoMime: datos.tipoMime || "application/octet-stream",
    nombreOriginal: datos.nombreOriginal || "organigrama",
  };
}

export async function obtenerOrganigramaAdministracion() {
  const configuracion = await obtenerOCrearConfiguracionOrganigrama();
  return convertirOrganigramaAdministracion(configuracion);
}

export async function actualizarOrganigramaAdministracion(datos) {
  const configuracion = await obtenerOCrearConfiguracionOrganigrama();

  if (datos.mostrarOrganigrama && !configuracion.nombreAlmacenado) {
    throw new ErrorOrganigrama(
      "Sube una imagen antes de mostrar el organigrama en el portal",
      400
    );
  }

  configuracion.titulo = normalizarNullable(datos.titulo);
  configuracion.descripcion = normalizarNullable(datos.descripcion);
  configuracion.mostrarOrganigrama = datos.mostrarOrganigrama;

  await configuracion.save();

  return convertirOrganigramaAdministracion(configuracion);
}

export async function reemplazarArchivoOrganigramaAdministracion(
  archivo
) {
  const configuracion = await obtenerOCrearConfiguracionOrganigrama();
  const metadatos = validarArchivoOrganigrama(archivo);
  const nombreAnterior = configuracion.nombreAlmacenado;
  const nombreNuevo = await guardarArchivoFisico(archivo, metadatos);

  try {
    configuracion.nombreOriginal = metadatos.nombreOriginal;
    configuracion.nombreAlmacenado = nombreNuevo;
    configuracion.tipoMime = metadatos.tipoMime;
    configuracion.tamanoBytes = metadatos.tamanoBytes;

    await configuracion.save();
  } catch (error) {
    await eliminarArchivoSiExiste(nombreNuevo);
    throw error;
  }

  await eliminarArchivoSiExiste(nombreAnterior);

  return convertirOrganigramaAdministracion(configuracion);
}

export async function obtenerOrganigramaPublico() {
  const configuracion = await ConfiguracionOrganigrama.findByPk(
    ID_CONFIGURACION_ORGANIGRAMA
  );

  return convertirOrganigramaPublico(configuracion);
}

export async function obtenerArchivoOrganigramaPublico() {
  const configuracion = await ConfiguracionOrganigrama.findByPk(
    ID_CONFIGURACION_ORGANIGRAMA
  );

  return obtenerArchivoDesdeRegistro(configuracion, false);
}

export async function obtenerArchivoOrganigramaAdministracion() {
  const configuracion = await ConfiguracionOrganigrama.findByPk(
    ID_CONFIGURACION_ORGANIGRAMA
  );

  return obtenerArchivoDesdeRegistro(configuracion, true);
}

export function esErrorOrganigrama(error) {
  return error instanceof ErrorOrganigrama;
}
