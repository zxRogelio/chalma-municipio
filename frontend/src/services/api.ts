import axios from 'axios'
import type { RespuestaApi } from '../types/transparencia'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const api = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export function solicitudFueCancelada(error: unknown) {
  return (
    axios.isCancel(error) ||
    (axios.isAxiosError(error) && error.code === 'ERR_CANCELED')
  )
}

export function esErrorNoEncontrado(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 404
}

export function esErrorNoAutorizado(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 401
}

export function obtenerMensajeErrorApi(error: unknown) {
  if (axios.isAxiosError<RespuestaApi<unknown>>(error)) {
    const mensaje = error.response?.data?.mensaje

    if (mensaje) {
      return mensaje
    }
  }

  return 'No fue posible cargar la informacion de transparencia.'
}

export default api
