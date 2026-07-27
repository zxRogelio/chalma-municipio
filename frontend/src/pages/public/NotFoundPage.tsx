import { Link } from 'react-router-dom'
import { IconoPortal } from '../../components/common/IconoPortal'
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
          <IconoPortal tipo="volver" className="button-icon" />
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
