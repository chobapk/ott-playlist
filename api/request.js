import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  const token = Math.random().toString(36).substring(2, 10);

  await redis.set(token, { approved: false });

  return res.json({
    message: "ส่ง token นี้ให้แอดมิน",
    token
  });
}