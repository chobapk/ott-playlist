import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const { token } = req.query;

  const user = await kv.get(token);

  if (!user) {
    return res.status(404).json({ error: "Token not found" });
  }

  await kv.set(token, {
    ...user,
    approved: true
  });

  return res.json({
    message: "อนุมัติแล้ว",
    token
  });
}