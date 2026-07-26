import { Link } from 'react-router-dom'
import type { CategoriaTransparencia } from '../../data/datosTransparencia'

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
      <span className="folder-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4H9l2 2h7.5A2.5 2.5 0 0 1 21 8.5v8A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5z" />
        </svg>
      </span>
      <h3>{categoria.titulo}</h3>
      <p>
        {cantidadDocumentos} {textoDocumentos}
      </p>
    </Link>
  )
}
