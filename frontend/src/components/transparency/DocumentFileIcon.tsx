import type { DocumentFileType } from '../../data/transparencyData'

interface DocumentFileIconProps {
  fileType: DocumentFileType
}

export function DocumentFileIcon({ fileType }: DocumentFileIconProps) {
  return (
    <span
      className={`document-file-icon document-file-icon--${fileType.toLowerCase()}`}
      aria-hidden="true"
      title={fileType}
    >
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M14 3v5h5" />
      </svg>
      <span>{fileType}</span>
    </span>
  )
}
