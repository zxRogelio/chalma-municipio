import { useState } from 'react'
import type { FormEvent } from 'react'
import type {
  DatosFormularioDocumentoAdministracion,
  DocumentoAdministracion,
  PeriodoDocumentoAdministracion,
} from '../../../types/documentosAdministracion'
import {
  extensionesDocumentosPermitidas,
  periodosDocumentoAdministracion,
} from '../../../types/documentosAdministracion'

interface PropiedadesFormularioDocumentoAdministracion {
  documento?: DocumentoAdministracion | null
  estaEnviando: boolean
  mensajeError: string
  onGuardar: (datos: DatosFormularioDocumentoAdministracion) => Promise<void>
  onCancelar: () => void
}

export function FormularioDocumentoAdministracion({
  documento,
  estaEnviando,
  mensajeError,
  onGuardar,
  onCancelar,
}: PropiedadesFormularioDocumentoAdministracion) {
  const esEdicion = Boolean(documento)
  const [archivo, establecerArchivo] = useState<File | null>(null)
  const [titulo, establecerTitulo] = useState(documento?.titulo ?? '')
  const [descripcion, establecerDescripcion] = useState(
    documento?.descripcion ?? '',
  )
  const [ejercicioFiscal, establecerEjercicioFiscal] = useState(
    documento?.ejercicioFiscal ?? new Date().getFullYear(),
  )
  const [periodo, establecerPeriodo] =
    useState<PeriodoDocumentoAdministracion>(
      periodosDocumentoAdministracion.includes(
        documento?.periodo as PeriodoDocumentoAdministracion,
      )
        ? (documento?.periodo as PeriodoDocumentoAdministracion)
        : 'Anual',
    )
  const [orden, establecerOrden] = useState(documento?.orden ?? 0)
  const [estaActivo, establecerEstaActivo] = useState(
    documento?.estaActivo ?? true,
  )

  const enviarFormulario = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()

    await onGuardar({
      archivo,
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      ejercicioFiscal,
      periodo,
      orden,
      estaActivo,
    })
  }

  return (
    <form className="admin-category-form" onSubmit={enviarFormulario}>
      {!esEdicion ? (
        <label htmlFor="documento-archivo">
          Archivo
          <input
            id="documento-archivo"
            type="file"
            required
            accept={extensionesDocumentosPermitidas}
            onChange={(evento) =>
              establecerArchivo(evento.target.files?.[0] ?? null)
            }
          />
        </label>
      ) : null}

      <label htmlFor="documento-titulo">
        Titulo
        <input
          id="documento-titulo"
          required
          minLength={3}
          maxLength={250}
          value={titulo}
          onChange={(evento) => establecerTitulo(evento.target.value)}
        />
      </label>

      <label htmlFor="documento-descripcion">
        Descripcion
        <textarea
          id="documento-descripcion"
          maxLength={5000}
          rows={4}
          value={descripcion}
          onChange={(evento) => establecerDescripcion(evento.target.value)}
        />
      </label>

      <label htmlFor="documento-ejercicio">
        Ejercicio fiscal
        <input
          id="documento-ejercicio"
          type="number"
          min={2000}
          max={2100}
          required
          value={ejercicioFiscal}
          onChange={(evento) =>
            establecerEjercicioFiscal(Number(evento.target.value))
          }
        />
      </label>

      <label htmlFor="documento-periodo">
        Periodo
        <select
          id="documento-periodo"
          required
          value={periodo}
          onChange={(evento) =>
            establecerPeriodo(
              evento.target.value as PeriodoDocumentoAdministracion,
            )
          }
        >
          {periodosDocumentoAdministracion.map((opcion) => (
            <option value={opcion} key={opcion}>
              {opcion}
            </option>
          ))}
        </select>
      </label>

      <label htmlFor="documento-orden">
        Orden
        <input
          id="documento-orden"
          type="number"
          min={0}
          max={9999}
          value={orden}
          onChange={(evento) => establecerOrden(Number(evento.target.value))}
        />
      </label>

      <label className="admin-checkbox" htmlFor="documento-estado">
        <input
          id="documento-estado"
          type="checkbox"
          checked={estaActivo}
          onChange={(evento) => establecerEstaActivo(evento.target.checked)}
        />
        Documento activo
      </label>

      <p className="admin-form-note">
        Archivos permitidos: PDF, DOC, DOCX, XLS, XLSX, CSV, ZIP, PNG, JPG y
        JPEG.
      </p>

      {mensajeError ? (
        <p className="admin-error" role="alert" aria-live="assertive">
          {mensajeError}
        </p>
      ) : (
        <p className="admin-error" aria-live="assertive" />
      )}

      <div className="admin-modal-actions">
        <button
          className="button button--secondary"
          type="button"
          onClick={onCancelar}
        >
          Cancelar
        </button>
        <button
          className="button button--primary"
          type="submit"
          disabled={estaEnviando}
        >
          {estaEnviando ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}
