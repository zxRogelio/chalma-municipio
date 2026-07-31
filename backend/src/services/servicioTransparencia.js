import {
  CategoriaTransparencia,
  DocumentoTransparencia,
} from "../models/index.js";

const ordenCategorias = [
  ["orden", "ASC"],
  ["titulo", "ASC"],
];

const ordenDocumentos = [
  ["ejercicioFiscal", "DESC"],
  ["orden", "ASC"],
  ["titulo", "ASC"],
];

function formatearDocumento(documento) {
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
    urlPublica: null,
    tamanoBytes: datos.tamanoBytes,
    fechaPublicacion: datos.fechaPublicacion,
    orden: datos.orden,
    estaActivo: datos.estaActivo,
  };
}

function formatearCategoriaResumen(datos) {
  const categoria = datos.get ? datos.get({ plain: true }) : datos;
  const documentos = categoria.documentos || [];

  return {
    id: categoria.id,
    categoriaPadreId: categoria.categoriaPadreId,
    titulo: categoria.titulo,
    slug: categoria.slug,
    descripcion: categoria.descripcion,
    fundamentoLegal: categoria.fundamentoLegal,
    tipoSeccion: categoria.tipoSeccion,
    orden: categoria.orden,
    estaActivo: categoria.estaActivo,
    cantidadDocumentos: documentos.length,
  };
}

function formatearCategoria(categoria, incluirDocumentos = false) {
  const datos = categoria.get({ plain: true });
  const documentos = datos.documentos || [];

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
    cantidadDocumentos: documentos.length,
    categoriaPadre: datos.categoriaPadre
      ? formatearCategoriaResumen(datos.categoriaPadre)
      : null,
    documentos: incluirDocumentos
      ? documentos.map(formatearDocumento)
      : undefined,
    categoriasHijas: (datos.categoriasHijas || []).map((categoriaHija) => ({
      id: categoriaHija.id,
      categoriaPadreId: categoriaHija.categoriaPadreId,
      titulo: categoriaHija.titulo,
      slug: categoriaHija.slug,
      descripcion: categoriaHija.descripcion,
      fundamentoLegal: categoriaHija.fundamentoLegal,
      tipoSeccion: categoriaHija.tipoSeccion,
      orden: categoriaHija.orden,
      estaActivo: categoriaHija.estaActivo,
      cantidadDocumentos: categoriaHija.documentos?.length || 0,
    })),
  };
}

async function obtenerBreadcrumbsCategoria(categoria) {
  const breadcrumbs = [];
  let categoriaPadreId = categoria.categoriaPadreId;
  let profundidad = 0;

  while (categoriaPadreId && profundidad < 80) {
    const categoriaPadre = await CategoriaTransparencia.findOne({
      where: {
        id: categoriaPadreId,
        estaActivo: true,
      },
    });

    if (!categoriaPadre) {
      return null;
    }

    breadcrumbs.unshift(formatearCategoriaResumen(categoriaPadre));
    categoriaPadreId = categoriaPadre.categoriaPadreId;
    profundidad += 1;
  }

  if (profundidad >= 80) {
    return null;
  }

  return breadcrumbs;
}

export async function obtenerSeccionesActivas() {
  const secciones = await CategoriaTransparencia.findAll({
    where: {
      categoriaPadreId: null,
      estaActivo: true,
    },
    include: [
      {
        model: CategoriaTransparencia,
        as: "categoriasHijas",
        where: { estaActivo: true },
        required: false,
        include: [
          {
            model: DocumentoTransparencia,
            as: "documentos",
            where: { estaActivo: true },
            required: false,
          },
        ],
      },
      {
        model: DocumentoTransparencia,
        as: "documentos",
        where: { estaActivo: true },
        required: false,
      },
    ],
    order: ordenCategorias,
  });

  return secciones.map((seccion) => formatearCategoria(seccion));
}

export async function obtenerSeccionPorSlug(slug) {
  const seccion = await CategoriaTransparencia.findOne({
    where: {
      slug,
      categoriaPadreId: null,
      estaActivo: true,
    },
    include: [
      {
        model: CategoriaTransparencia,
        as: "categoriasHijas",
        where: { estaActivo: true },
        required: false,
        include: [
          {
            model: DocumentoTransparencia,
            as: "documentos",
            where: { estaActivo: true },
            required: false,
          },
        ],
      },
    ],
    order: [
      [
        { model: CategoriaTransparencia, as: "categoriasHijas" },
        "orden",
        "ASC",
      ],
    ],
  });

  return seccion ? formatearCategoria(seccion) : null;
}

