'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { uploadImage } from './MediaPicker'

export function MediaUploader() {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return
    setBusy(true)
    setMessage(null)
    let ok = 0
    const errors: string[] = []
    for (const file of Array.from(files)) {
      try {
        await uploadImage(file)
        ok++
      } catch (e) {
        errors.push(`${file.name}: ${e instanceof Error ? e.message : 'failed'}`)
      }
    }
    setBusy(false)
    setMessage(
      errors.length
        ? { type: 'error', text: `${ok} uploaded. ${errors.join(' ')}` }
        : { type: 'success', text: `${ok} image(s) uploaded.` },
    )
    router.refresh()
  }

  return (
    <div className="adm-uploader">
      <label className="adm-upload">
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          disabled={busy}
          onChange={(e) => {
            onFiles(e.target.files)
            e.target.value = ''
          }}
        />
        <span>{busy ? 'Uploading & optimising…' : '⬆ Upload images (JPG, PNG, WebP, GIF — max 10 MB each)'}</span>
      </label>
      {message && <p className={`adm-alert adm-alert-${message.type}`}>{message.text}</p>}
    </div>
  )
}
