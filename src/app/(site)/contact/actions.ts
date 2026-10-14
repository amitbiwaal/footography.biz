'use server'

import { clientIp, rateLimit } from '@/lib/auth'
import { createMessage } from '@/lib/messages'

type Fields = { name: string; email: string; subject: string; message: string }

// `fields` is sent back on errors so the visitor's text is not lost when React resets the form
export type ContactState = { status: 'idle' | 'success' | 'error'; message: string; fields?: Fields }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: real visitors never see or fill this field
  if (String(formData.get('website') ?? '').trim()) {
    return { status: 'success', message: 'Thanks! Your message has been sent.' }
  }

  const fields: Fields = {
    name: String(formData.get('name') ?? '').trim().slice(0, 120),
    email: String(formData.get('email') ?? '').trim().slice(0, 200),
    subject: String(formData.get('subject') ?? '').trim().slice(0, 200),
    message: String(formData.get('message') ?? '').trim().slice(0, 5000),
  }
  const fail = (message: string): ContactState => ({ status: 'error', message, fields })

  if (!fields.name || !fields.email || !fields.message) return fail('Please fill in your name, email and message.')
  if (!EMAIL_RE.test(fields.email)) return fail('Please enter a valid email address.')
  if (fields.message.length < 10) return fail('Your message is a little short. Please add more detail.')

  const ip = await clientIp()
  if (!rateLimit(`contact:${ip}`, 5, 60 * 60 * 1000)) {
    return fail('Too many messages sent. Please try again later.')
  }

  try {
    await createMessage(fields)
  } catch (err) {
    console.error('Contact form error', err)
    return fail('Something went wrong. Please try again in a moment.')
  }
  return { status: 'success', message: 'Thanks! Your message has been sent. We usually reply within 2 business days.' }
}
