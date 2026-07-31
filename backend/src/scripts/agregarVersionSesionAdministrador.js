import "dotenv/config";
import { DataTypes } from "sequelize";
import { pathToFileURL } from "node:url";
import baseDatos from "../config/baseDatos.js";

export async function agregarVersionSesionAdministrador() {
  const tabla = "usuarios_administradores";
  const columna = "version_sesion";
  const queryInterface = baseDatos.getQueryInterface();
  const descripcionTabla = await queryInterface.describeTable(tabla);

  if (descripcionTabla[columna]) {
    return {
      creada: false,
      mensaje: "La columna version_sesion ya existe.",
    };
  }

  await queryInterface.addColumn(tabla, columna, {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  });

  return {
    creada: true,
    mensaje: "La columna version_sesion fue agregada correctamente.",
  };
}

const esEjecucionDirecta = process.argv[1]
  ? import.meta.url === pathToFileURL(process.argv[1]).href
  : false;

if (esEjecucionDirecta) {
  try {
    const resultado = await agregarVersionSesionAdministrador();
    console.log(resultado.mensaje);
  } catch (error) {
    console.error(
      "No fue posible agregar version_sesion:",
      error instanceof Error ? error.message : "Error desconocido"
    );
    process.exitCode = 1;
  } finally {
    await baseDatos.close();
  }
}
