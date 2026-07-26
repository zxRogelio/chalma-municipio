import { Sequelize } from "sequelize";

const nombreBaseDatos = process.env.DB_NAME || "chalma_portal";
const usuarioBaseDatos = process.env.DB_USER || "root";
const contrasenaBaseDatos = process.env.DB_PASSWORD || "";
const mostrarConsultas = process.env.DB_LOGGING === "true";

const baseDatos = new Sequelize(
  nombreBaseDatos,
  usuarioBaseDatos,
  contrasenaBaseDatos,
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    dialect: "mysql",
    logging: mostrarConsultas ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      charset: "utf8mb4",
    },
    define: {
      underscored: true,
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    },
  }
);

export const comprobarConexionBaseDatos = async () => {
  try {
    await baseDatos.authenticate();
    return true;
  } catch (error) {
    console.error(
      "No fue posible conectar con la base de datos:",
      error instanceof Error ? error.message : "Error desconocido"
    );
    return false;
  }
};

export default baseDatos;
