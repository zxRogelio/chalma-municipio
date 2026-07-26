import { InternalHero } from '../../components/common/InternalHero'
import { CuadriculaCategoriasTransparencia } from '../../components/transparencia/CuadriculaCategoriasTransparencia'
import {
  categoriasObligacionesComunes,
  introduccionObligacionesComunes,
} from '../../data/datosTransparencia'
import { usePageTitle } from '../../hooks/usePageTitle'

export function PaginaObligacionesComunes() {
  usePageTitle('Obligaciones Comunes (LGTAIP)')

  return (
    <main className="internal-main">
      <InternalHero
        eyebrow="Transparencia"
        title="Obligaciones Comunes (LGTAIP)"
        description="Explorador provisional de fracciones y documentos de transparencia."
        breadcrumbs={[
          { label: 'Transparencia', to: '/transparencia' },
          { label: 'Obligaciones Comunes (LGTAIP)' },
        ]}
      />
      <section className="section">
        <div className="container transparency-explorer">
          <div className="transparency-intro">
            <p className="eyebrow">Articulo 15</p>
            <h2>Fracciones de obligaciones comunes</h2>
            <p>{introduccionObligacionesComunes}</p>
          </div>
          <CuadriculaCategoriasTransparencia
            categorias={categoriasObligacionesComunes}
          />
        </div>
      </section>
    </main>
  )
}
