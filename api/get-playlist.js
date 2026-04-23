import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  const { token } = req.query;

  res.setHeader('Content-Type', 'application/x-mpegURL');

  // ?? ตรวจ token จาก database
  const user = await redis.get(token);

  // ? ยังไม่อนุมัติ
  if (!user || !user.approved) {
    return res.status(200).send(`#EXTM3U

#EXTINF:-1,?? กรุณาขออนุมัติ Token (${token || 'Unknown'})
https://example.com
`);
  }

  try {
    // ? ดึง playlist จริง
    const url = "https://drive.google.com/uc?export=download&id=1KJeTtN2F7k9BsTDb56UwWYH-w8Sq2_YX";

    const response = await fetch(url);
    const data = await response.text();

    return res.status(200).send(data);

  } catch (error) {
    return res.status(500).send(`#EXTM3U

#EXTINF:-1,Error loading playlist
`);
  }
}