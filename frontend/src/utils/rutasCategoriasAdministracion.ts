import type { CategoriaAdministracion } from '../types/categoriasAdministracion'

export function obtenerRutaPublicaCategoria(
  categoria: CategoriaAdministracion,
) {
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
