import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  governmentNavigation,
  transparencyNavigation,
} from '../../data/navigation'
import type { NavGroupKey, NavItem } from '../../types/site'
import { IconoTransparencia } from '../transparencia/IconoTransparencia'

interface HeaderProps {
  onSearchOpen: () => void
  onContrastChange: (enabled: boolean) => void
}

export function Header({ onSearchOpen, onContrastChange }: HeaderProps) {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<NavGroupKey | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHighContrast, setIsHighContrast] = useState(false)
  const isHome = location.pathname === '/'

  useEffect(() => {
    const storedValue = localStorage.getItem('chalma-high-contrast') === 'true'
    setIsHighContrast(storedValue)
    document.body.classList.toggle('high-contrast', storedValue)
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24)

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
    setOpenDropdown(null)
  }, [location.pathname])

  useEffect(() => {
    document.body.classList.toggle('menu-open', isMenuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [isMenuOpen])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        setOpenDropdown(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const closeNavigation = () => {
    setIsMenuOpen(false)
    setOpenDropdown(null)
  }

  const toggleContrast = () => {
    const nextValue = !isHighContrast
    setIsHighContrast(nextValue)
    localStorage.setItem('chalma-high-contrast', String(nextValue))
    document.body.classList.toggle('high-contrast', nextValue)
    onContrastChange(nextValue)
  }

  const renderDropdown = (
    key: NavGroupKey,
    label: string,
    items: NavItem[],
    isWide = false,
  ) => {
    const isOpen = openDropdown === key
    const menuId = `${key}-menu`

    return (
      <li
        className={`dropdown${isOpen ? ' active' : ''}`}
        onMouseEnter={() => setOpenDropdown(key)}
        onMouseLeave={() => setOpenDropdown(null)}
      >
        <button
          className="nav-link dropdown-toggle"
          type="button"
          aria-expanded={isOpen}
          aria-controls={menuId}
          onClick={() => setOpenDropdown(isOpen ? null : key)}
        >
          {label}
          <span className="chevron" aria-hidden="true" />
        </button>
        <div
          className={`dropdown-menu${isWide ? ' dropdown-menu--wide' : ''}`}
          id={menuId}
        >
          {items.map((item) =>
            item.external ? (
              <a
                className="dropdown-link"
                href={item.to}
                key={item.label}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeNavigation}
              >
                {key === 'transparency' ? (
                  <IconoTransparencia tipo={item.icono} className="dropdown-icon" />
                ) : (
                  <span className="dropdown-icon dropdown-icon--fallback" aria-hidden="true" />
                )}
                <span>{item.label}</span>
              </a>
            ) : (
              <NavLink
                className="dropdown-link"
                key={item.to}
                to={item.to}
                onClick={closeNavigation}
              >
                {key === 'transparency' ? (
                  <IconoTransparencia tipo={item.icono} className="dropdown-icon" />
                ) : (
                  <span className="dropdown-icon dropdown-icon--fallback" aria-hidden="true" />
                )}
                <span>{item.label}</span>
              </NavLink>
            ),
          )}
        </div>
      </li>
    )
  }

  return (
    <header
      className={`site-header${isHome ? ' site-header--home' : ' site-header--solid'}${
        isScrolled ? ' scrolled' : ''
      }`}
    >
      <div className="header-inner">
        <Link className="brand" to="/" aria-label="Ir al inicio" onClick={closeNavigation}>
          <img
            src="/assets/img/logo-chalma-oficial.png"
            alt="Logo oficial del H. Ayuntamiento de Chalma"
          />
        </Link>

        <button
          className={`menu-toggle${isMenuOpen ? ' active' : ''}`}
          type="button"
          aria-label={isMenuOpen ? 'Cerrar menu' : 'Abrir menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          className={`main-nav${isMenuOpen ? ' active' : ''}`}
          aria-label="Navegacion principal"
        >
          <ul className="nav-list">
            <li>
              <NavLink className="nav-link" to="/" end onClick={closeNavigation}>
                Inicio
              </NavLink>
            </li>
            {renderDropdown('government', 'Gobierno', governmentNavigation)}
            {renderDropdown('transparency', 'Transparencia', transparencyNavigation, true)}
            <li>
              <NavLink
                className="nav-link"
                to="/tramites-servicios"
                onClick={closeNavigation}
              >
                Tramites y servicios
              </NavLink>
            </li>
            <li>
              <NavLink className="nav-link" to="/contacto" onClick={closeNavigation}>
                Contacto
              </NavLink>
            </li>
            <li className="nav-action">
              <button
                className="icon-button"
                type="button"
                aria-label="Cambiar contraste"
                title="Cambiar contraste"
                aria-pressed={isHighContrast}
                onClick={toggleContrast}
              >
                A
              </button>
            </li>
            <li className="nav-action">
              <button
                className="icon-button"
                type="button"
                aria-label="Abrir buscador"
                title="Buscar"
                onClick={() => {
                  closeNavigation()
                  onSearchOpen()
                }}
              >
                Buscar
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
