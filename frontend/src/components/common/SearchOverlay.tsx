import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { searchPages } from '../../data/searchPages'
import { IconoPortal } from './IconoPortal'

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const cerrarBuscador = useCallback(() => {
    setQuery('')
    onClose()
  }, [onClose])

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return searchPages
    }

    return searchPages.filter((page) => {
      const searchableText = [
        page.title,
        page.description,
        page.path,
        ...page.keywords,
      ]
        .join(' ')
        .toLowerCase()

      return searchableText.includes(normalizedQuery)
    })
  }, [query])

  useEffect(() => {
    document.body.classList.toggle('search-open', isOpen)

    if (isOpen) {
      inputRef.current?.focus({ preventScroll: true })
    }

    return () => document.body.classList.remove('search-open')
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        cerrarBuscador()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [cerrarBuscador, isOpen])

  return (
    <div
      className={`search-overlay${isOpen ? ' active' : ''}`}
      aria-hidden={!isOpen}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) {
          cerrarBuscador()
        }
      }}
    >
      <button
        className="search-close"
        type="button"
        aria-label="Cerrar buscador"
        onClick={cerrarBuscador}
      >
        <IconoPortal tipo="cerrar" className="search-close-icon" />
      </button>
      <div className="search-panel" role="dialog" aria-modal="true">
        <p className="eyebrow">Buscador del sitio</p>
        <h2>Que informacion necesitas?</h2>
        <form
          className="search-form"
          onSubmit={(event) => event.preventDefault()}
        >
          <input
            ref={inputRef}
            type="search"
            placeholder="Ejemplo: organigrama, licitaciones..."
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button className="button button--primary" type="submit">
            <IconoPortal tipo="buscar" className="button-icon" />
            Buscar
          </button>
        </form>
        <div className="search-results" aria-live="polite">
          {results.length > 0 ? (
            results.map((result) => (
              <Link
                className="search-result"
                key={result.path}
                to={result.path}
                onClick={cerrarBuscador}
              >
                <strong>{result.title}</strong>
                <small>{result.description}</small>
              </Link>
            ))
          ) : (
            <p className="search-empty">No se encontraron coincidencias.</p>
          )}
        </div>
      </div>
    </div>
  )
}
