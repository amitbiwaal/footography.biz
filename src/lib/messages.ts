import 'server-only'
import { db, nowIso } from './db'

export type Message = {
  id: number
  name: string
  email: string
  subject: string
  message: string
  isRead: boolean
  createdAt: string
}

export async function createMessage(input: { name: string; email: string; subject: string; message: string }) {
  const client = await db()
  await client.execute({
    sql: 'INSERT INTO messages (name, email, subject, message, created_at) VALUES (?, ?, ?, ?, ?)',
    args: [input.name, input.email, input.subject, input.message, nowIso()],
  })
}

export async function listMessages(): Promise<Message[]> {
  const client = await db()
  const res = await client.execute('SELECT * FROM messages ORDER BY id DESC')
  return res.rows.map((r) => ({
    id: Number(r.id),
    name: String(r.name),
    email: String(r.email),
    subject: String(r.subject ?? ''),
    message: String(r.message),
    isRead: Number(r.is_read) === 1,
    createdAt: String(r.created_at),
  }))
}

export async function setMessageRead(id: number, read: boolean) {
  const client = await db()
  await client.execute({ sql: 'UPDATE messages SET is_read = ? WHERE id = ?', args: [read ? 1 : 0, id] })
}

export async function deleteMessage(id: number) {
  const client = await db()
  await client.execute({ sql: 'DELETE FROM messages WHERE id = ?', args: [id] })
}
