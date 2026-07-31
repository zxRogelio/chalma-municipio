import { Sequelize } from "sequelize";
import { configuracionEntorno } from "./configuracionEntorno.js";

const { baseDatos: configuracionBaseDatos } = configuracionEntorno;

const baseDatos = new Sequelize(
  configuracionBaseDatos.nombre,
  configuracionBaseDatos.usuario,
  configuracionBaseDatos.contrasena,
  {
    host: configuracionBaseDatos.host,
    port: configuracionBaseDatos.puerto,
    dialect: "mysql",
    logging: configuracionBaseDatos.logging ? console.log : false,
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

export const comprobarConexionBaseDatos = async ({
  registrarError = false,
} = {}) => {
  try {
    await baseDatos.authenticate();
    return true;
  } catch {
    if (registrarError) {
      console.error("No fue posible conectar con la base de datos.");
    }

    return false;
  }
};

export const verificarConexionBaseDatos = async () => {
  const conectada = await comprobarConexionBaseDatos({
    registrarError: false,
  });

  if (!conectada) {
    throw new Error("No fue posible conectar con la base de datos.");
  }
};

export default baseDatos;
