import { DataTypes } from "sequelize";

const tiposSeccion = [
  "obligaciones_comunes",
  "obligaciones_especificas",
  "obras_publicas",
  "fondos_federales",
  "informacion_financiera",
  "cuenta_publica",
  "licitaciones",
];

export function definirCategoriaTransparencia(baseDatos) {
  return baseDatos.define(
    "CategoriaTransparencia",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      categoriaPadreId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        field: "categoria_padre_id",
      },
      titulo: {
        type: DataTypes.STRING(180),
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING(220),
        allowNull: false,
        unique: true,
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      fundamentoLegal: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "fundamento_legal",
      },
      tipoSeccion: {
        type: DataTypes.ENUM(...tiposSeccion),
        allowNull: false,
        field: "tipo_seccion",
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
      tableName: "categorias_transparencia",
      timestamps: true,
      underscored: true,
    }
  );
}
