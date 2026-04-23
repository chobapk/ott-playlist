export default async function handler(req, res) {
  const { id } = req.query;

  const allowedUsers = ['chobapk-001', 'friend-01'];

  res.setHeader('Content-Type', 'application/x-mpegURL');

  // ? ยังไม่อนุญาต
  if (!allowedUsers.includes(id)) {
    const lockMessage = `#EXTM3U

#EXTINF:-1,?? กรุณาแจ้ง ID (${id || 'Unknown'})
https://example.com
`;
    return res.status(200).send(lockMessage);
  }

  try {
    // ?? URL playlist ที่จะดึง (ใส่ของจริงตรงนี้)
    const url = "https://drive.google.com/uc?export=download&id=1KJeTtN2F7k9BsTDb56UwWYH-w8Sq2_YX";

    const response = await fetch(url);
    const data = await response.text();

    return res.status(200).send(data);

  } catch (error) {
    return res.status(500).send("#EXTM3U\n#EXTINF:-1,Error loading playlist\n");
  }
}