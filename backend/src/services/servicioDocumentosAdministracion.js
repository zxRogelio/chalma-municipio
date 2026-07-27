import { randomBytes } from "node:crypto";
import { access, mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Op } from "sequelize";
import {
  baseDatos,
  CategoriaTransparencia,
  DocumentoTransparencia,
} from "../models/index.js";
import { obtenerTamanoMaximoArchivoBytes } from "../middleware/configurarCargaDocumento.js";

const archivoActual = fileURLToPath(import.meta.url);
const directorioActual = path.dirname(archivoActual);
const directorioDocumentos = path.resolve(
  directorioActual,
  "../../storage/documents"
);

const extensionesPermitidas = new Map([
  ["pdf", ["application/pdf"]],
  ["doc", ["application/msword"]],
  [
    "docx",
    [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  ],
  ["xls", ["application/vnd.ms-excel"]],
  [
    "xlsx",
    [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
  ],
  ["csv", ["text/csv", "application/csv", "text/plain"]],
  ["zip", ["application/zip", "application/x-zip-compressed"]],
  ["png", ["image/png"]],
  ["jpg", ["image/jpeg"]],
  ["jpeg", ["image/jpeg"]],
]);

class ErrorDocumentoAdministracion extends Error {
  constructor(mensaje, estado = 400) {
    super(mensaje);
    this.name = "ErrorDocumentoAdministracion";
    this.estado = estado;
  }
}

function normalizarTextoNullable(valor) {
  if (valor === undefined || valor === null || valor === "") {
    return null;
  }

  return valor;
}

function obtenerExtension(nombreOriginal = "") {
  const extension = path.extname(nombreOriginal).replace(".", "").toLowerCase();

  if (!extension || !extensionesPermitidas.has(extension)) {
    throw new ErrorDocumentoAdministracion(
      "El archivo no es valido.",
      400
    );
  }

  return extension;
}

function obtenerNombreOriginalSeguro(nombreOriginal = "documento") {
  const nombreBase = path
    .basename(nombreOriginal)
    .replace(/[\r\n"]/g, "")
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, "_")
    .trim();

  return (nombreBase || "documento").slice(0, 255);
}

function validarMime(extension, tipoMime = "") {
  const mimesPermitidos = extensionesPermitidas.get(extension) || [];
  const mimeNormalizado = tipoMime.toLowerCase().split(";")[0].trim();
  return mimesPermitidos.includes(mimeNormalizado);
}

function validarArchivoDocumento(archivo) {
  if (!archivo || !archivo.buffer || !archivo.originalname) {
    throw new ErrorDocumentoAdministracion(
      "El archivo no es valido.",
      400
    );
  }

  if (archivo.size > obtenerTamanoMaximoArchivoBytes()) {
    throw new ErrorDocumentoAdministracion(
      "El archivo supera el tamano maximo permitido.",
      400
    );
  }

  const extension = obtenerExtension(archivo.originalname);

  if (!validarMime(extension, archivo.mimetype)) {
    throw new ErrorDocumentoAdministracion(
      "El archivo no es valido.",
      400
    );
  }

  return {
    extension,
    tipoArchivo: extension.toUpperCase(),
    tipoMime: archivo.mimetype.toLowerCase(),
    nombreOriginal: obtenerNombreOriginalSeguro(archivo.originalname),
    tamanoBytes: archivo.size,
  };
}

function obtenerNombreAlmacenado(categoriaId, extension) {
  const cadenaAleatoria = randomBytes(8).toString("hex");
  const marcaTiempo = Date.now();

  return path
    .join(
      `categoria-${categoriaId}`,
      `documento-${marcaTiempo}-${cadenaAleatoria}.${extension}`
    )
    .replace(/\\/g, "/");
}

export function obtenerRutaFisicaDocumento(nombreAlmacenado) {
  if (!nombreAlmacenado) {
    return null;
  }

  const rutaFisica = path.resolve(directorioDocumentos, nombreAlmacenado);
  const directorioSeguro = `${directorioDocumentos}${path.sep}`;

  if (!rutaFisica.startsWith(directorioSeguro)) {
    return null;
  }

  return rutaFisica;
}

async function guardarArchivoFisico(categoriaId, archivo, metadatos) {
  const nombreAlmacenado = obtenerNombreAlmacenado(
    categoriaId,
    metadatos.extension
  );
  const rutaFisica = obtenerRutaFisicaDocumento(nombreAlmacenado);

  if (!rutaFisica) {
    throw new ErrorDocumentoAdministracion(
      "El archivo no es valido.",
      400
    );
  }

  await mkdir(path.dirname(rutaFisica), { recursive: true });
  await writeFile(rutaFisica, archivo.buffer, { flag: "wx" });

  return nombreAlmacenado;
}

async function eliminarArchivoSiExiste(nombreAlmacenado) {
  const rutaFisica = obtenerRutaFisicaDocumento(nombreAlmacenado);

  if (!rutaFisica) {
    return;
  }

  try {
    await unlink(rutaFisica);
  } catch (error) {
    if (error?.code !== "ENOENT") {
      console.error("No fue posible eliminar un archivo anterior.");
    }
  }
}

function crearUrlPublicaDocumento(id) {
  return `/api/transparencia/documentos/${id}/archivo`;
}

export function convertirDocumentoAdministrativoSeguro(documento) {
  const datos = documento.get ? documento.get({ plain: true }) : documento;

  return {
    id: datos.id,
    categoriaId: datos.categoriaId,
    titulo: datos.titulo,
    descripcion: datos.descripcion,
    ejercicioFiscal: datos.ejercicioFiscal,
    periodo: datos.periodo,
    tipoArchivo: datos.tipoArchivo,
    tipoMime: datos.tipoMime,
    nombreOriginal: datos.nombreOriginal,
    urlPublica: datos.urlPublica,
    tamanoBytes: datos.tamanoBytes,
    fechaPublicacion: datos.fechaPublicacion,
    orden: datos.orden,
    estaActivo: datos.estaActivo,
    createdAt: datos.createdAt,
    updatedAt: datos.updatedAt,
  };
}

function obtenerWhereFiltros(categoriaId, filtros = {}) {
  const where = { categoriaId };

  if (filtros.ejercicio) {
    where.ejercicioFiscal = filtros.ejercicio;
  }

  if (filtros.periodo) {
    where.periodo = filtros.periodo;
  }

  if (filtros.estaActivo === "activas" || filtros.estaActivo === "true") {
    where.estaActivo = true;
  }

  if (
    filtros.estaActivo === "inactivas" ||
    filtros.estaActivo === "false"
  ) {
    where.estaActivo = false;
  }

  if (filtros.busqueda) {
    where.titulo = {
      [Op.like]: `%${filtros.busqueda}%`,
    };
  }

  return where;
}

export async function listarDocumentosAdministracion(
  categoriaId,
  filtros = {}
) {
  const categoria = await CategoriaTransparencia.findByPk(categoriaId);

  if (!categoria) {
    return null;
  }

  const documentos = await DocumentoTransparencia.findAll({
    where: obtenerWhereFiltros(categoriaId, filtros),
    order: [
      ["ejercicioFiscal", "DESC"],
      ["orden", "ASC"],
      ["fechaPublicacion", "DESC"],
      ["titulo", "ASC"],
    ],
  });

  return documentos.map(convertirDocumentoAdministrativoSeguro);
}

export async function obtenerDocumentoAdministracionPorId(id) {
  const documento = await DocumentoTransparencia.findByPk(id);

  return documento
    ? convertirDocumentoAdministrativoSeguro(documento)
    : null;
}

export async function crearDocumentoAdministracion(
  categoriaId,
  datos,
  archivo
) {
  const categoria = await CategoriaTransparencia.findByPk(categoriaId);

  if (!categoria) {
    throw new ErrorDocumentoAdministracion(
      "Categoria no encontrada.",
      404
    );
  }

  const metadatos = validarArchivoDocumento(archivo);
  const nombreAlmacenado = await guardarArchivoFisico(
    categoriaId,
    archivo,
    metadatos
  );

  try {
    const documento = await baseDatos.transaction(async (transaccion) => {
      const documentoCreado = await DocumentoTransparencia.create(
        {
          categoriaId,
          titulo: datos.titulo,
          descripcion: normalizarTextoNullable(datos.descripcion),
          ejercicioFiscal: datos.ejercicioFiscal,
          periodo: datos.periodo,
          tipoArchivo: metadatos.tipoArchivo,
          tipoMime: metadatos.tipoMime,
          nombreOriginal: metadatos.nombreOriginal,
          nombreAlmacenado,
          urlPublica: "/api/transparencia/documentos/0/archivo",
          tamanoBytes: metadatos.tamanoBytes,
          fechaPublicacion: new Date(),
          orden: datos.orden,
          estaActivo: datos.estaActivo,
        },
        { transaction: transaccion }
      );

      documentoCreado.urlPublica = crearUrlPublicaDocumento(
        documentoCreado.id
      );
      await documentoCreado.save({ transaction: transaccion });

      return documentoCreado;
    });

    return convertirDocumentoAdministrativoSeguro(documento);
  } catch (error) {
    await eliminarArchivoSiExiste(nombreAlmacenado);
    throw error;
  }
}

export async function actualizarDocumentoAdministracion(id, datos) {
  const documento = await DocumentoTransparencia.findByPk(id);

  if (!documento) {
    return null;
  }

  if (datos.titulo !== undefined) {
    documento.titulo = datos.titulo;
  }

  if (datos.descripcion !== undefined) {
    documento.descripcion = normalizarTextoNullable(datos.descripcion);
  }

  if (datos.ejercicioFiscal !== undefined) {
    documento.ejercicioFiscal = datos.ejercicioFiscal;
  }

  if (datos.periodo !== undefined) {
    documento.periodo = datos.periodo;
  }

  if (datos.orden !== undefined) {
    documento.orden = datos.orden;
  }

  if (datos.estaActivo !== undefined) {
    documento.estaActivo = datos.estaActivo;
  }

  await documento.save();

  return convertirDocumentoAdministrativoSeguro(documento);
}

export async function reemplazarArchivoDocumentoAdministracion(
  id,
  archivo
) {
  const documento = await DocumentoTransparencia.findByPk(id);

  if (!documento) {
    throw new ErrorDocumentoAdministracion(
      "Documento no encontrado.",
      404
    );
  }

  const metadatos = validarArchivoDocumento(archivo);
  const nombreAnterior = documento.nombreAlmacenado;
  const nombreNuevo = await guardarArchivoFisico(
    documento.categoriaId,
    archivo,
    metadatos
  );

  try {
    documento.tipoArchivo = metadatos.tipoArchivo;
    documento.tipoMime = metadatos.tipoMime;
    documento.nombreOriginal = metadatos.nombreOriginal;
    documento.nombreAlmacenado = nombreNuevo;
    documento.urlPublica = crearUrlPublicaDocumento(documento.id);
    documento.tamanoBytes = metadatos.tamanoBytes;

    await documento.save();
  } catch (error) {
    await eliminarArchivoSiExiste(nombreNuevo);
    throw error;
  }

  await eliminarArchivoSiExiste(nombreAnterior);

  return convertirDocumentoAdministrativoSeguro(documento);
}

export async function cambiarEstadoDocumentoAdministracion(
  id,
  estaActivo
) {
  const documento = await DocumentoTransparencia.findByPk(id);

  if (!documento) {
    return null;
  }

  documento.estaActivo = estaActivo;
  await documento.save();

  return convertirDocumentoAdministrativoSeguro(documento);
}

export async function obtenerArchivoDocumentoActivo(id) {
  const documento = await DocumentoTransparencia.findOne({
    where: { id, estaActivo: true },
  });

  if (!documento) {
    return null;
  }

  const rutaFisica = obtenerRutaFisicaDocumento(documento.nombreAlmacenado);

  if (!rutaFisica) {
    return null;
  }

  try {
    await access(rutaFisica);
  } catch {
    return null;
  }

  const datos = documento.get({ plain: true });

  return {
    rutaFisica,
    tipoMime: datos.tipoMime || "application/octet-stream",
    nombreOriginal: datos.nombreOriginal || `${datos.titulo}.${datos.tipoArchivo}`,
    tipoArchivo: datos.tipoArchivo,
  };
}

export async function obtenerArchivoDocumentoAdministrativo(id) {
  const documento = await DocumentoTransparencia.findByPk(id);

  if (!documento) {
    return null;
  }

  const rutaFisica = obtenerRutaFisicaDocumento(documento.nombreAlmacenado);

  if (!rutaFisica) {
    return null;
  }

  try {
    await access(rutaFisica);
  } catch {
    return null;
  }

  const datos = documento.get({ plain: true });

  return {
    rutaFisica,
    tipoMime: datos.tipoMime || "application/octet-stream",
    nombreOriginal: datos.nombreOriginal || `${datos.titulo}.${datos.tipoArchivo}`,
    tipoArchivo: datos.tipoArchivo,
  };
}

export function esErrorDocumentoAdministracion(error) {
  return error instanceof ErrorDocumentoAdministracion;
}