export async function obtenerCategoriaPorSlug(slug) {
  const categoria = await CategoriaTransparencia.findOne({
    where: {
      slug,
      estaActivo: true,
    },
    include: [
      {
        model: DocumentoTransparencia,
        as: "documentos",
        where: { estaActivo: true },
        required: false,
      },
    ],
    order: [
      [
        { model: DocumentoTransparencia, as: "documentos" },
        "orden",
        "ASC",
      ],
    ],
  });

  return categoria ? formatearCategoria(categoria, true) : null;
}

export async function obtenerCategoriaPublicaPorSlug(slug) {
  const categoria = await CategoriaTransparencia.findOne({
    where: {
      slug,
      estaActivo: true,
    },
    include: [
      {
        model: CategoriaTransparencia,
        as: "categoriaPadre",
        required: false,
      },
      {
        model: CategoriaTransparencia,
        as: "categoriasHijas",
        where: { estaActivo: true },
        required: false,
        include: [
          {
            model: DocumentoTransparencia,
            as: "documentos",
            where: { estaActivo: true },
            required: false,
          },
        ],
      },
      {
        model: DocumentoTransparencia,
        as: "documentos",
        where: { estaActivo: true },
        required: false,
      },
    ],
    order: [
      [
        { model: CategoriaTransparencia, as: "categoriasHijas" },
        "orden",
        "ASC",
      ],
      [
        { model: CategoriaTransparencia, as: "categoriasHijas" },
        "titulo",
        "ASC",
      ],
      [
        { model: DocumentoTransparencia, as: "documentos" },
        "ejercicioFiscal",
        "DESC",
      ],
      [
        { model: DocumentoTransparencia, as: "documentos" },
        "orden",
        "ASC",
      ],
      [
        { model: DocumentoTransparencia, as: "documentos" },
        "titulo",
        "ASC",
      ],
    ],
  });

  if (!categoria) {
    return null;
  }

  const breadcrumbs = await obtenerBreadcrumbsCategoria(categoria);

  if (!breadcrumbs) {
    return null;
  }

  const categoriaFormateada = formatearCategoria(categoria, true);

  return {
    categoria: {
      ...categoriaFormateada,
      categoriaPadre:
        breadcrumbs.length > 0
          ? breadcrumbs[breadcrumbs.length - 1]
          : null,
      documentos: undefined,
      categoriasHijas: undefined,
    },
    categoriaPadre:
      breadcrumbs.length > 0
        ? breadcrumbs[breadcrumbs.length - 1]
        : null,
    breadcrumbs,
    subcategorias: categoriaFormateada.categoriasHijas || [],
    documentos: categoriaFormateada.documentos || [],
  };
}

export async function obtenerDocumentosPorCategoria(slug, filtros = {}) {
  const categoria = await CategoriaTransparencia.findOne({
    where: {
      slug,
      estaActivo: true,
    },
  });

  if (!categoria) {
    return null;
  }

  const condicionesDocumentos = {
    categoriaId: categoria.id,
    estaActivo: true,
  };

  if (filtros.ejercicio) {
    condicionesDocumentos.ejercicioFiscal = Number(filtros.ejercicio);
  }

  if (filtros.periodo) {
    condicionesDocumentos.periodo = filtros.periodo;
  }

  const documentos = await DocumentoTransparencia.findAll({
    where: condicionesDocumentos,
    order: ordenDocumentos,
  });

  return {
    categoria: formatearCategoria(categoria),
    documentos: documentos.map(formatearDocumento),
  };
}

export async function obtenerFiltrosDeDocumentos(slug) {
  const categoria = await CategoriaTransparencia.findOne({
    where: {
      slug,
      estaActivo: true,
    },
    include: [
      {
        model: DocumentoTransparencia,
        as: "documentos",
        where: { estaActivo: true },
        required: false,
      },
    ],
  });

  if (!categoria) {
    return null;
  }

  const datos = categoria.get({ plain: true });
  const documentos = datos.documentos || [];
  const ejercicios = [
    ...new Set(documentos.map((documento) => documento.ejercicioFiscal)),
  ];
  const periodos = [
    ...new Set(documentos.map((documento) => documento.periodo)),
  ];

  return {
    ejercicios: ejercicios.sort((actual, siguiente) => siguiente - actual),
    periodos: periodos.sort(),
  };
}
