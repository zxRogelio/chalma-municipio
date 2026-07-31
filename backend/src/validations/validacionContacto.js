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

const esquemaTelefono = z.preprocess(
  textoVacioANull,
  z
    .union([
      z
        .string()
        .trim()
        .max(40, "El telefono no puede superar 40 caracteres")
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

const esquemaCorreo = z.preprocess(
  textoVacioANull,
  z
    .union([
      z
        .string()
        .trim()
        .max(180, "El correo no puede superar 180 caracteres")
        .email("El correo electronico no es valido")
        .refine((valor) => !expresionHtml.test(valor), {
          message: "El correo no puede contener HTML",
        }),
      z.null(),
    ])
);

export const esquemaActualizarContacto = z
  .object({
    telefono: esquemaTelefono.optional(),
    correo: esquemaCorreo.optional(),
    mostrarTelefono: z.boolean(),
    mostrarCorreo: z.boolean(),
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
