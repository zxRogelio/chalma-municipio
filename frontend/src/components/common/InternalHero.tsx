import { Breadcrumb } from './Breadcrumb'
import type { BreadcrumbItem } from '../../types/site'

interface InternalHeroProps {
  eyebrow: string
  title: string
  description: string
  breadcrumbs: BreadcrumbItem[]
}

export function InternalHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
}: InternalHeroProps) {
  return (
    <section className="internal-hero">
      <div className="container">
        <Breadcrumb items={breadcrumbs} />
        <p className="eyebrow eyebrow--light">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  )
}
