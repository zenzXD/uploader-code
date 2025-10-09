const url_threads = 'https://www.threads.com/@mood.story_21/post/DJgspOyTc4W?xmt=AQF0inh4-_PI0JMWlFFyreawmmEabBAzjoV4p2_q8R0UtQ'
const rsc = 'w3qin'

const threadsdl = async () => {
  try {
    const res = await fetch(`https://threadsphotodownloader.com/download?url=${encodeURIComponent(url_threads)}&_rsc=${rsc}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
        'Referer': 'https://threadsphotodownloader.com/'
      }
    })
    const text = await res.text()
    const api = text.match(/https:\/\/api\.threadsphotodownloader\.com\/v2\/media\?url=[^"']+/)?.[0]
    if (!api) return { status: false, message: 'media not found' }
    return await (await fetch(api)).json()
  } catch (e) {
    return { status: false, message: e.message }
  }
}
threadsdl().then(console.log)
/*
{
  "image_urls": [],
  "video_urls": [
    {
      "download_url": "https://cdn.threadsphotodownloader.com/scontent-prg1-1.cdninstagram.com/o1/v/xxxxxxxxxxxxxx"
    }
  ]
}
*/