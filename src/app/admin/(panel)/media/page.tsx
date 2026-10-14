import type { Metadata } from 'next'
import { ConfirmButton, CopyButton } from '@/components/admin/ConfirmButton'
import { MediaUploader } from '@/components/admin/MediaUploader'
import { listMedia } from '@/lib/media'
import { deleteMediaAction } from '../../actions'

export const metadata: Metadata = { title: 'Media library' }

function kb(bytes: number) {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`
}

export default async function MediaPage() {
  const media = await listMedia()
  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Media library</h1>
          <p className="adm-muted">{media.length} image(s). Uploads are optimised to WebP automatically.</p>
        </div>
      </div>
      <MediaUploader />
      {media.length === 0 ? (
        <div className="adm-card adm-empty">
          <p>No images uploaded yet.</p>
        </div>
      ) : (
        <ul className="adm-media-library">
          {media.map((m) => (
            <li key={m.id} className="adm-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.url} alt={m.alt || m.originalName} loading="lazy" />
              <div className="adm-media-meta">
                <strong title={m.originalName}>{m.originalName}</strong>
                <span className="adm-muted adm-small">
                  {m.width}×{m.height} · {kb(m.size)}
                </span>
              </div>
              <div className="adm-row-actions">
                <CopyButton text={m.url} />
                <form action={deleteMediaAction}>
                  <input type="hidden" name="id" value={m.id} />
                  <ConfirmButton message="Delete this image? Posts that use it will show a broken image.">Delete</ConfirmButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
