import { Link } from 'react-router-dom'
import type { CategoriaTransparencia } from '../../data/datosTransparencia'
import { IconoTransparencia } from './IconoTransparencia'

interface PropiedadesTarjetaCategoriaTransparencia {
  categoria: CategoriaTransparencia
}

export function TarjetaCategoriaTransparencia({
  categoria,
}: PropiedadesTarjetaCategoriaTransparencia) {
  const cantidadDocumentos = categoria.documentos.length
  const textoDocumentos = cantidadDocumentos === 1 ? 'documento' : 'documentos'

  return (
    <Link
      className="transparency-category-card"
      to={`/transparencia/obligaciones-comunes/${categoria.slug}`}
      title={categoria.titulo}
      aria-label={`${categoria.titulo}, ${cantidadDocumentos} ${textoDocumentos}`}
    >
      <IconoTransparencia tipo="obligaciones" className="folder-icon" />
      <h3>{categoria.titulo}</h3>
      <p>
        {cantidadDocumentos} {textoDocumentos}
      </p>
    </Link>
  )
}
