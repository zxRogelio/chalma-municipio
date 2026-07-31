import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import rutasContactoAdministracion from "./routes/rutasContactoAdministracion.js";
import rutasContactoPublico from "./routes/rutasContactoPublico.js";
import rutasDirectorioPublico from "./routes/rutasDirectorioPublico.js";
import rutasOrganigramaPublico from "./routes/rutasOrganigramaPublico.js";
import rutasTransparenciaPublica from "./routes/rutasTransparenciaPublica.js";
import rutasAutenticacion from "./routes/rutasAutenticacion.js";
import rutasAdministracion from "./routes/rutasAdministracion.js";
import { requerirAdministrador } from "./middleware/requerirAdministrador.js";
import { configuracionEntorno } from "./config/configuracionEntorno.js";
import { comprobarConexionBaseDatos } from "./config/baseDatos.js";

const app = express();

const origenesCorsPermitidos = new Set(
  configuracionEntorno.corsOrigenesPermitidos
);

function validarOrigenCors(origen, callback) {
  if (!origen) {
    callback(null, true);
    return;
  }

  if (origenesCorsPermitidos.has(origen)) {
    callback(null, true);
    return;
  }

  callback(new Error("Origen no permitido por CORS"));
}

if (configuracionEntorno.trustProxy) {
  app.set("trust proxy", 1);
}

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "base-uri": ["'self'"],
        "object-src": ["'none'"],
        "script-src": ["'self'"],
        "style-src": ["'self'"],
        "img-src": ["'self'", "data:"],
        "frame-src": [
          "'self'",
          "https://www.google.com",
          "https://maps.google.com",
        ],
        "frame-ancestors": ["'self'"],
      },
    },
  })
);

app.use(
  cors({
    origin: validarOrigenCors,
    credentials: true,
  })
);

const limitarApiGeneral = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (solicitud) =>
    solicitud.method === "GET" && solicitud.path.includes("/archivo"),
  handler: (_solicitud, respuesta) =>
    respuesta.status(429).json({
      exito: false,
      mensaje: "Demasiadas solicitudes. Intenta nuevamente mas tarde.",
    }),
});

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());
app.use("/api", limitarApiGeneral);

app.get("/", (_solicitud, respuesta) => {
  respuesta.json({
    message: "API del portal municipal de Chalma",
  });
});

app.get("/api/health", async (_solicitud, respuesta) => {
  const baseDatosConectada = await comprobarConexionBaseDatos();

  respuesta.status(baseDatosConectada ? 200 : 503).json({
    estado: baseDatosConectada ? "ok" : "error",
    servicio: "chalma-api",
    baseDatos: baseDatosConectada ? "conectada" : "desconectada",
    fecha: new Date().toISOString(),
  });
});

app.use("/api/transparencia", rutasTransparenciaPublica);
app.use("/api/contacto", rutasContactoPublico);
app.use("/api/directorio", rutasDirectorioPublico);
app.use("/api/organigrama", rutasOrganigramaPublico);
app.use("/api/autenticacion", rutasAutenticacion);
app.use(
  "/api/admin/contacto",
  requerirAdministrador,
  rutasContactoAdministracion
);
app.use(
  "/api/administracion",
  requerirAdministrador,
  rutasAdministracion
);

app.use((solicitud, respuesta) => {
  if (solicitud.originalUrl.startsWith("/api/transparencia")) {
    respuesta.status(404).json({
      exito: false,
      mensaje: "Ruta no encontrada",
    });
    return;
  }

  respuesta.status(404).json({
    error: "Ruta no encontrada",
    path: solicitud.originalUrl,
  });
});

app.use((error, solicitud, respuesta, _siguiente) => {
  console.error(
    "Error no controlado:",
    error instanceof Error ? error.message : "Error desconocido"
  );

  if (solicitud.originalUrl.startsWith("/api/transparencia")) {
    respuesta.status(error.status || 500).json({
      exito: false,
      mensaje: "Ocurrio un error al consultar la informacion",
    });
    return;
  }

  respuesta.status(error.status || 500).json({
    error: "Error interno del servidor",
    message:
      configuracionEntorno.nodeEnv === "development"
        ? error.message
        : undefined,
  });
});

export default app;
