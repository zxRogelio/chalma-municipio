import { DataTypes } from "sequelize";

export function definirDirectorioMunicipal(baseDatos) {
  return baseDatos.define(
    "DirectorioMunicipal",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      area: {
        type: DataTypes.STRING(180),
        allowNull: false,
      },
      titular: {
        type: DataTypes.STRING(180),
        allowNull: true,
      },
      cargo: {
        type: DataTypes.STRING(180),
        allowNull: true,
      },
      telefono: {
        type: DataTypes.STRING(40),
        allowNull: true,
      },
      correo: {
        type: DataTypes.STRING(180),
        allowNull: true,
      },
      mostrarTelefono: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "mostrar_telefono",
      },
      mostrarCorreo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "mostrar_correo",
      },
      orden: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      estaActivo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: "esta_activo",
      },
    },
    {
      tableName: "directorio_municipal",
      timestamps: true,
      underscored: true,
    }
  );
}
