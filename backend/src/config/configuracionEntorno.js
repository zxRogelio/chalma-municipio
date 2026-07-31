import { z } from "zod";

const origenesLocalesDesarrollo = new Set([
  "localhost",
  "127.0.0.1",
]);

const secretosGenericosProduccion = [
  "secret",
  "changeme",
  "reemplazar",
  "desarrollo",
  "123456",
];

export class ErrorConfiguracionEntorno extends Error {
  constructor(mensajes) {
    super(
      [
        "La configuracion del entorno no es valida.",
        ...mensajes.map((mensaje) => `- ${mensaje}`),
      ].join("\n")
    );
    this.name = "ErrorConfiguracionEntorno";
    this.mensajes = mensajes;
  }
}

function convertirBooleano(valor) {
  if (valor === undefined || valor === null || valor === "") {
    return undefined;
  }

  if (typeof valor === "boolean") {
    return valor;
  }

  const texto = String(valor).trim().toLowerCase();

  if (["true", "1", "yes", "si"].includes(texto)) {
    return true;
  }

  if (["false", "0", "no"].includes(texto)) {
    return false;
  }

  return valor;
}

function separarOrigenes(valor) {
  if (!valor) {
    return [];
  }

  return String(valor)
    .split(",")
    .map((origen) => origen.trim())
    .filter(Boolean);
}

function crearUrl(valor) {
  try {
    return new URL(valor);
  } catch {
    return null;
  }
}

function esOrigenLocal(url) {
  return origenesLocalesDesarrollo.has(url.hostname);
}

function normalizarOrigen(valor, campo, errores) {
  const url = crearUrl(valor);

  if (!url) {
    errores.push(`${campo} debe ser una URL valida.`);
    return null;
  }

  return url.origin;
}

const esquemaBooleanoEntorno = z.preprocess(
  convertirBooleano,
  z.boolean().optional()
);

const esquemaVariablesEntorno = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce.number().int().positive().default(3000),
    FRONTEND_URL: z
      .string()
      .trim()
      .url()
      .default("http://localhost:5173"),
    CORS_ORIGINS: z.string().trim().optional().default(""),
    DB_HOST: z.string().trim().min(1).default("localhost"),
    DB_PORT: z.coerce.number().int().positive().default(3306),
    DB_NAME: z.string().trim().min(1).default("chalma_portal"),
    DB_USER: z.string().trim().min(1).default("root"),
    DB_PASSWORD: z.string().default(""),
    DB_LOGGING: esquemaBooleanoEntorno.default(false),
    JWT_SECRET: z.string().min(32),
    JWT_EXPIRES_IN: z.string().trim().min(1).default("8h"),
    COOKIE_NAME: z.string().trim().min(1).default("chalma_admin_sesion"),
    COOKIE_SECURE: esquemaBooleanoEntorno,
    COOKIE_SAME_SITE: z
      .preprocess(
        (valor) =>
          valor === undefined || valor === null || valor === ""
            ? undefined
            : String(valor).trim().toLowerCase(),
        z.enum(["lax", "strict", "none"]).optional()
      )
      .default("lax"),
    COOKIE_DOMAIN: z.string().trim().optional().default(""),
    TRUST_PROXY: esquemaBooleanoEntorno,
    MAX_FILE_SIZE_MB: z.coerce.number().positive().default(20),
  })
  .passthrough();

function formatearErroresZod(error) {
  return error.issues.map((issue) => {
    const campo = issue.path.join(".") || "entorno";
    return `${campo}: ${issue.message}`;
  });
}

export function validarVariablesEntorno(entorno = process.env) {
  const resultado = esquemaVariablesEntorno.safeParse(entorno);

  if (!resultado.success) {
    throw new ErrorConfiguracionEntorno(
      formatearErroresZod(resultado.error)
    );
  }

  const datos = resultado.data;
  const errores = [];
  const urlFrontend = crearUrl(datos.FRONTEND_URL);

  if (!urlFrontend) {
    errores.push("FRONTEND_URL debe ser una URL valida.");
  }

  const esProduccion = datos.NODE_ENV === "production";
  const cookieSecure =
    datos.COOKIE_SECURE === undefined
      ? esProduccion
      : datos.COOKIE_SECURE;
  const trustProxy =
    datos.TRUST_PROXY === undefined ? esProduccion : datos.TRUST_PROXY;

  if (esProduccion) {
    ["FRONTEND_URL", "DB_HOST", "DB_NAME", "DB_USER"].forEach(
      (variable) => {
        if (!String(entorno[variable] || "").trim()) {
          errores.push(`${variable} es obligatorio en produccion.`);
        }
      }
    );

    const frontendEsLocal = urlFrontend ? esOrigenLocal(urlFrontend) : false;

    if (
      urlFrontend &&
      urlFrontend.protocol !== "https:" &&
      !frontendEsLocal
    ) {
      errores.push(
        "FRONTEND_URL debe usar HTTPS en produccion. La unica excepcion documentada es un entorno local."
      );
    }

    if (!cookieSecure) {
      errores.push("COOKIE_SECURE debe ser true en produccion.");
    }

    if (!String(entorno.DB_PASSWORD || "").trim()) {
      errores.push("DB_PASSWORD es obligatorio en produccion.");
    }

    const secretoNormalizado = datos.JWT_SECRET.trim().toLowerCase();
    const usaSecretoGenerico = secretosGenericosProduccion.some(
      (valor) => secretoNormalizado.includes(valor)
    );

    if (usaSecretoGenerico) {
      errores.push(
        "JWT_SECRET no puede usar valores genericos en produccion."
      );
    }
  }

  if (datos.COOKIE_SAME_SITE === "none" && !cookieSecure) {
    errores.push(
      "COOKIE_SAME_SITE=none requiere COOKIE_SECURE=true."
    );
  }

  const origenesCors = new Set();

  if (urlFrontend) {
    origenesCors.add(urlFrontend.origin);
  }

  separarOrigenes(datos.CORS_ORIGINS).forEach((origen) => {
    const origenNormalizado = normalizarOrigen(
      origen,
      "CORS_ORIGINS",
      errores
    );

    if (origenNormalizado) {
      origenesCors.add(origenNormalizado);
    }
  });

  if (datos.NODE_ENV === "development") {
    [...origenesCors].forEach((origen) => {
      const urlOrigen = crearUrl(origen);

      if (urlOrigen && !esOrigenLocal(urlOrigen)) {
        errores.push(
          "En development, CORS solo debe incluir origenes locales."
        );
      }
    });
  }

  if (errores.length > 0) {
    throw new ErrorConfiguracionEntorno(errores);
  }

  return {
    nodeEnv: datos.NODE_ENV,
    esProduccion,
    puerto: datos.PORT,
    frontendUrl: datos.FRONTEND_URL,
    corsOrigenesPermitidos: [...origenesCors],
    baseDatos: {
      host: datos.DB_HOST,
      puerto: datos.DB_PORT,
      nombre: datos.DB_NAME,
      usuario: datos.DB_USER,
      contrasena: datos.DB_PASSWORD,
      logging: Boolean(datos.DB_LOGGING),
    },
    jwtSecret: datos.JWT_SECRET,
    jwtExpiresIn: datos.JWT_EXPIRES_IN,
    cookieName: datos.COOKIE_NAME,
    cookieSecure,
    cookieSameSite: datos.COOKIE_SAME_SITE,
    cookieDomain: datos.COOKIE_DOMAIN || undefined,
    trustProxy,
    maxFileSizeMb: datos.MAX_FILE_SIZE_MB,
  };
}

export const configuracionEntorno =
  validarVariablesEntorno(process.env);
