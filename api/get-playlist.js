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

  try {
    const user = await kv.get(token);
    if (!user || !user.approved) {
      res.setHeader('Content-Type', 'application/x-mpegURL');
      return res.status(200).send(`#EXTM3U\n#EXTINF:-1,?? NOT APPROVED YET\n`);
    }

    const tvPath = path.join(process.cwd(), 'api', 'playlist', 'playlist.m3u');
    const seriesPath = path.join(process.cwd(), 'api', 'playlist', 'series.m3u');

    let finalContent = "";

    if (id === '1') {
      const tvContent = fs.existsSync(tvPath) ? fs.readFileSync(tvPath, 'utf8') : "#EXTM3U\n";
      let seriesContent = "";
      if (fs.existsSync(seriesPath)) {
        seriesContent = fs.readFileSync(seriesPath, 'utf8');
        seriesContent = seriesContent.replace(/^#EXTM3U.*\n?/, "");
      }
      finalContent = tvContent.trim() + "\n\n" + seriesContent.trim();
    } else if (id === '2') {
      finalContent = fs.existsSync(seriesPath) ? fs.readFileSync(seriesPath, 'utf8') : "#EXTM3U\n";
    } else {
      finalContent = fs.existsSync(tvPath) ? fs.readFileSync(tvPath, 'utf8') : "#EXTM3U\n";
    }

    res.setHeader('Content-Type', 'application/x-mpegURL; charset=utf-8');
    return res.status(200).send(finalContent);

  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}