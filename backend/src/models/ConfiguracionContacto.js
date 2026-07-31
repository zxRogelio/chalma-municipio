import { DataTypes } from "sequelize";

export function definirConfiguracionContacto(baseDatos) {
  return baseDatos.define(
    "ConfiguracionContacto",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
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
    },
    {
      tableName: "configuracion_contacto",
      timestamps: true,
      underscored: true,
    }
  );
}
