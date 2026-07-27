import { z } from "zod";
import { TIPOS_SECCION_TRANSPARENCIA } from "../constants/tiposTransparencia.js";

const esquemaIdPositivo = z
  .coerce
  .number()
  .int()
  .positive();

const esquemaTextoNullable = (maximo) =>
  z.preprocess(
    (valor) => {
      if (valor === null || valor === "") {
        return null;
      }

      return valor;
    },
    z.string().trim().max(maximo).nullable()
  );

const esquemaTextoCrear = (maximo) =>
  z.preprocess(
    (valor) => {
      if (valor === undefined || valor === null || valor === "") {
        return null;
      }

      return valor;
    },
    z.string().trim().max(maximo).nullable()
  );

const esquemaCategoriaPadreIdCrear = z.preprocess(
  (valor) => {
    if (valor === undefined || valor === null || valor === "") {
      return null;
    }

    return valor;
  },
  z.union([esquemaIdPositivo, z.null()])
);

const esquemaCategoriaPadreIdActualizar = z.preprocess(
  (valor) => {
    if (valor === null || valor === "") {
      return null;
    }

    return valor;
  },
  z.union([esquemaIdPositivo, z.null()])
);

const esquemaCategoriaBase = {
  titulo: z.string().trim().min(3).max(250),
  descripcion: esquemaTextoCrear(5000),
  fundamentoLegal: esquemaTextoCrear(3000),
  tipoSeccion: z.enum(TIPOS_SECCION_TRANSPARENCIA),
  categoriaPadreId: esquemaCategoriaPadreIdCrear,
  orden: z
    .coerce
    .number()
    .int()
    .min(0)
    .max(9999)
    .default(0),
  estaActivo: z.boolean().default(true),
};

export const esquemaCrearCategoria = z
  .object(esquemaCategoriaBase)
  .strict();

export const esquemaActualizarCategoria = z
  .object({
    titulo: esquemaCategoriaBase.titulo.optional(),
    descripcion: esquemaTextoNullable(5000).optional(),
    fundamentoLegal: esquemaTextoNullable(3000).optional(),
    tipoSeccion: esquemaCategoriaBase.tipoSeccion.optional(),
    categoriaPadreId: esquemaCategoriaPadreIdActualizar.optional(),
    orden: z.coerce.number().int().min(0).max(9999).optional(),
    estaActivo: z.boolean().optional(),
  })
  .strict()
  .refine((datos) => Object.keys(datos).length > 0);

export const esquemaCambiarEstadoCategoria = z
  .object({
    estaActivo: z.boolean(),
  })
  .strict();

export const esquemaListarCategorias = z
  .object({
    soloRaices: z
      .union([z.literal("true"), z.literal("false"), z.boolean()])
      .optional()
      .transform((valor) => valor === true || valor === "true"),
    tipoSeccion: z
      .union([z.enum(TIPOS_SECCION_TRANSPARENCIA), z.literal("")])
      .optional(),
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
    categoriaPadreId: z
      .union([z.string(), z.number(), z.null(), z.undefined()])
      .optional()
      .transform((valor) => {
        if (valor === undefined || valor === null || valor === "") {
          return undefined;
        }

        const id = Number(valor);
        return Number.isInteger(id) && id > 0 ? id : Number.NaN;
      })
      .refine((valor) => valor === undefined || Number.isInteger(valor)),
    busqueda: z.string().trim().max(120).optional(),
  })
  .strict();
