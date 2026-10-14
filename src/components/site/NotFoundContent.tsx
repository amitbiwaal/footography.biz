import Link from 'next/link'

export function NotFoundContent() {
  return (
    <section className="not-found">
      <div className="wrap">
        <div className="big" aria-hidden="true">404</div>
        <h1>Page Not Found</h1>
        <p className="lead" style={{ margin: '0 auto 26px' }}>
          The page you are looking for has moved or no longer exists. Try one of these instead.
        </p>
        <div className="hero-cta">
          <Link className="btn" href="/">
            Go to Homepage
          </Link>
          <Link className="btn btn-ghost" href="/blog">
            Read the Blog
          </Link>
        </div>
      </div>
    </section>
  )
}
