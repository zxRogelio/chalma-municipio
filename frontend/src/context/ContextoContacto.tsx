import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { solicitudFueCancelada } from '../services/api'
import { obtenerContactoPublico } from '../services/servicioContacto'
import type { ConfiguracionContactoPublica } from '../types/contacto'

const configuracionOculta: ConfiguracionContactoPublica = {
  telefono: null,
  correo: null,
  mostrarTelefono: false,
  mostrarCorreo: false,
}

interface ValorContextoContacto {
  configuracion: ConfiguracionContactoPublica
  estaCargando: boolean
  mensajeError: string
  recargarContacto: () => Promise<void>
}

const ContextoContacto = createContext<ValorContextoContacto | undefined>(
  undefined,
)

interface PropiedadesProveedorContacto {
  children: ReactNode
}

export function ProveedorContacto({
  children,
}: PropiedadesProveedorContacto) {
  const [configuracion, establecerConfiguracion] =
    useState<ConfiguracionContactoPublica>(configuracionOculta)
  const [estaCargando, establecerEstaCargando] = useState(true)
  const [mensajeError, establecerMensajeError] = useState('')

  const cargarContacto = useCallback(async (signal?: AbortSignal) => {
    establecerEstaCargando(true)
    establecerMensajeError('')

    try {
      const datos = await obtenerContactoPublico({ signal })

      if (!signal?.aborted) {
        establecerConfiguracion(datos)
      }
    } catch (error) {
      if (solicitudFueCancelada(error)) {
        return
      }

      if (!signal?.aborted) {
        establecerConfiguracion(configuracionOculta)
        establecerMensajeError(
          'No fue posible cargar la informacion de contacto.',
        )
      }
    } finally {
      if (!signal?.aborted) {
        establecerEstaCargando(false)
      }
    }
  }, [])

  useEffect(() => {
    const controlador = new AbortController()

    void cargarContacto(controlador.signal)

    return () => controlador.abort()
  }, [cargarContacto])

  const recargarContacto = useCallback(
    () => cargarContacto(),
    [cargarContacto],
  )

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

export function usarContacto() {
  const contexto = useContext(ContextoContacto)

  if (!contexto) {
    throw new Error(
      'usarContacto debe utilizarse dentro de ProveedorContacto.',
    )
  }

  return contexto
}
