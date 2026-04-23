export default function handler(req, res) {
  const { id } = req.query;

  const allowedUsers = ['chobapk-001', 'friend-01'];

  res.setHeader('Content-Type', 'application/x-mpegURL');

  // ? ยังไม่อนุญาต
  if (!allowedUsers.includes(id)) {
    const lockMessage = `#EXTM3U

#EXTINF:-1,?? กรุณาแจ้ง ID เพื่อขออนุมัติ (${id || 'Unknown'})
https://example.com
`;
    return res.status(200).send(lockMessage);
  }

  // ? อนุญาตแล้ว
  const realPlaylist = `#EXTM3U

#EXTINF:-1,Digital TV
https://drive.google.com/uc?export=download&id=1KJeTtN2F7k9BsTDb56UwWYH-w8Sq2_YX
`;

  return res.status(200).send(realPlaylist);
}