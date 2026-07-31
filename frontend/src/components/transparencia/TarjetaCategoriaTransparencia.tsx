import { Link } from 'react-router-dom'
import { IconoPortal } from '../common/IconoPortal'
import type { CategoriaTransparencia } from '../../types/transparencia'

interface PropiedadesTarjetaCategoriaTransparencia {
  categoria: CategoriaTransparencia
}

export function TarjetaCategoriaTransparencia({
  categoria,
}: PropiedadesTarjetaCategoriaTransparencia) {
  const cantidadDocumentos = categoria.cantidadDocumentos
  const textoDocumentos = cantidadDocumentos === 1 ? 'documento' : 'documentos'

  return (
    <Link
      className="transparency-category-card"
      to={`/transparencia/apartado/${categoria.slug}`}
      title={categoria.titulo}
      aria-label={`${categoria.titulo}, ${cantidadDocumentos} ${textoDocumentos}`}
    >
      <IconoPortal tipo="carpeta" className="folder-icon" />
      <h3>{categoria.titulo}</h3>
      {categoria.descripcion ? (
        <p className="transparency-category-description">
          {categoria.descripcion}
        </p>
      ) : null}
      <p>
        {cantidadDocumentos} {textoDocumentos}
      </p>
    </Link>
  )
}
