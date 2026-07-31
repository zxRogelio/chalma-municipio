import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { esErrorNoAutorizado } from '../services/api'
import {
  cerrarSesion as cerrarSesionServicio,
  consultarSesion,
  iniciarSesion as iniciarSesionServicio,
} from '../services/servicioAutenticacion'
import type {
  Administrador,
  CredencialesAdministrador,
} from '../types/autenticacion'
import { ContextoAutenticacion } from './contextoAutenticacion'
import type { ValorContextoAutenticacion } from './contextoAutenticacion'

interface PropiedadesProveedorAutenticacion {
  children: ReactNode
}

export function ProveedorAutenticacion({
  children,
}: PropiedadesProveedorAutenticacion) {
  const [administrador, establecerAdministrador] =
    useState<Administrador | null>(null)
  const [estaCargando, establecerEstaCargando] = useState(true)

  const actualizarSesion = useCallback(async () => {
    establecerEstaCargando(true)

    try {
      const respuesta = await consultarSesion()
      establecerAdministrador(respuesta.datos?.administrador ?? null)
    } catch (error) {
      if (!esErrorNoAutorizado(error)) {
        console.error('No fue posible consultar la sesion administrativa.')
      }

      establecerAdministrador(null)
    } finally {
      establecerEstaCargando(false)
    }
  }, [])

  useEffect(() => {
    let estaMontado = true

    consultarSesion()
      .then((respuesta) => {
        if (estaMontado) {
          establecerAdministrador(respuesta.datos?.administrador ?? null)
        }
      })
      .catch((error: unknown) => {
        if (!esErrorNoAutorizado(error)) {
          console.error('No fue posible consultar la sesion administrativa.')
        }

        if (estaMontado) {
          establecerAdministrador(null)
        }
      })
      .finally(() => {
        if (estaMontado) {
          establecerEstaCargando(false)
        }
      })

    return () => {
      estaMontado = false
    }
  }, [])

  const iniciarSesion = useCallback(
    async (credenciales: CredencialesAdministrador) => {
      const respuesta = await iniciarSesionServicio(credenciales)
      establecerAdministrador(respuesta.datos?.administrador ?? null)
      return respuesta
    },
    [],
  )

  const cerrarSesion = useCallback(async () => {
    try {
      await cerrarSesionServicio()
    } catch {
      console.error('No fue posible cerrar la sesion en el servidor.')
    } finally {
      establecerAdministrador(null)
    }
  }, [])

  const valor = useMemo<ValorContextoAutenticacion>(
    () => ({
      administrador,
      estaCargando,
      estaAutenticado: Boolean(administrador),
      iniciarSesion,
      cerrarSesion,
      actualizarSesion,
    }),
    [
      administrador,
      estaCargando,
      iniciarSesion,
      cerrarSesion,
      actualizarSesion,
    ],
  )

  return (
    <ContextoAutenticacion.Provider value={valor}>
      {children}
    </ContextoAutenticacion.Provider>
  )
}
