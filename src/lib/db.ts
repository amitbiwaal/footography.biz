import 'server-only'
import path from 'node:path'
import fs from 'node:fs'
import type { Client } from '@libsql/client'

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    cover_image TEXT,
    cover_alt TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT 'Guides',
    category_slug TEXT NOT NULL DEFAULT 'guides',
    tags TEXT NOT NULL DEFAULT '',
    meta_title TEXT NOT NULL DEFAULT '',
    meta_description TEXT NOT NULL DEFAULT '',
    focus_keyword TEXT NOT NULL DEFAULT '',
    canonical_url TEXT NOT NULL DEFAULT '',
    noindex INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    author TEXT NOT NULL DEFAULT '',
    published_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_posts_status_date ON posts (status, published_at)`,
  `CREATE INDEX IF NOT EXISTS idx_posts_category ON posts (category_slug)`,
  `CREATE TABLE IF NOT EXISTS media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL UNIQUE,
    url TEXT,
    original_name TEXT NOT NULL DEFAULT '',
    mime TEXT NOT NULL,
    width INTEGER,
    height INTEGER,
    size INTEGER NOT NULL,
    alt TEXT NOT NULL DEFAULT '',
    data BLOB NOT NULL,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL DEFAULT '',
    message TEXT NOT NULL,
    is_read INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  )`,
]

// DATABASE_URL wins; TURSO_* are the names set by the Vercel Turso integration
const rawUrl = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || 'file:./data/footography.db'
const authToken = process.env.DATABASE_URL ? process.env.DATABASE_AUTH_TOKEN : process.env.TURSO_AUTH_TOKEN
const isFile = rawUrl.startsWith('file:')

function resolveFileUrl() {
  // Resolve relative file paths against the project root and make sure the folder exists
  const filePath = path.resolve(/* turbopackIgnore: true */ process.cwd(), rawUrl.slice('file:'.length))
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  return `file:${filePath}`
}

async function createDbClient(): Promise<Client> {
  if (isFile) {
    const { createClient } = await import('@libsql/client')
    return createClient({ url: resolveFileUrl() })
  }
  // Remote (Turso): the HTTP client is plain JavaScript, so serverless functions need no native module
  const { createClient } = await import('@libsql/client/web')
  return createClient({ url: rawUrl, authToken: authToken || undefined })
}

/** Run once for databases created before a column existed. */
async function migrate(client: Client) {
  const media = await client.execute('PRAGMA table_info(media)')
  if (!media.rows.some((r) => r.name === 'url')) {
    await client.execute('ALTER TABLE media ADD COLUMN url TEXT')
  }
}

type DbGlobal = { client?: Promise<Client>; ready?: Promise<void> }
const g = globalThis as unknown as { __footographyDb?: DbGlobal }
const state: DbGlobal = (g.__footographyDb ??= {})

/** Returns a ready-to-use database client. The schema is created on first use. */
export async function db(): Promise<Client> {
  state.client ??= createDbClient().catch((err) => {
    state.client = undefined
    throw err
  })
  const client = await state.client
  if (!state.ready) {
    state.ready = (async () => {
      if (isFile) {
        await client.execute('PRAGMA journal_mode = WAL')
        await client.execute('PRAGMA busy_timeout = 5000')
      }
      await client.batch(SCHEMA, 'write')
      await migrate(client)
    })().catch((err) => {
      state.ready = undefined
      throw err
    })
  }
  await state.ready
  return client
}

export function nowIso() {
  return new Date().toISOString()
}
