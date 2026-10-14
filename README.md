# Footography.biz

Next.js 16 + React 19 website for footography.biz, with a built-in blog CMS.

- **Public site:** Home (the original landing page), About, Blog, blog categories, Contact, Privacy Policy, Terms, Affiliate Disclaimer, 404
- **Admin CMS** at `/admin`: dashboard, rich-text post editor with an SEO checklist, media library, contact messages
- **Database:** SQLite through libSQL (`data/footography.db`). Uploaded images are stored in the database too, so they survive redeploys.
- **Technical SEO:** per-page metadata, canonical URLs, Open Graph/Twitter cards, JSON-LD, dynamic `sitemap.xml`, `robots.txt`, `feed.xml` (RSS), `llms.txt`, web manifest, and security headers

The original static page is kept in `legacy-static/` for reference. It is not served.

## Getting started

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev          # http://localhost:3000
```

Production:

```bash
npm run build
npm start            # serves on port 3000 (use -p to change it)
```

## Environment variables (`.env.local`)

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public URL. Used for canonical links, sitemap and OG tags (`https://footography.biz`) |
| `DATABASE_URL` | `file:./data/footography.db` locally, or `libsql://<db>.turso.io` for Turso |
| `DATABASE_AUTH_TOKEN` | Only needed for Turso |
| `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` | Set by the Vercel Turso integration. Used when `DATABASE_URL` is not set |
| `BLOB_READ_WRITE_TOKEN` | Set by Vercel Blob. When present, uploaded images go to Blob instead of the database |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Admin login for `/admin` |
| `AUTH_SECRET` | Random string, at least 32 characters, used to sign the admin session |
| `SITE_NOINDEX` | `true` keeps the whole site out of search engines (meta robots, `X-Robots-Tag`, no sitemap in robots.txt). Remove it and redeploy to go live |

`.env.example` lists the same variables. **Change `ADMIN_PASSWORD` before going live.** Changing `AUTH_SECRET` signs out every session.

## Writing a blog post

1. Go to `/admin` and sign in.
2. Open **Write New Post**. Add a title. The URL slug is generated from it, and you can edit it.
3. Write in the editor. Use H2/H3 headings, lists, links and images. **HTML** mode lets you edit or paste raw HTML.
4. Fill in the focus keyword, SEO title and meta description. The SEO panel scores the post and shows a Google preview.
5. Choose a featured image, category and tags.
6. Click **Save draft** (private), use **Preview** to check it, then click **Publish**. A future publish date schedules the post.

Notes:
- Link to the partner with `/go/footography`. Those links are marked `rel="sponsored nofollow"` automatically. The partner URL is set in `src/lib/site.ts` (`outboundLinks`).
- Uploaded images are resized to at most 1600px, converted to WebP, and stripped of EXIF/GPS data.
- Saving a post refreshes the cached home page, blog lists, sitemap, RSS feed and `llms.txt` straight away.

## Deployment

**VPS or any Node host (recommended):** run `npm run build && npm start` behind Nginx or Caddy with HTTPS, or use PM2 to keep it running. Copy `data/footography.db` to the server, because it holds the published blog post and images, and back it up regularly.

**Vercel (current setup):** project `footography-biz`. Turso (Vercel Marketplace) stores the posts and Vercel Blob stores the images. Both integrations add their environment variables to the project automatically. Deploy with `vercel deploy --prod`. Large photos are shrunk in the browser before upload, because Vercel functions accept at most 4.5 MB per request.

DNS for `footography.biz` (at the registrar): an `A` record for `@` pointing to Vercel, and a `CNAME` for `www` pointing to the value shown in Vercel → Project → Settings → Domains. `www` redirects to the apex domain.

## After launch (SEO)

1. Add the site to Google Search Console and Bing Webmaster Tools, then submit `https://footography.biz/sitemap.xml`.
2. Check `/robots.txt` and the post pages in the [Rich Results Test](https://search.google.com/test/rich-results).
3. Publish regularly and link new posts to older ones. Every post should have at least 2 internal links.

## Project structure

```
src/
  app/
    (site)/          public pages (home, about, blog, contact, legal)
    admin/           CMS (login, dashboard, posts, media, messages, preview)
    api/admin/       image upload + media list (session protected)
    media/[file]/    serves uploaded images from the database
    go/[slug]/       outbound partner redirects
    sitemap.ts, robots.ts, manifest.ts, feed.xml/, llms.txt/
  components/site    public UI components
  components/admin   editor (TipTap), media picker, SEO panel
  lib/               db, posts, media, auth, sanitising, SEO helpers, site config
  proxy.ts           protects /admin and /api/admin
```
