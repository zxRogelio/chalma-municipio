import { DataTypes } from "sequelize";

export function definirDocumentoTransparencia(baseDatos) {
  return baseDatos.define(
    "DocumentoTransparencia",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      categoriaId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: "categoria_id",
      },
      titulo: {
        type: DataTypes.STRING(220),
        allowNull: false,
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ejercicioFiscal: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: "ejercicio_fiscal",
      },
      periodo: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      tipoArchivo: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: "tipo_archivo",
      },
      tipoMime: {
        type: DataTypes.STRING(120),
        allowNull: true,
        field: "tipo_mime",
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
      urlPublica: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: "url_publica",
      },
      tamanoBytes: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        field: "tamano_bytes",
      },
      fechaPublicacion: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "fecha_publicacion",
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
      tableName: "documentos_transparencia",
      timestamps: true,
      underscored: true,
    }
  );
}
