import { useEffect, useState } from 'react'
import { IconoPortal } from '../../components/common/IconoPortal'
import { InternalHero } from '../../components/common/InternalHero'
import { IconoTransparencia } from '../../components/transparencia/IconoTransparencia'
import { TablaDocumentosTransparencia } from '../../components/transparencia/TablaDocumentosTransparencia'
import { usePageTitle } from '../../hooks/usePageTitle'
import {
  esErrorNoEncontrado,
  solicitudFueCancelada,
} from '../../services/api'
import { obtenerCategoriaPorSlug } from '../../services/servicioTransparencia'
import type { IconoTransparenciaTipo, TransparencySection } from '../../types/site'
import type { CategoriaTransparencia } from '../../types/transparencia'

interface PropiedadesPaginaDocumentosTransparencia {
  section: TransparencySection
}

const iconosPorRuta: Record<string, IconoTransparenciaTipo> = {
  '/transparencia/obligaciones-especificas': 'especificas',
  '/transparencia/obras-publicas': 'obras',
  '/transparencia/fondos-federales': 'fondos',
  '/transparencia/informacion-financiera': 'finanzas',
  '/transparencia/cuenta-publica': 'cuenta',
  '/transparencia/licitaciones': 'licitaciones',
}

export function PaginaDocumentosTransparencia({
  section,
}: PropiedadesPaginaDocumentosTransparencia) {
  const [categoria, establecerCategoria] =
    useState<CategoriaTransparencia | null>(null)
  const [estaCargando, establecerEstaCargando] = useState(true)
  const [mensajeError, establecerMensajeError] = useState('')
  const [categoriaNoEncontrada, establecerCategoriaNoEncontrada] =
    useState(false)
  const [intento, establecerIntento] = useState(0)
  const segmentosRuta = section.route.split('/').filter(Boolean)
  const slug = segmentosRuta[segmentosRuta.length - 1] ?? ''
  const iconoSeccion = iconosPorRuta[section.route] ?? 'documentos'
  const titulo = categoria?.titulo ?? section.title
  const descripcion = categoria?.descripcion ?? section.heroDescription
  const documentos = categoria?.documentos ?? []

  usePageTitle(titulo)

  useEffect(() => {
    const controlador = new AbortController()

    establecerEstaCargando(true)
    establecerMensajeError('')
    establecerCategoriaNoEncontrada(false)

    obtenerCategoriaPorSlug(slug, {
      signal: controlador.signal,
    })
      .then((datos) => {
        establecerCategoria(datos)
      })
      .catch((error: unknown) => {
        if (solicitudFueCancelada(error)) {
          return
        }

        establecerCategoria(null)

        if (esErrorNoEncontrado(error)) {
          establecerCategoriaNoEncontrada(true)
          return
        }

        console.error(error)
        establecerMensajeError(
          'No fue posible cargar la informacion de transparencia.',
        )
      })
      .finally(() => {
        if (!controlador.signal.aborted) {
          establecerEstaCargando(false)
        }
      })

    return () => controlador.abort()
  }, [slug, intento])

  return (
    <main className="internal-main">
      <InternalHero
        eyebrow="Transparencia"
        title={titulo}
        description={descripcion}
        breadcrumbs={[
          { label: 'Transparencia', to: '/transparencia' },
          { label: titulo },
        ]}
      />
      <section className="section">
        <div className="container">
          <div className="section-heading section-heading--split">
            <div className="transparency-heading-row">
              <IconoTransparencia
                tipo={iconoSeccion}
                className="transparency-heading-icon"
              />
              <div>
                <p className="eyebrow">Transparencia</p>
                <h2>{titulo}</h2>
                <p>{categoria?.descripcion ?? section.intro}</p>
              </div>
            </div>
            <label className="year-filter">
              Ejercicio
              <select defaultValue="2026">
                <option>2026</option>
                <option>2025</option>
                <option>2024</option>
              </select>
            </label>
          </div>

          {estaCargando ? (
            <div className="transparency-skeleton-card transparency-skeleton-card--table" />
          ) : null}

          {!estaCargando && mensajeError ? (
            <div className="transparency-empty-state transparency-empty-state--error">
              <h3>{mensajeError}</h3>
              <button
                className="button button--primary"
                type="button"
                onClick={() => establecerIntento((valor) => valor + 1)}
              >
                <IconoPortal tipo="reintentar" className="button-icon" />
                Reintentar
              </button>
            </div>
          ) : null}

          {!estaCargando && !mensajeError && categoriaNoEncontrada ? (
            <div className="transparency-empty-state">
              <h3>No hay documentos disponibles</h3>
              <p>No hay documentos disponibles en este apartado.</p>
            </div>
          ) : null}

          {!estaCargando && !mensajeError && !categoriaNoEncontrada ? (
            <TablaDocumentosTransparencia documentos={documentos} />
          ) : null}
        </div>
      </section>
    </main>
  )
}
