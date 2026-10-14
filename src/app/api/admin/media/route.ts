import { getSession } from '@/lib/auth'
import { listMedia } from '@/lib/media'

export async function GET() {
  if (!(await getSession())) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  return Response.json(await listMedia(), { headers: { 'Cache-Control': 'no-store' } })
}
