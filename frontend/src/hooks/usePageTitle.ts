import { useEffect } from 'react'

const siteName = 'H. Ayuntamiento de Chalma'

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title === 'Inicio' ? siteName : `${title} | ${siteName}`
  }, [title])
}
