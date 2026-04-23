import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const token = Math.random().toString(36).substring(2, 10);

  // สร้าง user แบบยังไม่อนุมัติ
  await kv.set(token, {
    approved: false,
    createdAt: Date.now()
  });

  return res.json({
    token,
    message: "ส่ง token นี้ให้แอดมินอนุมัติ"
  });
}