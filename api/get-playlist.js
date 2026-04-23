import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const { token } = req.query;

  res.setHeader('Content-Type', 'application/x-mpegURL');

  const user = await kv.get(token);

  // ? ยังไม่อนุมัติ
  if (!user || !user.approved) {
    return res.status(200).send(`#EXTM3U
#EXTINF:-1,?? NOT APPROVED YET
`);
  }

  // ? อนุมัติแล้ว
  return res.status(200).send(`#EXTM3U
#EXTINF:-1,Digital TV
https://drive.google.com/uc?export=download&id=1KJeTtN2F7k9BsTDb56UwWYH-w8Sq2_YX
`);
}