import type { CategoriaTransparencia } from '../../types/transparencia'
import { TarjetaCategoriaTransparencia } from './TarjetaCategoriaTransparencia'

interface PropiedadesCuadriculaCategoriasTransparencia {
  categorias: CategoriaTransparencia[]
}

export function CuadriculaCategoriasTransparencia({
  categorias,
}: PropiedadesCuadriculaCategoriasTransparencia) {
  const categoriasOrdenadas = [...categorias].sort(
    (actual, siguiente) => actual.orden - siguiente.orden,
  )

  return (
    <div className="transparency-category-grid">
      {categoriasOrdenadas.map((categoria) => (
        <TarjetaCategoriaTransparencia
          categoria={categoria}
          key={categoria.id}
        />
      ))}
    </div>
  )
}
