import {
  baseDatos,
  CategoriaTransparencia,
} from "../models/index.js";

const fraccionesComunes = [
  {
    titulo: "Fraccion I.- Marco Normativo",
    slug: "fraccion-i-marco-normativo",
    descripcion:
      "Normatividad aplicable al Ayuntamiento, incluyendo leyes, reglamentos y disposiciones administrativas.",
    fundamentoLegal: "Articulo 15, fraccion I de la LGTAIP.",
    orden: 1,
  },
  {
    titulo: "Fraccion II.- Estructura Organica",
    slug: "fraccion-ii-estructura-organica",
    descripcion:
      "Estructura organica completa, atribuciones y unidades administrativas del sujeto obligado.",
    fundamentoLegal: "Articulo 15, fraccion II de la LGTAIP.",
    orden: 2,
  },
  {
    titulo: "Fraccion III.- Facultades de cada area",
    slug: "fraccion-iii-facultades-de-cada-area",
    descripcion:
      "Facultades y responsabilidades asignadas a cada area administrativa municipal.",
    fundamentoLegal: "Articulo 15, fraccion III de la LGTAIP.",
    orden: 3,
  },
  {
    titulo: "Fraccion IV.- Metas y objetivos",
    slug: "fraccion-iv-metas-y-objetivos",
    descripcion:
      "Metas y objetivos institucionales de las areas conforme a sus programas operativos.",
    fundamentoLegal: "Articulo 15, fraccion IV de la LGTAIP.",
    orden: 4,
  },
  {
    titulo: "Fraccion V.- Indicadores de interes publico",
    slug: "fraccion-v-indicadores-de-interes-publico",
    descripcion:
      "Indicadores relacionados con temas de interes publico y seguimiento ciudadano.",
    fundamentoLegal: "Articulo 15, fraccion V de la LGTAIP.",
    orden: 5,
  },
  {
    titulo: "Fraccion VI.- Indicadores de resultados",
    slug: "fraccion-vi-indicadores-de-resultados",
    descripcion:
      "Indicadores que permiten evaluar resultados y desempeno de programas municipales.",
    fundamentoLegal: "Articulo 15, fraccion VI de la LGTAIP.",
    orden: 6,
  },
  {
    titulo: "Fraccion VII.- Directorio de servidores publicos",
    slug: "fraccion-vii-directorio-de-servidores-publicos",
    descripcion:
      "Directorio de servidores publicos con datos institucionales de contacto.",
    fundamentoLegal: "Articulo 15, fraccion VII de la LGTAIP.",
    orden: 7,
  },
  {
    titulo: "Fraccion VIII.- Remuneracion",
    slug: "fraccion-viii-remuneracion",
    descripcion:
      "Remuneracion bruta y neta de servidores publicos, segun corresponda.",
    fundamentoLegal: "Articulo 15, fraccion VIII de la LGTAIP.",
    orden: 8,
  },
  {
    titulo: "Fraccion IX.- Gastos de representacion",
    slug: "fraccion-ix-gastos-de-representacion",
    descripcion:
      "Gastos de representacion y viaticos asignados a servidores publicos.",
    fundamentoLegal: "Articulo 15, fraccion IX de la LGTAIP.",
    orden: 9,
  },
  {
    titulo: "Fraccion X.- Numero total de plazas",
    slug: "fraccion-x-numero-total-de-plazas",
    descripcion:
      "Numero total de plazas, personal de base, confianza y contrataciones aplicables.",
    fundamentoLegal: "Articulo 15, fraccion X de la LGTAIP.",
    orden: 10,
  },
  {
    titulo: "Fraccion XI.- Contrataciones de servicios",
    slug: "fraccion-xi-contrataciones-de-servicios",
    descripcion:
      "Contrataciones de servicios profesionales por honorarios y datos relacionados.",
    fundamentoLegal: "Articulo 15, fraccion XI de la LGTAIP.",
    orden: 11,
  },
  {
    titulo: "Fraccion XII.- Informacion de declaraciones",
    slug: "fraccion-xii-informacion-de-declaraciones",
    descripcion:
      "Informacion publica relativa a declaraciones patrimoniales, fiscales o de intereses cuando aplique.",
    fundamentoLegal: "Articulo 15, fraccion XII de la LGTAIP.",
    orden: 12,
  },
];

async function guardarCategoria(datosCategoria) {
  const [categoria] = await CategoriaTransparencia.findOrCreate({
    where: { slug: datosCategoria.slug },
    defaults: datosCategoria,
  });

  await categoria.update(datosCategoria);
  return categoria;
}

async function crearSeccionObligacionesComunes() {
  return guardarCategoria({
    categoriaPadreId: null,
    titulo: "Obligaciones Comunes (LGTAIP)",
    slug: "obligaciones-comunes",
    descripcion:
      "Seccion principal para las obligaciones comunes de transparencia.",
    fundamentoLegal: "Articulo 15 de la LGTAIP.",
    tipoSeccion: "obligaciones_comunes",
    orden: 1,
    estaActivo: true,
  });
}

async function crearFraccionesComunes(seccionObligacionesComunes) {
  for (const fraccion of fraccionesComunes) {
    await guardarCategoria({
      ...fraccion,
      categoriaPadreId: seccionObligacionesComunes.id,
      tipoSeccion: "obligaciones_comunes",
      estaActivo: true,
    });
  }
}

export async function sembrarCategorias() {
  await baseDatos.authenticate();
  await baseDatos.sync({ alter: true });

  const seccionObligacionesComunes =
    await crearSeccionObligacionesComunes();

  await crearFraccionesComunes(seccionObligacionesComunes);
}

async function cerrarConexion() {
  await baseDatos.close();
}

try {
  await sembrarCategorias();
  console.log("Categorias de transparencia sembradas correctamente.");
} catch (error) {
  console.error("No se pudieron sembrar las categorias.", error);
  process.exitCode = 1;
} finally {
  await cerrarConexion();
}
