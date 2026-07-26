import { Sequelize } from "sequelize";

const nombreBaseDatos = process.env.DB_NAME || "chalma_portal";
const usuarioBaseDatos = process.env.DB_USER || "root";
const contrasenaBaseDatos = process.env.DB_PASSWORD || "";

const baseDatos = new Sequelize(
  nombreBaseDatos,
  usuarioBaseDatos,
  contrasenaBaseDatos,
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    dialect: "mysql",
    logging:
      process.env.NODE_ENV === "development" ? console.log : false,
    define: {
      underscored: true,
    },
  }
);

export default baseDatos;
