import baseDatos from "../config/baseDatos.js";
import { definirConfiguracionContacto } from "./ConfiguracionContacto.js";
import { definirConfiguracionOrganigrama } from "./ConfiguracionOrganigrama.js";
import { definirCategoriaTransparencia } from "./CategoriaTransparencia.js";
import { definirDirectorioMunicipal } from "./DirectorioMunicipal.js";
import { definirDocumentoTransparencia } from "./DocumentoTransparencia.js";
import { definirUsuarioAdministrador } from "./UsuarioAdministrador.js";

const ConfiguracionContacto =
  definirConfiguracionContacto(baseDatos);
const ConfiguracionOrganigrama =
  definirConfiguracionOrganigrama(baseDatos);
const CategoriaTransparencia =
  definirCategoriaTransparencia(baseDatos);
const DirectorioMunicipal =
  definirDirectorioMunicipal(baseDatos);
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
  ConfiguracionContacto,
  ConfiguracionOrganigrama,
  CategoriaTransparencia,
  DirectorioMunicipal,
  DocumentoTransparencia,
  UsuarioAdministrador,
};
