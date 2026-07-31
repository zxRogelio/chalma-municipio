import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { solicitudFueCancelada } from '../services/api'
import { obtenerContactoPublico } from '../services/servicioContacto'
import type { ConfiguracionContactoPublica } from '../types/contacto'
import {
  configuracionContactoOculta,
  ContextoContacto,
} from './contextoContacto'
import type { ValorContextoContacto } from './contextoContacto'

interface PropiedadesProveedorContacto {
  children: ReactNode
}

export function ProveedorContacto({
  children,
}: PropiedadesProveedorContacto) {
  const [configuracion, establecerConfiguracion] =
    useState<ConfiguracionContactoPublica>(configuracionContactoOculta)
  const [estaCargando, establecerEstaCargando] = useState(true)
  const [mensajeError, establecerMensajeError] = useState('')

  useEffect(() => {
    const controlador = new AbortController()

    obtenerContactoPublico({ signal: controlador.signal })
      .then((datos) => {
        establecerConfiguracion(datos)
        establecerMensajeError('')
      })
      .catch((error: unknown) => {
        if (solicitudFueCancelada(error)) {
          return
        }

        establecerConfiguracion(configuracionContactoOculta)
        establecerMensajeError(
          'No fue posible cargar la informacion de contacto.',
        )
      })
      .finally(() => {
        if (!controlador.signal.aborted) {
          establecerEstaCargando(false)
        }
      })

    return () => controlador.abort()
  }, [])

  const recargarContacto = useCallback(async () => {
    establecerEstaCargando(true)
    establecerMensajeError('')

    try {
      const datos = await obtenerContactoPublico()
      establecerConfiguracion(datos)
    } catch (error) {
      if (solicitudFueCancelada(error)) {
        return
      }

      establecerConfiguracion(configuracionContactoOculta)
      establecerMensajeError(
        'No fue posible cargar la informacion de contacto.',
      )
    } finally {
      establecerEstaCargando(false)
    }
  }, [])

  const valor = useMemo<ValorContextoContacto>(
    () => ({
      configuracion,
      estaCargando,
      mensajeError,
      recargarContacto,
    }),
    [configuracion, estaCargando, mensajeError, recargarContacto],
  )

  return (
    <ContextoContacto.Provider value={valor}>
      {children}
    </ContextoContacto.Provider>
  )
}
