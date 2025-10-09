const pin_url = 'https://pin.it/7BXOcCosh'
const pinskrep = async () => {
  try {
    const res = await fetch('https://pintdownloader.com/wp-admin/admin-ajax.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Referer': 'https://pintdownloader.com/',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: new URLSearchParams({
        action: 'process_pinterest_url',
        url: pin_url,
        nonce: '88893e959d'
      }).toString()
    })
    return await res.json()
  } catch (e) {
    return { success: false, message: e.message }
  }
}
pinskrep().then(console.log)

/*
{
  "success": true,
  "data": {
    "mediaUrl": "https://v1.pinimg.com/videos/xxxx",
    "thumbnailUrl": "https://i.pinimg.com/videos/thumbnails/originals/a2xxxxxxxx",
    "isVideo": true,
    "isGif": false,
    "resolution": "1920×1080",
    "fileSize": "Unknown",
    "downloadUrl": "https://pintdownloader.com/?pinterest_force_doxxxxxxxxx",
    "thumbnailDownloadUrl": "https://pintdownloader.com/?pinterest_forcexxxxxxxxxxx"
  }
}
*/