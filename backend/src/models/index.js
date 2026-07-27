import baseDatos from "../config/baseDatos.js";
import { definirCategoriaTransparencia } from "./CategoriaTransparencia.js";
import { definirDocumentoTransparencia } from "./DocumentoTransparencia.js";
import { definirUsuarioAdministrador } from "./UsuarioAdministrador.js";

const CategoriaTransparencia =
  definirCategoriaTransparencia(baseDatos);
const DocumentoTransparencia =
  definirDocumentoTransparencia(baseDatos);
const UsuarioAdministrador =
  definirUsuarioAdministrador(baseDatos);

CategoriaTransparencia.belongsTo(CategoriaTransparencia, {
  as: "categoriaPadre",
  foreignKey: "categoriaPadreId",
});

CategoriaTransparencia.hasMany(CategoriaTransparencia, {
  as: "categoriasHijas",
  foreignKey: "categoriaPadreId",
});

CategoriaTransparencia.hasMany(DocumentoTransparencia, {
  as: "documentos",
  foreignKey: "categoriaId",
});

DocumentoTransparencia.belongsTo(CategoriaTransparencia, {
  as: "categoria",
  foreignKey: "categoriaId",
});

export {
  baseDatos,
  CategoriaTransparencia,
  DocumentoTransparencia,
  UsuarioAdministrador,
};
