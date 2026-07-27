import { z } from "zod";

export const periodosDocumento = [
  "Anual",
  "Primer trimestre",
  "Segundo trimestre",
  "Tercer trimestre",
  "Cuarto trimestre",
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
  "Otro",
];

const esquemaIdPositivo = z.coerce.number().int().positive();

const esquemaTextoNullable = (maximo) =>
  z.preprocess(
    (valor) => {
      if (valor === undefined || valor === null || valor === "") {
        return null;
      }

      return valor;
    },
    z.string().trim().max(maximo).nullable()
  );

const esquemaBooleanoFormulario = z.preprocess((valor) => {
  if (valor === undefined || valor === "") {
    return undefined;
  }

  if (valor === true || valor === "true" || valor === "1") {
    return true;
  }

  if (valor === false || valor === "false" || valor === "0") {
    return false;
  }

  return valor;
}, z.boolean());

const esquemaEjercicioFiscal = z.preprocess(
  (valor) => {
    if (valor === undefined || valor === null || valor === "") {
      return undefined;
    }

    return Number(valor);
  },
  z.number().int().min(2000).max(2100)
);

const esquemaOrden = z
  .preprocess(
    (valor) => {
      if (valor === undefined || valor === null || valor === "") {
        return undefined;
      }

      return Number(valor);
    },
    z.number().int().min(0).max(9999)
  )
  .default(0);

const esquemaDocumentoBase = {
  titulo: z.string().trim().min(3).max(250),
  descripcion: esquemaTextoNullable(5000),
  ejercicioFiscal: esquemaEjercicioFiscal,
  periodo: z.enum(periodosDocumento),
  orden: esquemaOrden,
  estaActivo: esquemaBooleanoFormulario.optional().default(true),
};

export const esquemaCrearDocumento = z
  .object(esquemaDocumentoBase)
  .strict();

export const esquemaActualizarDocumento = z
  .object({
    titulo: esquemaDocumentoBase.titulo.optional(),
    descripcion: esquemaTextoNullable(5000).optional(),
    ejercicioFiscal: esquemaEjercicioFiscal.optional(),
    periodo: esquemaDocumentoBase.periodo.optional(),
    orden: esquemaOrden.optional(),
    estaActivo: esquemaBooleanoFormulario.optional(),
  })
  .strict()
  .refine((datos) => Object.keys(datos).length > 0);

export const esquemaCambiarEstadoDocumento = z
  .object({
    estaActivo: esquemaBooleanoFormulario,
  })
  .strict();

export const esquemaListarDocumentos = z
  .object({
    ejercicio: z
      .union([z.string(), z.number(), z.literal("")])
      .optional()
      .transform((valor) => {
        if (valor === undefined || valor === "") {
          return undefined;
        }

        const ejercicio = Number(valor);
        return Number.isInteger(ejercicio) ? ejercicio : Number.NaN;
      })
      .refine(
        (valor) =>
          valor === undefined || (valor >= 2000 && valor <= 2100)
      ),
    periodo: z
      .union([z.enum(periodosDocumento), z.literal("")])
      .optional()
      .transform((valor) => (valor === "" ? undefined : valor)),
    estaActivo: z
      .union([
        z.literal("todos"),
        z.literal("activas"),
        z.literal("inactivas"),
        z.literal("true"),
        z.literal("false"),
        z.literal(""),
      ])
      .optional(),
    busqueda: z.string().trim().max(120).optional(),
  })
  .strict();

export function validarIdParametro(valor) {
  const resultado = esquemaIdPositivo.safeParse(valor);
  return resultado.success ? resultado.data : null;
}
