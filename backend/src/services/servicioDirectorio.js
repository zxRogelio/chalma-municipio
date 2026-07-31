import { DirectorioMunicipal } from "../models/index.js";

const ordenDirectorio = [
  ["orden", "ASC"],
  ["area", "ASC"],
];

function normalizarNullable(valor) {
  if (valor === undefined || valor === null || valor === "") {
    return null;
  }

  return valor;
}

function convertirDirectorioAdministracion(registro) {
  const datos = registro.get ? registro.get({ plain: true }) : registro;

  return {
    id: datos.id,
    area: datos.area,
    titular: datos.titular,
    cargo: datos.cargo,
    telefono: datos.telefono,
    correo: datos.correo,
    mostrarTelefono: Boolean(datos.mostrarTelefono),
    mostrarCorreo: Boolean(datos.mostrarCorreo),
    orden: datos.orden,
    estaActivo: Boolean(datos.estaActivo),
    createdAt: datos.createdAt,
    updatedAt: datos.updatedAt,
  };
}

function convertirDirectorioPublico(registro) {
  const datos = registro.get ? registro.get({ plain: true }) : registro;
  const mostrarTelefono = Boolean(datos.mostrarTelefono && datos.telefono);
  const mostrarCorreo = Boolean(datos.mostrarCorreo && datos.correo);

  return {
    id: datos.id,
    area: datos.area,
    titular: datos.titular,
    cargo: datos.cargo,
    telefono: mostrarTelefono ? datos.telefono : null,
    correo: mostrarCorreo ? datos.correo : null,
    mostrarTelefono,
    mostrarCorreo,
  };
}

function construirDatosDirectorio(datos) {
  return {
    area: datos.area,
    titular: normalizarNullable(datos.titular),
    cargo: normalizarNullable(datos.cargo),
    telefono: normalizarNullable(datos.telefono),
    correo: normalizarNullable(datos.correo),
    mostrarTelefono: datos.mostrarTelefono,
    mostrarCorreo: datos.mostrarCorreo,
    orden: datos.orden,
    estaActivo: datos.estaActivo,
  };
}

export async function listarDirectorioAdministracion() {
  const registros = await DirectorioMunicipal.findAll({
    order: ordenDirectorio,
  });

  return registros.map(convertirDirectorioAdministracion);
}

export async function listarDirectorioPublico() {
  const registros = await DirectorioMunicipal.findAll({
    where: { estaActivo: true },
    order: ordenDirectorio,
  });

  return registros.map(convertirDirectorioPublico);
}

export async function crearRegistroDirectorio(datos) {
  const registro = await DirectorioMunicipal.create(
    construirDatosDirectorio(datos)
  );

  return convertirDirectorioAdministracion(registro);
}

export async function actualizarRegistroDirectorio(id, datos) {
  const registro = await DirectorioMunicipal.findByPk(id);

  if (!registro) {
    return null;
  }

  await registro.update(construirDatosDirectorio(datos));

  return convertirDirectorioAdministracion(registro);
}

export async function cambiarEstadoRegistroDirectorio(id, estaActivo) {
  const registro = await DirectorioMunicipal.findByPk(id);

  if (!registro) {
    return null;
  }

  registro.estaActivo = estaActivo;
  await registro.save();

  return convertirDirectorioAdministracion(registro);
}
