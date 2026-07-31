import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  governmentHeaderNavigation,
  transparencyNavigation,
} from '../../data/navigation'
import { configuracionPortal } from '../../config/configuracionPortal'
import {
  obtenerSeccionesTransparencia,
} from '../../services/servicioTransparencia'
import type {
  IconoTransparenciaTipo,
  NavGroupKey,
  NavItem,
} from '../../types/site'
import { IconoPortal } from '../common/IconoPortal'
import { IconoTransparencia } from '../transparencia/IconoTransparencia'

interface HeaderProps {
  onSearchOpen: () => void
  onContrastChange: (enabled: boolean) => void
}

const LOGO_HEADER = '/assets/img/logo_header.png'
const enlacesExternosTransparencia = transparencyNavigation.filter(
  (item) => item.external,
)

const iconosPorTipoSeccion: Record<string, IconoTransparenciaTipo> = {
  obligaciones_comunes: 'obligaciones',
  obligaciones_especificas: 'especificas',
  obras_publicas: 'obras',
  fondos_federales: 'fondos',
  informacion_financiera: 'finanzas',
  cuenta_publica: 'cuenta',
  licitaciones: 'licitaciones',
}

export function Header({
  onSearchOpen,
  onContrastChange,
}: HeaderProps) {
  const location = useLocation()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] =
    useState<NavGroupKey | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHighContrast, setIsHighContrast] = useState(false)
  const [itemsTransparencia, setItemsTransparencia] =
    useState<NavItem[]>(enlacesExternosTransparencia)

  const isHome = location.pathname === '/'

  useEffect(() => {
    let estaMontado = true

    obtenerSeccionesTransparencia()
      .then((categorias) => {
        if (!estaMontado) {
          return
        }

        const categoriasPublicas = categorias.map<NavItem>((categoria) => ({
          label: categoria.titulo,
          to: `/transparencia/apartado/${categoria.slug}`,
          description: categoria.descripcion ?? undefined,
          icono: iconosPorTipoSeccion[categoria.tipoSeccion] ?? 'documentos',
        }))

        setItemsTransparencia([
          ...enlacesExternosTransparencia,
          ...categoriasPublicas,
        ])
      })
      .catch((error: unknown) => {
        console.error(error)
      })

    return () => {
      estaMontado = false
    }
  }, [])

  useEffect(() => {
    const storedValue =
      localStorage.getItem('chalma-high-contrast') === 'true'

    setIsHighContrast(storedValue)

    document.body.classList.toggle(
      'high-contrast',
      storedValue,
    )
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24)
    }

    handleScroll()

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
    setOpenDropdown(null)
  }, [location.pathname])

  useEffect(() => {
    document.body.classList.toggle(
      'menu-open',
      isMenuOpen,
    )

    return () => {
      document.body.classList.remove('menu-open')
    }
  }, [isMenuOpen])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        setOpenDropdown(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const closeNavigation = () => {
    setIsMenuOpen(false)
    setOpenDropdown(null)
  }

  const toggleContrast = () => {
    const nextValue = !isHighContrast

    setIsHighContrast(nextValue)

    localStorage.setItem(
      'chalma-high-contrast',
      String(nextValue),
    )

    document.body.classList.toggle(
      'high-contrast',
      nextValue,
    )

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
          onClick={() =>
            setOpenDropdown(isOpen ? null : key)
          }
        >
          <IconoPortal
            tipo={key === 'government' ? 'gobierno' : 'transparencia'}
            className="nav-link-icon"
          />
          <span>{label}</span>

          <span
            className="chevron"
            aria-hidden="true"
          />
        </button>

        <div
          className={`dropdown-menu${
            isWide ? ' dropdown-menu--wide' : ''
          }`}
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
                  <IconoTransparencia
                    tipo={item.icono}
                    className="dropdown-icon"
                  />
                ) : (
                  <IconoPortal
                    tipo={item.iconoPortal ?? 'gobierno'}
                    className="dropdown-icon"
                  />
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
                  <IconoTransparencia
                    tipo={item.icono}
                    className="dropdown-icon"
                  />
                ) : (
                  <IconoPortal
                    tipo={item.iconoPortal ?? 'gobierno'}
                    className="dropdown-icon"
                  />
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
      className={`site-header${
        isHome
          ? ' site-header--home'
          : ' site-header--solid'
      }${isScrolled ? ' scrolled' : ''}`}
    >
      <div className="header-inner">
        <Link
          className="brand"
          to="/"
          aria-label="Ir al inicio"
          onClick={closeNavigation}
        >
          <img
            className="brand-logo"
            src={LOGO_HEADER}
            alt="Logo oficial del H. Ayuntamiento de Chalma"
          />
        </Link>

        <button
          className={`menu-toggle${
            isMenuOpen ? ' active' : ''
          }`}
          type="button"
          aria-label={
            isMenuOpen
              ? 'Cerrar menú'
              : 'Abrir menú'
          }
          aria-expanded={isMenuOpen}
          onClick={() =>
            setIsMenuOpen((current) => !current)
          }
        >
          <IconoPortal
            tipo={isMenuOpen ? 'cerrar' : 'menu'}
            className="menu-toggle-icon"
          />
        </button>

        <nav
          className={`main-nav${
            isMenuOpen ? ' active' : ''
          }`}
          aria-label="Navegación principal"
        >
          <ul className="nav-list">
            <li>
              <NavLink
                className="nav-link"
                to="/"
                end
                onClick={closeNavigation}
              >
                <IconoPortal tipo="inicio" className="nav-link-icon" />
                <span>Inicio</span>
              </NavLink>
            </li>

            {renderDropdown(
              'government',
              'Gobierno',
              governmentHeaderNavigation,
            )}

            {renderDropdown(
              'transparency',
              'Transparencia',
              itemsTransparencia,
              true,
            )}

            {configuracionPortal.mostrarTramitesServicios ? (
              <li>
                <NavLink
                  className="nav-link"
                  to="/tramites-servicios"
                  onClick={closeNavigation}
                >
                  <IconoPortal tipo="tramites" className="nav-link-icon" />
                  Trámites y servicios
                </NavLink>
              </li>
            ) : null}

            <li>
              <NavLink
                className="nav-link"
                to="/contacto"
                onClick={closeNavigation}
              >
                <IconoPortal tipo="contacto" className="nav-link-icon" />
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
                <IconoPortal tipo="accesibilidad" className="icon-button-icon" />
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
                <IconoPortal tipo="buscar" className="icon-button-icon" />
                Buscar
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
