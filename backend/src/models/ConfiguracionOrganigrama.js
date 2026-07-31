import { DataTypes } from "sequelize";

export function definirConfiguracionOrganigrama(baseDatos) {
  return baseDatos.define(
    "ConfiguracionOrganigrama",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
      },
      titulo: {
        type: DataTypes.STRING(180),
        allowNull: true,
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      nombreOriginal: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "nombre_original",
      },
      nombreAlmacenado: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "nombre_almacenado",
      },
      tipoMime: {
        type: DataTypes.STRING(120),
        allowNull: true,
        field: "tipo_mime",
      },
      tamanoBytes: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        field: "tamano_bytes",
      },
      mostrarOrganigrama: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "mostrar_organigrama",
      },
    },
    {
      tableName: "configuracion_organigrama",
      timestamps: true,
      underscored: true,
    }
  );
}
