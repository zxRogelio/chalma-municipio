import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { SearchOverlay } from '../components/common/SearchOverlay'
import { Toast } from '../components/common/Toast'
import { Footer } from '../components/layout/Footer'
import { FranjaLogoInstitucional } from '../components/layout/FranjaLogoInstitucional'
import { Header } from '../components/layout/Header'

export function PublicLayout() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [isToastVisible, setIsToastVisible] = useState(false)

  const showToast = (message: string) => {
    setToastMessage(message)
    setIsToastVisible(true)
    window.setTimeout(() => setIsToastVisible(false), 2400)
  }

  return (
    <>
      <Header
        onSearchOpen={() => setIsSearchOpen(true)}
        onContrastChange={(enabled) =>
          showToast(enabled ? 'Alto contraste activado' : 'Alto contraste desactivado')
        }
      />
      <Outlet />
      <FranjaLogoInstitucional />
      <Footer />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <Toast message={toastMessage} visible={isToastVisible} />
    </>
  )
}
