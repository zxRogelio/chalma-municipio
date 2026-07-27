import { Op } from "sequelize";
import {
  CategoriaTransparencia,
  DocumentoTransparencia,
} from "../models/index.js";
import { generarSlugUnico } from "../utils/generarSlug.js";

const profundidadMaximaCategoria = 80;

class ErrorCategoriaAdministracion extends Error {
  constructor(mensaje, estado = 400) {
    super(mensaje);
    this.name = "ErrorCategoriaAdministracion";
    this.estado = estado;
  }
}

function normalizarTextoNullable(valor) {
  if (valor === undefined || valor === null || valor === "") {
    return null;
  }

  return valor;
}

function obtenerWhereFiltros(filtros = {}) {
  const where = {};

  if (filtros.tipoSeccion) {
    where.tipoSeccion = filtros.tipoSeccion;
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

  if (filtros.categoriaPadreId) {
    where.categoriaPadreId = filtros.categoriaPadreId;
  }

  if (filtros.busqueda) {
    where.titulo = {
      [Op.like]: `%${filtros.busqueda}%`,
    };
  }

  return where;
}

async function contarDocumentos(categoriaId) {
  return DocumentoTransparencia.count({
    where: { categoriaId },
  });
}

async function contarSubcategorias(categoriaId, soloActivas = false) {
  const where = { categoriaPadreId: categoriaId };

  if (soloActivas) {
    where.estaActivo = true;
  }

  return CategoriaTransparencia.count({ where });
}

async function resumirCategoriaPadre(categoriaPadreId) {
  if (!categoriaPadreId) {
    return null;
  }

  const categoriaPadre = await CategoriaTransparencia.findByPk(
    categoriaPadreId,
    {
      attributes: ["id", "titulo", "slug"],
    }
  );

  if (!categoriaPadre) {
    return null;
  }

  const datos = categoriaPadre.get({ plain: true });

  return {
    id: datos.id,
    titulo: datos.titulo,
    slug: datos.slug,
  };
}

export async function convertirCategoriaAdministrativaSegura(
  categoria
) {
  const datos = categoria.get
    ? categoria.get({ plain: true })
    : categoria;

  const [
    cantidadDocumentos,
    cantidadSubcategorias,
    categoriaPadre,
  ] = await Promise.all([
    contarDocumentos(datos.id),
    contarSubcategorias(datos.id),
    resumirCategoriaPadre(datos.categoriaPadreId),
  ]);

  return {
    id: datos.id,
    categoriaPadreId: datos.categoriaPadreId,
    titulo: datos.titulo,
    slug: datos.slug,
    descripcion: datos.descripcion,
    fundamentoLegal: datos.fundamentoLegal,
    tipoSeccion: datos.tipoSeccion,
    orden: datos.orden,
    estaActivo: datos.estaActivo,
    cantidadDocumentos,
    cantidadSubcategorias,
    categoriaPadre,
    createdAt: datos.createdAt,
    updatedAt: datos.updatedAt,
  };
}

export async function listarCategoriasAdministracion(filtros = {}) {
  const categorias = await CategoriaTransparencia.findAll({
    where: obtenerWhereFiltros(filtros),
    order: [
      ["tipoSeccion", "ASC"],
      ["categoriaPadreId", "ASC"],
      ["orden", "ASC"],
      ["titulo", "ASC"],
    ],
  });

  return Promise.all(
    categorias.map((categoria) =>
      convertirCategoriaAdministrativaSegura(categoria)
    )
  );
}

export async function obtenerCategoriaAdministracionPorId(id) {
  const categoria = await CategoriaTransparencia.findByPk(id);

  return categoria
    ? convertirCategoriaAdministrativaSegura(categoria)
    : null;
}

export async function comprobarCategoriaPadreValida(
  categoriaPadreId,
  tipoSeccion
) {
  if (!categoriaPadreId) {
    return null;
  }

  const categoriaPadre = await CategoriaTransparencia.findByPk(
    categoriaPadreId
  );

  if (!categoriaPadre) {
    throw new ErrorCategoriaAdministracion(
      "La categoria padre no existe",
      400
    );
  }

  if (!categoriaPadre.estaActivo) {
    throw new ErrorCategoriaAdministracion(
      "La categoria padre no esta activa",
      400
    );
  }

  if (categoriaPadre.tipoSeccion !== tipoSeccion) {
    throw new ErrorCategoriaAdministracion(
      "La categoria hija debe utilizar el mismo tipo de seccion que su categoria padre",
      400
    );
  }

  return categoriaPadre;
}

export async function comprobarCicloCategoria(id, categoriaPadreId) {
  if (!categoriaPadreId) {
    return false;
  }

  if (Number(id) === Number(categoriaPadreId)) {
    throw new ErrorCategoriaAdministracion(
      "Una categoria no puede ser su propia categoria padre",
      409
    );
  }

  let idActual = categoriaPadreId;
  let profundidad = 0;

  while (idActual && profundidad < profundidadMaximaCategoria) {
    const categoriaActual = await CategoriaTransparencia.findByPk(
      idActual,
      {
        attributes: ["id", "categoriaPadreId"],
      }
    );

    if (!categoriaActual) {
      return false;
    }

    if (Number(categoriaActual.id) === Number(id)) {
      throw new ErrorCategoriaAdministracion(
        "No es posible utilizar una subcategoria descendiente como categoria padre",
        409
      );
    }

    idActual = categoriaActual.categoriaPadreId;
    profundidad += 1;
  }

  if (profundidad >= profundidadMaximaCategoria) {
    throw new ErrorCategoriaAdministracion(
      "No fue posible validar la jerarquia de categorias",
      409
    );
  }

  return false;
}

export async function crearCategoriaAdministracion(datos) {
  await comprobarCategoriaPadreValida(
    datos.categoriaPadreId,
    datos.tipoSeccion
  );

  const slug = await generarSlugUnico(datos.titulo);
  const categoria = await CategoriaTransparencia.create({
    titulo: datos.titulo,
    descripcion: normalizarTextoNullable(datos.descripcion),
    fundamentoLegal: normalizarTextoNullable(datos.fundamentoLegal),
    tipoSeccion: datos.tipoSeccion,
    categoriaPadreId: datos.categoriaPadreId,
    orden: datos.orden,
    estaActivo: datos.estaActivo,
    slug,
  });

  return convertirCategoriaAdministrativaSegura(categoria);
}

export async function actualizarCategoriaAdministracion(id, datos) {
  const categoria = await CategoriaTransparencia.findByPk(id);

  if (!categoria) {
    return null;
  }

  const siguienteTipoSeccion =
    datos.tipoSeccion ?? categoria.tipoSeccion;
  const siguienteCategoriaPadreId =
    datos.categoriaPadreId === undefined
      ? categoria.categoriaPadreId
      : datos.categoriaPadreId;

  await comprobarCicloCategoria(id, siguienteCategoriaPadreId);
  await comprobarCategoriaPadreValida(
    siguienteCategoriaPadreId,
    siguienteTipoSeccion
  );

  if (datos.titulo && datos.titulo !== categoria.titulo) {
    categoria.slug = await generarSlugUnico(datos.titulo, id);
    categoria.titulo = datos.titulo;
  }

  if (datos.descripcion !== undefined) {
    categoria.descripcion = normalizarTextoNullable(datos.descripcion);
  }

  if (datos.fundamentoLegal !== undefined) {
    categoria.fundamentoLegal = normalizarTextoNullable(
      datos.fundamentoLegal
    );
  }

  if (datos.tipoSeccion !== undefined) {
    categoria.tipoSeccion = datos.tipoSeccion;
  }

  if (datos.categoriaPadreId !== undefined) {
    categoria.categoriaPadreId = datos.categoriaPadreId;
  }

  if (datos.orden !== undefined) {
    categoria.orden = datos.orden;
  }

  if (datos.estaActivo !== undefined) {
    categoria.estaActivo = datos.estaActivo;
  }

  await categoria.save();

  return convertirCategoriaAdministrativaSegura(categoria);
}

export async function cambiarEstadoCategoriaAdministracion(
  id,
  estaActivo
) {
  const categoria = await CategoriaTransparencia.findByPk(id);

  if (!categoria) {
    return null;
  }

  categoria.estaActivo = estaActivo;
  await categoria.save();

  const categoriaSegura =
    await convertirCategoriaAdministrativaSegura(categoria);
  const cantidadSubcategoriasActivas = await contarSubcategorias(
    id,
    true
  );

  return {
    categoria: categoriaSegura,
    advertencia:
      !estaActivo && cantidadSubcategoriasActivas > 0
        ? "La categoria contiene subcategorias activas"
        : undefined,
  };
}

export function esErrorCategoriaAdministracion(error) {
  return error instanceof ErrorCategoriaAdministracion;
}
