import 'server-only'
import { del, put } from '@vercel/blob'
import sharp from 'sharp'
import { db, nowIso } from './db'
import { slugify } from './text'

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']

/** On Vercel images go to Vercel Blob; elsewhere they are stored in the database. */
const useBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN)

export type MediaItem = {
  id: number
  filename: string
  url: string
  originalName: string
  width: number | null
  height: number | null
  size: number
  alt: string
  createdAt: string
}

export function mediaUrl(filename: string) {
  return `/media/${filename}`
}

/**
 * Optimises an uploaded image (auto-rotate, max 1600px wide, WebP, metadata such as GPS stripped)
 * and stores it in Vercel Blob, or in the database when Blob is not configured.
 */
export async function saveUpload(file: File, alt = ''): Promise<MediaItem> {
  if (!ACCEPTED.includes(file.type)) throw new Error('Only JPG, PNG, WebP, GIF or AVIF images are allowed.')
  if (file.size > MAX_UPLOAD_BYTES) throw new Error('Image is larger than 10 MB.')

  const input = Buffer.from(await file.arrayBuffer())
  const { data, info } = await sharp(input)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer({ resolveWithObject: true })

  const base = slugify(file.name.replace(/\.[a-z0-9]+$/i, '')) || 'image'
  const filename = `${base.slice(0, 60)}-${Date.now().toString(36)}.webp`

  let url = mediaUrl(filename)
  let stored: Uint8Array = data
  if (useBlob()) {
    const blob = await put(`media/${filename}`, data, {
      access: 'public',
      contentType: 'image/webp',
      addRandomSuffix: false,
      // File names are unique, so the content never changes
      cacheControlMaxAge: 31536000,
    })
    url = blob.url
    stored = new Uint8Array(0)
  }

  const client = await db()
  const createdAt = nowIso()
  const res = await client.execute({
    sql: `INSERT INTO media (filename, url, original_name, mime, width, height, size, alt, data, created_at)
          VALUES (?, ?, ?, 'image/webp', ?, ?, ?, ?, ?, ?)`,
    args: [filename, url, file.name, info.width, info.height, data.length, alt, stored, createdAt],
  })
  return {
    id: Number(res.lastInsertRowid),
    filename,
    url,
    originalName: file.name,
    width: info.width,
    height: info.height,
    size: data.length,
    alt,
    createdAt,
  }
}

export async function listMedia(): Promise<MediaItem[]> {
  const client = await db()
  const res = await client.execute(
    'SELECT id, filename, url, original_name, width, height, size, alt, created_at FROM media ORDER BY id DESC',
  )
  return res.rows.map((r) => ({
    id: Number(r.id),
    filename: String(r.filename),
    url: r.url ? String(r.url) : mediaUrl(String(r.filename)),
    originalName: String(r.original_name),
    width: r.width == null ? null : Number(r.width),
    height: r.height == null ? null : Number(r.height),
    size: Number(r.size),
    alt: String(r.alt ?? ''),
    createdAt: String(r.created_at),
  }))
}

/** Image bytes for files kept in the database (served by /media/[file]). */
export async function getMediaFile(filename: string) {
  const client = await db()
  const res = await client.execute({ sql: 'SELECT mime, data FROM media WHERE filename = ?', args: [filename] })
  const row = res.rows[0]
  if (!row) return null
  const data = new Uint8Array(row.data as ArrayBuffer)
  return data.byteLength ? { mime: String(row.mime), data } : null
}

/** Width and height of an uploaded image, looked up by the URL used in a post. */
export async function getMediaDimensions(url: string | null | undefined) {
  if (!url) return null
  const client = await db()
  const res = url.startsWith('/media/')
    ? await client.execute({ sql: 'SELECT width, height FROM media WHERE filename = ?', args: [url.slice('/media/'.length)] })
    : await client.execute({ sql: 'SELECT width, height FROM media WHERE url = ?', args: [url] })
  const row = res.rows[0]
  return row ? { width: Number(row.width), height: Number(row.height) } : null
}

export async function deleteMedia(id: number) {
  const client = await db()
  const res = await client.execute({ sql: 'SELECT url FROM media WHERE id = ?', args: [id] })
  const url = res.rows[0]?.url ? String(res.rows[0].url) : ''
  if (url.startsWith('https://') && useBlob()) await del(url)
  await client.execute({ sql: 'DELETE FROM media WHERE id = ?', args: [id] })
}
