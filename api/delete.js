import { kv } from '@vercel/kv';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return new Response('Token required', { status: 400 });
  }

  await kv.del(token);

  return new Response(`Deleted: ${token}`, { status: 200 });
}
 //https://my-iptv-playlist.vercel.app/api/delete?token=abc123