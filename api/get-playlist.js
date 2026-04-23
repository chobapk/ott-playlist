export default function handler(req, res) {
    // 1. ดึง ID จากสิ่งที่แอป IPTV ส่งมา (มักจะส่งมาใน Query หรือ Header)
    const { id } = req.query; 

    // 2. รายชื่อ ID ที่คุณอนุญาต (ในอนาคตดึงจาก Database ได้)
    const allowedUsers = ['chobapk-001', 'friend-01'];

    // 3. ตรวจสอบเงื่อนไข
    if (allowedUsers.includes(id)) {
        // ถ้า ID ถูกต้อง ส่ง Playlist จริงไปให้
        const realPlaylist = `#EXTM3U\n#EXTINF:-1,GMM25\nhttp://stream-url...`;
        res.setHeader('Content-Type', 'text/plain');
        return res.status(200).send(realPlaylist);
    } else {
        // ถ้า ID ไม่รู้จัก ส่งข้อความ "รออนุมัติ" กลับไปเหมือนในรูป 40247.png
        const lockMessage = `#EXTM3U\n#EXTINF:-1,กรุณาแจ้ง ID (${id || 'Unknown'}) เพื่อขออนุมัติ\nhttp://...`;
        res.setHeader('Content-Type', 'text/plain');
        return res.status(200).send(lockMessage);
    }
}