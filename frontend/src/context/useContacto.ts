import { useContext } from 'react'
import { ContextoContacto } from './contextoContacto'

export function useContacto() {
  const contexto = useContext(ContextoContacto)

  if (!contexto) {
    throw new Error(
      'useContacto debe utilizarse dentro de ProveedorContacto.',
    )
  }

  return contexto
}
