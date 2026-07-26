import "dotenv/config";
import app from "./app.js";

const puerto = Number(process.env.PORT) || 3000;

const servidor = app.listen(puerto, () => {
  console.log(`API de Chalma ejecutandose en http://localhost:${puerto}`);
  console.log(`Comprobacion: http://localhost:${puerto}/api/health`);
});

servidor.on("error", (error) => {
  console.error("No fue posible iniciar el servidor:", error);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.error("Promesa rechazada sin manejar:", error);

  servidor.close(() => {
    process.exit(1);
  });
});
