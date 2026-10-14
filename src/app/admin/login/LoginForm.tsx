'use client'

import { useActionState } from 'react'
import { loginAction, type LoginState } from '../actions'

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, { error: '' })
  return (
    <form action={action} className="adm-form">
      <input type="hidden" name="next" value={next} />
      <div className="adm-field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          autoFocus={!state.email}
          defaultValue={state.email}
          key={`email-${state.email ?? ''}`}
        />
      </div>
      <div className="adm-field">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required autoFocus={Boolean(state.email)} />
      </div>
      {state.error && (
        <p className="adm-alert adm-alert-error" role="alert">
          {state.error}
        </p>
      )}
      <button className="adm-btn adm-btn-block" type="submit" disabled={pending}>
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
