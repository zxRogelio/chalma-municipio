import "dotenv/config";
import app from "./app.js";

const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, () => {
  console.log(`API de Chalma ejecutándose en http://localhost:${PORT}`);
  console.log(
    `Comprobación: http://localhost:${PORT}/api/health`
  );
});

server.on("error", (error) => {
  console.error("No fue posible iniciar el servidor:", error);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.error("Promesa rechazada sin manejar:", error);

  server.close(() => {
    process.exit(1);
  });
});