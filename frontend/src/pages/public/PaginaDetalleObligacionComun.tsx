import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
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
import type { CategoriaTransparencia } from '../../types/transparencia'

export function PaginaDetalleObligacionComun() {
  const { slug } = useParams()
  const [categoria, establecerCategoria] =
    useState<CategoriaTransparencia | null>(null)
  const [estaCargando, establecerEstaCargando] = useState(true)
  const [mensajeError, establecerMensajeError] = useState('')
  const [categoriaNoEncontrada, establecerCategoriaNoEncontrada] =
    useState(false)
  const [intento, establecerIntento] = useState(0)

  usePageTitle(
    categoria?.titulo ??
      (categoriaNoEncontrada ? 'Categoria no encontrada' : 'Transparencia'),
  )

  useEffect(() => {
    const controlador = new AbortController()

    if (!slug) {
      establecerCategoria(null)
      establecerCategoriaNoEncontrada(true)
      establecerEstaCargando(false)
      return () => controlador.abort()
    }

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

  if (estaCargando) {
    return (
      <main className="internal-main">
        <InternalHero
          eyebrow="Transparencia"
          title="Cargando categoria"
          description="Consultando la informacion publicada por el portal municipal."
          breadcrumbs={[
            { label: 'Transparencia', to: '/transparencia' },
            {
              label: 'Obligaciones Comunes (LGTAIP)',
              to: '/transparencia/obligaciones-comunes',
            },
            { label: 'Cargando' },
          ]}
        />
        <section className="section">
          <div className="container transparency-detail">
            <div className="transparency-skeleton-card transparency-skeleton-card--wide" />
            <div className="transparency-skeleton-card transparency-skeleton-card--table" />
          </div>
        </section>
      </main>
    )
  }

  if (mensajeError) {
    return (
      <main className="internal-main">
        <InternalHero
          eyebrow="Transparencia"
          title="Transparencia"
          description="No fue posible consultar la informacion del apartado."
          breadcrumbs={[
            { label: 'Transparencia', to: '/transparencia' },
            {
              label: 'Obligaciones Comunes (LGTAIP)',
              to: '/transparencia/obligaciones-comunes',
            },
            { label: 'Error de consulta' },
          ]}
        />
        <section className="section">
          <div className="container">
            <div className="transparency-empty-state transparency-empty-state--error">
              <h2>{mensajeError}</h2>
              <button
                className="button button--primary"
                type="button"
                onClick={() => establecerIntento((valor) => valor + 1)}
              >
                <IconoPortal tipo="reintentar" className="button-icon" />
                Reintentar
              </button>
            </div>
          </div>
        </section>
      </main>
    )
  }

  if (categoriaNoEncontrada || !categoria) {
    return (
      <main className="internal-main">
        <InternalHero
          eyebrow="Transparencia"
          title="Categoria no encontrada"
          description="La fraccion solicitada no existe en el explorador de obligaciones comunes."
          breadcrumbs={[
            { label: 'Transparencia', to: '/transparencia' },
            {
              label: 'Obligaciones Comunes (LGTAIP)',
              to: '/transparencia/obligaciones-comunes',
            },
            { label: 'Categoria no encontrada' },
          ]}
        />
        <section className="section">
          <div className="container">
            <div className="transparency-empty-state">
              <h2>No se encontro la categoria</h2>
              <p>
                Revisa la ruta o vuelve al explorador de obligaciones comunes
                para seleccionar una fraccion disponible.
              </p>
              <Link
                className="button button--primary"
                to="/transparencia/obligaciones-comunes"
              >
                <IconoPortal tipo="volver" className="button-icon" />
                Volver al explorador
              </Link>
            </div>
          </div>
        </section>
      </main>
    )
  }

  const documentos = categoria.documentos ?? []
  const etiquetaCategoriaPadre =
    categoria.categoriaPadre?.titulo ?? 'Obligaciones Comunes (LGTAIP)'

  return (
    <main className="internal-main">
      <InternalHero
        eyebrow="Transparencia"
        title={categoria.titulo}
        description={
          categoria.descripcion ?? 'Informacion de transparencia municipal.'
        }
        breadcrumbs={[
          { label: 'Transparencia', to: '/transparencia' },
          {
            label: etiquetaCategoriaPadre,
            to: '/transparencia/obligaciones-comunes',
          },
          { label: categoria.titulo },
        ]}
      />
      <section className="section">
        <div className="container transparency-detail">
          <div className="content-card transparency-detail-card">
            <div className="transparency-detail-heading">
              <IconoTransparencia
                tipo="obligaciones"
                className="transparency-heading-icon"
              />
              <div>
                <p className="eyebrow">Detalle de fraccion</p>
                <h2 title={categoria.titulo}>{categoria.titulo}</h2>
                <p>{categoria.descripcion}</p>
              </div>
            </div>
            {categoria.fundamentoLegal ? (
              <p className="legal-basis">
                <strong>Fundamento legal:</strong> {categoria.fundamentoLegal}
              </p>
            ) : null}
          </div>

          <section
            className="transparency-files"
            aria-labelledby="titulo-archivos-disponibles"
          >
            <div className="section-heading section-heading--split transparency-files-heading">
              <div className="transparency-heading-row">
                <IconoTransparencia
                  tipo="documentos"
                  className="transparency-heading-icon"
                />
                <div>
                  <p className="eyebrow">Documentos</p>
                  <h2 id="titulo-archivos-disponibles">
                    Archivos disponibles
                  </h2>
                  <p>
                    {documentos.length === 1
                      ? 'Este apartado tiene 1 documento publicado.'
                      : `Este apartado tiene ${documentos.length} documentos publicados.`}
                  </p>
                </div>
              </div>
            </div>
            <TablaDocumentosTransparencia documentos={documentos} />
          </section>
        </div>
      </section>
    </main>
  )
}
