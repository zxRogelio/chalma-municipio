import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rutasTransparenciaPublica from "./routes/rutasTransparenciaPublica.js";
import rutasAutenticacion from "./routes/rutasAutenticacion.js";
import rutasAdministracion from "./routes/rutasAdministracion.js";
import { requerirAdministrador } from "./middleware/requerirAdministrador.js";
import { comprobarConexionBaseDatos } from "./config/baseDatos.js";

const app = express();

const urlFrontend = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(helmet());

app.use(
  cors({
    origin: urlFrontend,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (_solicitud, respuesta) => {
  respuesta.json({
    message: "API del portal municipal de Chalma",
  });
});

app.get("/api/health", async (_solicitud, respuesta) => {
  const baseDatosConectada = await comprobarConexionBaseDatos();

  respuesta.status(baseDatosConectada ? 200 : 503).json({
    estado: baseDatosConectada ? "ok" : "degradado",
    servicio: "chalma-api",
    baseDatos: baseDatosConectada ? "conectada" : "desconectada",
    fecha: new Date().toISOString(),
  });
});

app.use("/api/transparencia", rutasTransparenciaPublica);
app.use("/api/autenticacion", rutasAutenticacion);
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
  console.error(error);

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
      process.env.NODE_ENV === "development"
        ? error.message
        : undefined,
  });
});

export default app;
