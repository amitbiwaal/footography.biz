'use client'

import { useEffect, useRef, useState } from 'react'

export type PickedImage = { url: string; alt: string; width: number | null; height: number | null }

type MediaItem = {
  id: number
  url: string
  originalName: string
  width: number | null
  height: number | null
  alt: string
}

export async function uploadImage(file: File, alt = ''): Promise<MediaItem> {
  const body = new FormData()
  body.append('file', file)
  body.append('alt', alt)
  const res = await fetch('/api/admin/upload', { method: 'POST', body })
  const data = await res.json().catch(() => ({ error: 'Upload failed.' }))
  if (!res.ok) throw new Error(data.error || 'Upload failed.')
  return data as MediaItem
}

export function MediaPicker({
  onClose,
  onSelect,
  askAlt = false,
  title = 'Insert image',
}: {
  onClose: () => void
  onSelect: (img: PickedImage) => void
  askAlt?: boolean
  title?: string
}) {
  const [items, setItems] = useState<MediaItem[] | null>(null)
  const [selected, setSelected] = useState<MediaItem | null>(null)
  const [alt, setAlt] = useState('')
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    dialogRef.current?.showModal()
    fetch('/api/admin/media')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Could not load media.'))))
      .then(setItems)
      .catch((e: Error) => setError(e.message))
  }, [])

  const choose = (item: MediaItem) => {
    setSelected(item)
    setAlt(item.alt)
  }

  const onFile = async (file: File | undefined) => {
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const item = await uploadImage(file)
      setItems((prev) => [item, ...(prev ?? [])])
      choose(item)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <dialog ref={dialogRef} className="adm-dialog" onClose={onClose} aria-labelledby="media-picker-title">
      <div className="adm-dialog-head">
        <h2 id="media-picker-title">{title}</h2>
        <button type="button" className="adm-icon-btn" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>

      <div className="adm-dialog-body">
        <label className="adm-upload">
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={(e) => onFile(e.target.files?.[0])} disabled={uploading} />
          <span>{uploading ? 'Uploading & optimising…' : '⬆ Upload new image (JPG, PNG, WebP — max 10 MB)'}</span>
        </label>
        <p className="adm-help">Images are automatically resized, converted to WebP and stripped of location (EXIF/GPS) data.</p>
        {error && <p className="adm-alert adm-alert-error">{error}</p>}

        {items === null ? (
          <p className="adm-muted">Loading media…</p>
        ) : items.length === 0 ? (
          <p className="adm-muted">No images yet. Upload your first one above.</p>
        ) : (
          <ul className="adm-media-grid" aria-label="Media library">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`adm-media-tile${selected?.id === item.id ? ' is-selected' : ''}`}
                  onClick={() => choose(item)}
                  aria-pressed={selected?.id === item.id}
                  title={item.originalName}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt={item.alt || item.originalName} loading="lazy" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="adm-dialog-foot">
        {askAlt && (
          <div className="adm-field adm-grow">
            <label htmlFor="picker-alt">Alt text (describe the image for SEO &amp; accessibility)</label>
            <input id="picker-alt" type="text" value={alt} onChange={(e) => setAlt(e.target.value)} maxLength={200} disabled={!selected} />
          </div>
        )}
        <button
          type="button"
          className="adm-btn"
          disabled={!selected}
          onClick={() => selected && onSelect({ url: selected.url, alt: alt.trim(), width: selected.width, height: selected.height })}
        >
          {askAlt ? 'Insert image' : 'Use this image'}
        </button>
      </div>
    </dialog>
  )
}
