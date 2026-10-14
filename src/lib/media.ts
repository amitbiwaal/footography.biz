import 'server-only'
import sharp from 'sharp'
import { db, nowIso } from './db'
import { slugify } from './text'

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']

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
 * and stores it in the database so uploads survive on any host.
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
  const client = await db()
  const createdAt = nowIso()
  const res = await client.execute({
    sql: `INSERT INTO media (filename, original_name, mime, width, height, size, alt, data, created_at)
          VALUES (?, ?, 'image/webp', ?, ?, ?, ?, ?, ?)`,
    args: [filename, file.name, info.width, info.height, data.length, alt, data, createdAt],
  })
  return {
    id: Number(res.lastInsertRowid),
    filename,
    url: mediaUrl(filename),
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
    'SELECT id, filename, original_name, width, height, size, alt, created_at FROM media ORDER BY id DESC',
  )
  return res.rows.map((r) => ({
    id: Number(r.id),
    filename: String(r.filename),
    url: mediaUrl(String(r.filename)),
    originalName: String(r.original_name),
    width: r.width == null ? null : Number(r.width),
    height: r.height == null ? null : Number(r.height),
    size: Number(r.size),
    alt: String(r.alt ?? ''),
    createdAt: String(r.created_at),
  }))
}

export async function getMediaFile(filename: string) {
  const client = await db()
  const res = await client.execute({ sql: 'SELECT mime, data FROM media WHERE filename = ?', args: [filename] })
  const row = res.rows[0]
  if (!row) return null
  return { mime: String(row.mime), data: new Uint8Array(row.data as ArrayBuffer) }
}

export async function getMediaDimensions(filename: string) {
  const client = await db()
  const res = await client.execute({ sql: 'SELECT width, height FROM media WHERE filename = ?', args: [filename] })
  const row = res.rows[0]
  return row ? { width: Number(row.width), height: Number(row.height) } : null
}

export async function deleteMedia(id: number) {
  const client = await db()
  await client.execute({ sql: 'DELETE FROM media WHERE id = ?', args: [id] })
}
