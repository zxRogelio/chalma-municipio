import type { TransparencyCategory } from '../../data/transparencyData'
import { TransparencyCategoryCard } from './TransparencyCategoryCard'

interface TransparencyCategoryGridProps {
  categories: TransparencyCategory[]
}

export function TransparencyCategoryGrid({
  categories,
}: TransparencyCategoryGridProps) {
  const sortedCategories = [...categories].sort(
    (current, next) => current.sortOrder - next.sortOrder,
  )

  return (
    <div className="transparency-category-grid">
      {sortedCategories.map((category) => (
        <TransparencyCategoryCard category={category} key={category.id} />
      ))}
    </div>
  )
}
