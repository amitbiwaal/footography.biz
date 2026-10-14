import Link from 'next/link'

/** Crawlable pagination: page 1 lives at `basePath`, others at `${basePath}/page/N`. */
export function Pagination({ basePath, page, totalPages }: { basePath: string; page: number; totalPages: number }) {
  if (totalPages <= 1) return null
  const href = (n: number) => (n === 1 ? basePath : `${basePath}/page/${n}`)
  return (
    <nav className="pagination" aria-label="Pagination">
      {page > 1 ? (
        <Link href={href(page - 1)} rel="prev">
          ← Newer
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
      <ol>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <li key={n}>
            {n === page ? (
              <span aria-current="page">{n}</span>
            ) : (
              <Link href={href(n)} aria-label={`Page ${n}`}>
                {n}
              </Link>
            )}
          </li>
        ))}
      </ol>
      {page < totalPages ? (
        <Link href={href(page + 1)} rel="next">
          Older →
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  )
}
