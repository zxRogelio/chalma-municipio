import type { DocumentoAdministracion } from '../../../types/documentosAdministracion'
import { obtenerUrlArchivoDocumentoAdministracion } from '../../../services/servicioDocumentosAdministracion'

interface PropiedadesTablaDocumentosAdministracion {
  documentos: DocumentoAdministracion[]
  onEditar: (documento: DocumentoAdministracion) => void
  onReemplazarArchivo: (documento: DocumentoAdministracion) => void
  onCambiarEstado: (documento: DocumentoAdministracion) => void
}

function formatearTamano(tamanoBytes: number | null) {
  if (!tamanoBytes || tamanoBytes <= 0) {
    return 'Por definir'
  }

  if (tamanoBytes < 1024) {
    return `${tamanoBytes} B`
  }

  if (tamanoBytes < 1024 * 1024) {
    return `${(tamanoBytes / 1024).toFixed(1)} KB`
  }

  return `${(tamanoBytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatearFecha(fecha: string | null) {
  if (!fecha) {
    return 'Sin fecha'
  }

  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
  }).format(new Date(fecha))
}

export function TablaDocumentosAdministracion({
  documentos,
  onEditar,
  onReemplazarArchivo,
  onCambiarEstado,
}: PropiedadesTablaDocumentosAdministracion) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table admin-table--documents">
        <caption className="sr-only">Documentos de transparencia</caption>
        <thead>
          <tr>
            <th>Archivo</th>
            <th>Titulo</th>
            <th>Ejercicio</th>
            <th>Periodo</th>
            <th>Tipo</th>
            <th>Tamano</th>
            <th>Estado</th>
            <th>Fecha de publicacion</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {documentos.map((documento) => {
            const urlArchivo = obtenerUrlArchivoDocumentoAdministracion(
              documento.id,
            )

            return (
              <tr key={documento.id}>
                <td>
                  <span className="admin-file-type">
                    {documento.tipoArchivo}
                  </span>
                </td>
                <td>
                  <span className="admin-table-title" title={documento.titulo}>
                    {documento.titulo}
                  </span>
                  <small>{documento.nombreOriginal ?? 'Sin nombre original'}</small>
                </td>
                <td>{documento.ejercicioFiscal}</td>
                <td>{documento.periodo}</td>
                <td>{documento.tipoMime ?? documento.tipoArchivo}</td>
                <td>{formatearTamano(documento.tamanoBytes)}</td>
                <td>
                  <span
                    className={`admin-badge ${
                      documento.estaActivo
                        ? 'admin-badge--active'
                        : 'admin-badge--inactive'
                    }`}
                  >
                    {documento.estaActivo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>{formatearFecha(documento.fechaPublicacion)}</td>
                <td>
                  <div className="admin-table-actions">
                    <a href={urlArchivo} download={documento.nombreOriginal ?? ''}>
                      Descargar
                    </a>
                    <button type="button" onClick={() => onEditar(documento)}>
                      Editar informacion
                    </button>
                    <button
                      type="button"
                      onClick={() => onReemplazarArchivo(documento)}
                    >
                      Reemplazar archivo
                    </button>
                    <button
                      type="button"
                      onClick={() => onCambiarEstado(documento)}
                    >
                      {documento.estaActivo ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
