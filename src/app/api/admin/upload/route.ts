import { getSession } from '@/lib/auth'
import { saveUpload } from '@/lib/media'

export async function POST(request: Request) {
  if (!(await getSession())) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return Response.json({ error: 'Invalid upload.' }, { status: 400 })
  }
  const file = form.get('file')
  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ error: 'Please choose an image file.' }, { status: 400 })
  }
  try {
    const media = await saveUpload(file, String(form.get('alt') ?? '').slice(0, 200))
    return Response.json(media, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed.'
    return Response.json({ error: message }, { status: 400 })
  }
}
