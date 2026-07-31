import { z } from "zod";

const expresionMayuscula = /[A-Z]/;
const expresionMinuscula = /[a-z]/;
const expresionNumero = /[0-9]/;
const expresionSimbolo = /[^A-Za-z0-9\s]/;

const esquemaContrasenaNueva = z
  .string({
    error: "La contrasena nueva es obligatoria.",
  })
  .min(12, "La contrasena nueva debe tener al menos 12 caracteres.")
  .max(128, "La contrasena nueva no puede superar 128 caracteres.")
  .regex(
    expresionMayuscula,
    "La contrasena nueva debe incluir al menos una letra mayuscula."
  )
  .regex(
    expresionMinuscula,
    "La contrasena nueva debe incluir al menos una letra minuscula."
  )
  .regex(
    expresionNumero,
    "La contrasena nueva debe incluir al menos un numero."
  )
  .regex(
    expresionSimbolo,
    "La contrasena nueva debe incluir al menos un simbolo."
  )
  .refine((valor) => valor.trim().length > 0, {
    message: "La contrasena nueva no puede contener solamente espacios.",
  });

export const esquemaCambiarContrasena = z
  .object({
    contrasenaActual: z
      .string({
        error: "La contrasena actual es obligatoria.",
      })
      .min(1, "La contrasena actual es obligatoria.")
      .max(200, "La contrasena actual no puede superar 200 caracteres."),
    contrasenaNueva: esquemaContrasenaNueva,
    confirmacionContrasena: z
      .string({
        error: "La confirmacion de contrasena es obligatoria.",
      })
      .min(1, "La confirmacion de contrasena es obligatoria.")
      .max(
        128,
        "La confirmacion de contrasena no puede superar 128 caracteres."
      ),
  })
  .strict()
  .superRefine((datos, contexto) => {
    if (datos.contrasenaNueva !== datos.confirmacionContrasena) {
      contexto.addIssue({
        code: "custom",
        path: ["confirmacionContrasena"],
        message:
          "La contrasena nueva y su confirmacion no coinciden.",
      });
    }

    if (datos.contrasenaNueva === datos.contrasenaActual) {
      contexto.addIssue({
        code: "custom",
        path: ["contrasenaNueva"],
        message:
          "La contrasena nueva debe ser diferente de la contrasena actual.",
      });
    }
  });
