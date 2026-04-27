import { kv } from '@vercel/kv';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { token, id } = req.query;
  const ua = (req.headers['user-agent'] || '').toLowerCase();

  const isWhitelisted =
    ua.includes('televizo') ||
    ua.includes('ott') ||
    ua.includes('ottplayer') ||
    ua.includes('navigator') ||
    ua.includes('liftplay');

  const goGoogle = () => {
    res.writeHead(302, { Location: 'https://www.google.com' });
    return res.end();
  };

  if (!isWhitelisted) {
    if (ua.includes('windows nt') || !ua.includes('android')) return goGoogle();
    if (/android\s*\d+;\s*k(\)|;|\s)/.test(ua)) return goGoogle();
    if (!/android\s*\d+;\s*[^;)\]]+/.test(ua)) return goGoogle();
  }

  if (!token) return res.status(403).send('Token required');

  // ... (โค้ดส่วนเช็ค User-Agent และ Token ด้านบนคงไว้เหมือนเดิม) ...

  try {
    const user = await kv.get(token);
    if (!user || !user.approved) {
      res.setHeader('Content-Type', 'application/x-mpegURL');
      return res.status(200).send(`#EXTM3U\n#EXTINF:-1,? NOT APPROVED YET\n`);
    }

    // === วางแทนตั้งแต่ตรงนี้เป็นต้นไป ===
    // แก้เป็นแบบนี้ (ถอยออกมาหาโฟลเดอร์ playlist ที่อยู่ด้านนอก)
    const tvPath = path.join(process.cwd(), 'playlist', 'playlist.m3u');
    const seriesPath = path.join(process.cwd(), 'playlist', 'series.m3u');
    const kubPath = path.join(process.cwd(), 'playlist', 'KUBHDS.m3u');

    let finalContent = "";

    if (id === '1') {
      let merged = "#EXTM3U\n"; 
      const files = [tvPath, seriesPath, kubPath];
      
      files.forEach((filePath) => {
        if (fs.existsSync(filePath)) {
          let content = fs.readFileSync(filePath, 'utf8');
          content = content.replace(/^#EXTM3U.*\n?/, ""); // ตัดหัวออก
          if (content.trim()) {
            merged += content.trim() + "\n\n";
          }
        }
      });
      finalContent = merged.trim();

    } else if (id === '2') {
      finalContent = fs.existsSync(seriesPath) ? fs.readFileSync(seriesPath, 'utf8') : "#EXTM3U\n";
    } else if (id === '3') {
      finalContent = fs.existsSync(kubPath) ? fs.readFileSync(kubPath, 'utf8') : "#EXTM3U\n";
    } else {
      finalContent = fs.existsSync(tvPath) ? fs.readFileSync(tvPath, 'utf8') : "#EXTM3U\n";
    }
    // === สิ้นสุดจุดที่วางแทน ===

    res.setHeader('Content-Type', 'application/x-mpegURL; charset=utf-8');
    return res.status(200).send(finalContent);

  } catch (error) {
    // ...
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}