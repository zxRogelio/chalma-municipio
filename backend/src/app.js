import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

const app = express();

const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

app.use(helmet());

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    message: "API del portal municipal de Chalma",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "chalma-api",
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    path: req.originalUrl,
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.status || 500).json({
    error: "Error interno del servidor",
    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : undefined,
  });
});

export default app;