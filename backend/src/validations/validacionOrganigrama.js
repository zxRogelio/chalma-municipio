import { z } from "zod";

const expresionHtml = /<[^>]*>|[<>]/;

const textoVacioANull = (valor) => {
  if (valor === undefined || valor === null) {
    return null;
  }

  if (typeof valor === "string" && valor.trim() === "") {
    return null;
  }

  return valor;
};

const textoNullable = (maximo) =>
  z.preprocess(
    textoVacioANull,
    z.union([
      z
        .string()
        .trim()
        .max(maximo)
        .refine((valor) => !expresionHtml.test(valor), {
          message: "El campo no puede contener HTML",
        }),
      z.null(),
    ])
  );

export const esquemaActualizarOrganigrama = z
  .object({
    titulo: textoNullable(180).optional(),
    descripcion: textoNullable(2000).optional(),
    mostrarOrganigrama: z.boolean(),
  })
  .strict();
