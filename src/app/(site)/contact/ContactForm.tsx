'use client'

import { useActionState } from 'react'
import { submitContact, type ContactState } from './actions'

const initial: ContactState = { status: 'idle', message: '' }

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial)
  // After an error the previous values are restored; after success the form is cleared
  const f = state.fields
  const formKey = state.status === 'error' ? JSON.stringify(f) : state.status

  return (
    <form action={action} className="form" key={formKey}>
      <div className="form-row">
        <div className="field">
          <label htmlFor="c-name">Your name</label>
          <input id="c-name" name="name" type="text" autoComplete="name" required maxLength={120} defaultValue={f?.name} />
        </div>
        <div className="field">
          <label htmlFor="c-email">Email address</label>
          <input id="c-email" name="email" type="email" autoComplete="email" required maxLength={200} defaultValue={f?.email} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="c-subject">Subject</label>
        <input id="c-subject" name="subject" type="text" maxLength={200} defaultValue={f?.subject} />
      </div>
      <div className="field">
        <label htmlFor="c-message">Message</label>
        <textarea id="c-message" name="message" required minLength={10} maxLength={5000} defaultValue={f?.message} />
      </div>
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="c-website">Leave this field empty</label>
        <input id="c-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div aria-live="polite">
        {state.status !== 'idle' && (
          <p className={`alert ${state.status === 'success' ? 'alert-success' : 'alert-error'}`} role="status">
            {state.message}
          </p>
        )}
      </div>
      <div>
        <button className="btn" type="submit" disabled={pending}>
          {pending ? 'Sending…' : 'Send Message'}
        </button>
      </div>
    </form>
  )
}
