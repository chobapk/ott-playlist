import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  const { token } = req.query;

  await redis.set(token, { approved: true });

  return res.json({
    message: "อนุมัติแล้ว",
    token
  });
}