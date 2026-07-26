import { Link } from 'react-router-dom'
import type { BreadcrumbItem } from '../../types/site'

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="breadcrumb" aria-label="Migas de pan">
      <Link to="/">Inicio</Link>
      {items.map((item) => (
        <span className="breadcrumb-item" key={item.label}>
          <span aria-hidden="true">/</span>
          {item.to ? <Link to={item.to}>{item.label}</Link> : <span>{item.label}</span>}
        </span>
      ))}
    </nav>
  )
}
