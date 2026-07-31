import { z } from "zod";

const expresionTelefono = /^[0-9+\-()\s]+$/;
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

const textoRequerido = (maximo) =>
  z
    .string()
    .trim()
    .min(2)
    .max(maximo)
    .refine((valor) => !expresionHtml.test(valor), {
      message: "El campo no puede contener HTML",
    });

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

const telefonoNullable = z.preprocess(
  textoVacioANull,
  z.union([
    z
      .string()
      .trim()
      .max(40)
      .regex(
        expresionTelefono,
        "El telefono solo puede incluir numeros, espacios, +, guiones y parentesis"
      )
      .refine((valor) => !expresionHtml.test(valor), {
        message: "El telefono no puede contener HTML",
      }),
    z.null(),
  ])
);

const correoNullable = z.preprocess(
  textoVacioANull,
  z.union([
    z
      .string()
      .trim()
      .max(180)
      .email("El correo electronico no es valido")
      .refine((valor) => !expresionHtml.test(valor), {
        message: "El correo no puede contener HTML",
      }),
    z.null(),
  ])
);

const esquemaDirectorioBase = z
  .object({
    area: textoRequerido(180),
    titular: textoNullable(180).optional(),
    cargo: textoNullable(180).optional(),
    telefono: telefonoNullable.optional(),
    correo: correoNullable.optional(),
    mostrarTelefono: z.boolean().default(false),
    mostrarCorreo: z.boolean().default(false),
    orden: z.coerce.number().int().min(0).default(0),
    estaActivo: z.boolean().default(true),
  })
  .strict()
  .superRefine((datos, contexto) => {
    if (datos.mostrarTelefono && !datos.telefono) {
      contexto.addIssue({
        code: "custom",
        path: ["telefono"],
        message:
          "Captura un telefono antes de mostrarlo en el portal",
      });
    }

    if (datos.mostrarCorreo && !datos.correo) {
      contexto.addIssue({
        code: "custom",
        path: ["correo"],
        message:
          "Captura un correo electronico antes de mostrarlo en el portal",
      });
    }
  });

export const esquemaCrearDirectorio = esquemaDirectorioBase;
export const esquemaActualizarDirectorio = esquemaDirectorioBase;

export const esquemaCambiarEstadoDirectorio = z
  .object({
    estaActivo: z.boolean(),
  })
  .strict();
