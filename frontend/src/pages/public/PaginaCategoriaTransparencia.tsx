import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { IconoPortal } from '../../components/common/IconoPortal'
import { InternalHero } from '../../components/common/InternalHero'
import { CuadriculaCategoriasTransparencia } from '../../components/transparencia/CuadriculaCategoriasTransparencia'
import { IconoTransparencia } from '../../components/transparencia/IconoTransparencia'
import { TablaDocumentosTransparencia } from '../../components/transparencia/TablaDocumentosTransparencia'
import { usePageTitle } from '../../hooks/usePageTitle'
import {
  esErrorNoEncontrado,
  solicitudFueCancelada,
} from '../../services/api'
import { obtenerCategoriaPublicaPorSlug } from '../../services/servicioTransparencia'
import type { BreadcrumbItem } from '../../types/site'
import type { CategoriaPublicaTransparencia } from '../../types/transparencia'

interface PropiedadesPaginaCategoriaTransparencia {
  slugFijo?: string
}

function construirBreadcrumbs(
  datos: CategoriaPublicaTransparencia | null,
): BreadcrumbItem[] {
  if (!datos) {
    return [{ label: 'Transparencia', to: '/transparencia' }]
  }

  return [
    { label: 'Transparencia', to: '/transparencia' },
    ...datos.breadcrumbs.map((categoria) => ({
      label: categoria.titulo,
      to: `/transparencia/apartado/${categoria.slug}`,
    })),
    { label: datos.categoria.titulo },
  ]
}

function obtenerParrafosInformacion(texto: string | null | undefined) {
  return (
    texto
      ?.split(/\n\s*\n/)
      .map((parrafo) => parrafo.trim())
      .filter(Boolean) ?? []
  )
}

function renderizarParrafos(parrafos: string[], prefijo: string) {
  return parrafos.map((parrafo, indice) => (
    <p key={`${prefijo}-${indice}`}>{parrafo}</p>
  ))
}

export function PaginaCategoriaTransparencia({
  slugFijo,
}: PropiedadesPaginaCategoriaTransparencia = {}) {
  const parametros = useParams()
  const slug = slugFijo ?? parametros.slug
  const [datos, establecerDatos] =
    useState<CategoriaPublicaTransparencia | null>(null)
  const [estaCargando, establecerEstaCargando] = useState(true)
  const [mensajeError, establecerMensajeError] = useState('')
  const [categoriaNoEncontrada, establecerCategoriaNoEncontrada] =
    useState(false)
  const [intento, establecerIntento] = useState(0)

  usePageTitle(datos?.categoria.titulo ?? 'Transparencia')

  useEffect(() => {
    const controlador = new AbortController()

    if (!slug) {
      establecerDatos(null)
      establecerCategoriaNoEncontrada(true)
      establecerEstaCargando(false)
      return () => controlador.abort()
    }

    establecerEstaCargando(true)
    establecerMensajeError('')
    establecerCategoriaNoEncontrada(false)

    obtenerCategoriaPublicaPorSlug(slug, {
      signal: controlador.signal,
    })
      .then((respuesta) => {
        establecerDatos(respuesta)
      })
      .catch((error: unknown) => {
        if (solicitudFueCancelada(error)) {
          return
        }

        establecerDatos(null)

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
          breadcrumbs={construirBreadcrumbs(null)}
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
          breadcrumbs={construirBreadcrumbs(datos)}
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

  if (categoriaNoEncontrada || !datos) {
    return (
      <main className="internal-main">
        <InternalHero
          eyebrow="Transparencia"
          title="Categoria no encontrada"
          description="La categoria solicitada no esta disponible en el portal publico."
          breadcrumbs={construirBreadcrumbs(null)}
        />
        <section className="section">
          <div className="container">
            <div className="transparency-empty-state">
              <h2>No se encontro la categoria</h2>
              <p>
                Revisa la ruta o vuelve al listado publico de transparencia para
                seleccionar una categoria disponible.
              </p>
              <Link className="button button--primary" to="/transparencia">
                <IconoPortal tipo="volver" className="button-icon" />
                Volver a transparencia
              </Link>
            </div>
          </div>
        </section>
      </main>
    )
  }

  const { categoria, subcategorias, documentos } = datos
  const tieneSubcategorias = subcategorias.length > 0
  const tieneDocumentos = documentos.length > 0
  const parrafosDescripcion = obtenerParrafosInformacion(
    categoria.descripcion,
  )
  const parrafosFundamento = obtenerParrafosInformacion(
    categoria.fundamentoLegal,
  )
  const tieneInformacionCategoria =
    parrafosDescripcion.length > 0 || parrafosFundamento.length > 0

  return (
    <main className="internal-main">
      <InternalHero
        eyebrow="Transparencia"
        title={categoria.titulo}
        description="Consulta la informacion publica disponible de esta categoria."
        breadcrumbs={construirBreadcrumbs(datos)}
      />
      <section className="section">
        <div className="container transparency-detail">
          {tieneInformacionCategoria ? (
            <section
              className="categoria-transparencia__informacion"
              aria-labelledby="categoria-informacion-titulo"
            >
              <div className="categoria-transparencia__encabezado">
                <IconoTransparencia
                  tipo="documentos"
                  className="transparency-heading-icon"
                />
                <div>
                  <p className="eyebrow">Categoria</p>
                  <h2 id="categoria-informacion-titulo">
                    Informacion de la categoria
                  </h2>
                </div>
              </div>

              {parrafosDescripcion.length > 0 ? (
                <div className="categoria-transparencia__bloque">
                  {renderizarParrafos(parrafosDescripcion, 'descripcion')}
                </div>
              ) : null}

              {parrafosFundamento.length > 0 ? (
                <div className="categoria-transparencia__bloque categoria-transparencia__bloque--fundamento">
                  <h3>Fundamento legal</h3>
                  {renderizarParrafos(parrafosFundamento, 'fundamento')}
                </div>
              ) : null}
            </section>
          ) : null}

          {tieneSubcategorias ? (
            <section
              className="transparency-subcategories"
              aria-labelledby="titulo-subcategorias"
            >
              <div className="section-heading section-heading--split transparency-files-heading">
                <div className="transparency-heading-row">
                  <IconoPortal tipo="carpeta" className="transparency-heading-icon" />
                  <div>
                    <p className="eyebrow">Subcategorias</p>
                    <h2 id="titulo-subcategorias">Apartados disponibles</h2>
                    <p>
                      Selecciona una categoria para consultar sus subcategorias
                      o documentos publicados.
                    </p>
                  </div>
                </div>
              </div>
              <CuadriculaCategoriasTransparencia categorias={subcategorias} />
            </section>
          ) : null}

          {tieneDocumentos ? (
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
          ) : null}

          {!tieneSubcategorias && !tieneDocumentos ? (
            <div className="transparency-empty-state">
              <h3>No hay contenido disponible actualmente.</h3>
              <p>
                Esta categoria no contiene subcategorias ni documentos activos
                publicados por el momento.
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  )
}
