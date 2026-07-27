import { DataTypes } from "sequelize";

const expresionNombreUsuario = /^[a-zA-Z0-9._-]+$/;

export function normalizarNombreUsuario(nombreUsuario) {
  return String(nombreUsuario || "").trim().toLowerCase();
}

export function definirUsuarioAdministrador(baseDatos) {
  const UsuarioAdministrador = baseDatos.define(
    "UsuarioAdministrador",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      nombre: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      nombreUsuario: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: "nombre_usuario",
        set(valor) {
          this.setDataValue("nombreUsuario", normalizarNombreUsuario(valor));
        },
        validate: {
          len: [4, 50],
          is: expresionNombreUsuario,
        },
      },
      contrasenaHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: "contrasena_hash",
      },
      rol: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "administrador",
      },
      estaActivo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: "esta_activo",
      },
      ultimoAcceso: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "ultimo_acceso",
      },
    },
    {
      tableName: "usuarios_administradores",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  UsuarioAdministrador.prototype.toJSON = function toJSON() {
    const valores = { ...this.get() };
    delete valores.contrasenaHash;
    return valores;
  };

  return UsuarioAdministrador;
}
