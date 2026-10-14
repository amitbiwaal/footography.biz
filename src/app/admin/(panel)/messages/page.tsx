import type { Metadata } from 'next'
import { ConfirmButton } from '@/components/admin/ConfirmButton'
import { listMessages } from '@/lib/messages'
import { deleteMessageAction, toggleMessageAction } from '../../actions'

export const metadata: Metadata = { title: 'Messages' }

export default async function MessagesPage() {
  const messages = await listMessages()
  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Messages</h1>
          <p className="adm-muted">Submissions from the contact form.</p>
        </div>
      </div>
      {messages.length === 0 ? (
        <div className="adm-card adm-empty">
          <p>No messages yet.</p>
        </div>
      ) : (
        <ul className="adm-messages">
          {messages.map((m) => (
            <li key={m.id} className={`adm-card${m.isRead ? '' : ' is-unread'}`}>
              <div className="adm-message-head">
                <div>
                  <strong>{m.subject || '(no subject)'}</strong>
                  <div className="adm-muted adm-small">
                    {m.name} · <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`}>{m.email}</a> ·{' '}
                    {new Date(m.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>
                <div className="adm-row-actions">
                  <form action={toggleMessageAction}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="read" value={m.isRead ? '0' : '1'} />
                    <button className="adm-link-btn" type="submit">
                      Mark as {m.isRead ? 'unread' : 'read'}
                    </button>
                  </form>
                  <form action={deleteMessageAction}>
                    <input type="hidden" name="id" value={m.id} />
                    <ConfirmButton message="Delete this message?">Delete</ConfirmButton>
                  </form>
                </div>
              </div>
              <p className="adm-message-body">{m.message}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
