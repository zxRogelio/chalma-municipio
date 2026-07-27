import { Op } from "sequelize";
import { CategoriaTransparencia } from "../models/index.js";

const longitudMaximaSlug = 190;

export function generarSlugBase(titulo) {
  const slug = String(titulo || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, longitudMaximaSlug)
    .replace(/-$/g, "");

  return slug || "categoria";
}

export async function generarSlugUnico(titulo, idIgnorado = null) {
  const slugBase = generarSlugBase(titulo);
  let contador = 1;

  while (contador <= 500) {
    const sufijo = contador === 1 ? "" : `-${contador}`;
    const limiteBase = longitudMaximaSlug - sufijo.length;
    const slugCandidato = `${slugBase.slice(0, limiteBase)}${sufijo}`;
    const condiciones = { slug: slugCandidato };

    if (idIgnorado) {
      condiciones.id = { [Op.ne]: idIgnorado };
    }

    const existente = await CategoriaTransparencia.findOne({
      where: condiciones,
      attributes: ["id"],
    });

    if (!existente) {
      return slugCandidato;
    }

    contador += 1;
  }

  throw new Error("No fue posible generar un slug unico");
}
