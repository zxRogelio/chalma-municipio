import { Link } from 'react-router-dom'
import type { TransparencyCategory } from '../../data/transparencyData'

interface TransparencyCategoryCardProps {
  category: TransparencyCategory
}

export function TransparencyCategoryCard({
  category,
}: TransparencyCategoryCardProps) {
  const documentCount = category.documents.length
  const documentLabel = documentCount === 1 ? 'documento' : 'documentos'

  return (
    <Link
      className="transparency-category-card"
      to={`/transparencia/obligaciones-comunes/${category.slug}`}
      title={category.title}
      aria-label={`${category.title}, ${documentCount} ${documentLabel}`}
    >
      <span className="folder-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4H9l2 2h7.5A2.5 2.5 0 0 1 21 8.5v8A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5z" />
        </svg>
      </span>
      <h3>{category.title}</h3>
      <p>
        {documentCount} {documentLabel}
      </p>
    </Link>
  )
}
