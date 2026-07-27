import type { CategoriaAdministracion } from '../../types/categoriasAdministracion'
import { etiquetasTipoSeccion } from '../../types/categoriasAdministracion'

interface PropiedadesTablaCategoriasAdministracion {
  categorias: CategoriaAdministracion[]
  onAdministrar?: (categoria: CategoriaAdministracion) => void
  etiquetaAdministrar?: string
  onInformacion?: (categoria: CategoriaAdministracion) => void
  onEditar: (categoria: CategoriaAdministracion) => void
  onCambiarEstado: (categoria: CategoriaAdministracion) => void
}

export function obtenerRutaPublicaCategoria(categoria: CategoriaAdministracion) {
  const rutasPorTipo: Partial<Record<string, string>> = {
    obligaciones_especificas: '/transparencia/obligaciones-especificas',
    obras_publicas: '/transparencia/obras-publicas',
    fondos_federales: '/transparencia/fondos-federales',
    informacion_financiera: '/transparencia/informacion-financiera',
    cuenta_publica: '/transparencia/cuenta-publica',
    licitaciones: '/transparencia/licitaciones',
  }

  if (categoria.tipoSeccion === 'obligaciones_comunes') {
    return categoria.slug === 'obligaciones-comunes'
      ? '/transparencia/obligaciones-comunes'
      : `/transparencia/obligaciones-comunes/${categoria.slug}`
  }

  const rutaBase = rutasPorTipo[categoria.tipoSeccion]

  if (!rutaBase) {
    return null
  }

  return categoria.categoriaPadreId === null ? rutaBase : null
}

export function TablaCategoriasAdministracion({
  categorias,
  onAdministrar,
  etiquetaAdministrar = 'Administrar',
  onInformacion,
  onEditar,
  onCambiarEstado,
}: PropiedadesTablaCategoriasAdministracion) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <caption className="sr-only">Categorias de transparencia</caption>
        <thead>
          <tr>
            <th>Orden</th>
            <th>Titulo</th>
            <th>Seccion</th>
            <th>Categoria padre</th>
            <th>Subcategorias</th>
            <th>Documentos</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => {
            const rutaPublica = obtenerRutaPublicaCategoria(categoria)

            return (
              <tr key={categoria.id}>
                <td>{categoria.orden}</td>
                <td>
                  <span className="admin-table-title" title={categoria.titulo}>
                    {categoria.titulo}
                  </span>
                  <small>{categoria.slug}</small>
                </td>
                <td>{etiquetasTipoSeccion[categoria.tipoSeccion]}</td>
                <td>{categoria.categoriaPadre?.titulo ?? 'Sin padre'}</td>
                <td>{categoria.cantidadSubcategorias}</td>
                <td>{categoria.cantidadDocumentos}</td>
                <td>
                  <span
                    className={`admin-badge ${
                      categoria.estaActivo
                        ? 'admin-badge--active'
                        : 'admin-badge--inactive'
                    }`}
                  >
                    {categoria.estaActivo ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td>
                  <div className="admin-table-actions">
                    {onAdministrar ? (
                      <button
                        type="button"
                        onClick={() => onAdministrar(categoria)}
                      >
                        {etiquetaAdministrar}
                      </button>
                    ) : null}
                    {onInformacion ? (
                      <button
                        type="button"
                        onClick={() => onInformacion(categoria)}
                      >
                        Informacion
                      </button>
                    ) : null}
                    <button type="button" onClick={() => onEditar(categoria)}>
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => onCambiarEstado(categoria)}
                    >
                      {categoria.estaActivo ? 'Desactivar' : 'Activar'}
                    </button>
                    {rutaPublica ? (
                      <a
                        href={rutaPublica}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver en portal
                      </a>
                    ) : (
                      <span>Vista publica pendiente</span>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
