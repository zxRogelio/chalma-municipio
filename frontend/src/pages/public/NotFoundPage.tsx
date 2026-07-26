import { Link } from 'react-router-dom'
import { usePageTitle } from '../../hooks/usePageTitle'

export function NotFoundPage() {
  usePageTitle('Pagina no encontrada')

  return (
    <main className="not-found">
      <div>
        <p className="eyebrow">Error 404</p>
        <h1>Pagina no encontrada</h1>
        <p>La ruta solicitada no existe en el portal municipal.</p>
        <Link className="button button--primary" to="/">
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
