import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { searchPages } from '../../data/searchPages'

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

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
      window.setTimeout(() => inputRef.current?.focus(), 0)
    } else {
      setQuery('')
    }

    return () => document.body.classList.remove('search-open')
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <div
      className={`search-overlay${isOpen ? ' active' : ''}`}
      aria-hidden={!isOpen}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) {
          onClose()
        }
      }}
    >
      <button
        className="search-close"
        type="button"
        aria-label="Cerrar buscador"
        onClick={onClose}
      >
        x
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
                onClick={onClose}
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
