/*
* Nama fitur : Image to Video
* Type : Plugin Esm
* Sumber : https://whatsapp.com/channel/0029Vb6chx1LI8YVtJJJ9a0Y
* Author : ZenzzXD
*/

import axios from 'axios'
import FormData from 'form-data'

let handler = async (m, { conn, args }) => {
  const mime = m.quoted?.mimetype || ''
  if (!/image/.test(mime)) return m.reply('reply gambar dengan command : .img2vid <prompt>')

  const prompt = args.join(' ')
  if (!prompt) return m.reply('prompt nya mana kak?')

  m.reply('wett')

  try {
    const img = await m.quoted.download()
    const form = new FormData()
    form.append('files[]', img, { filename: 'jenn.jpg', contentType: 'image/jpeg' })

    const upload = await axios.post('https://uguu.se/upload', form, { headers: form.getHeaders() })
    const imageUrl = upload.data?.files?.[0]?.url
    if (!imageUrl) return m.reply('uplot gagal kak')

    const gen = await axios.post('https://veo31ai.io/api/pixverse-token/gen', {
      videoPrompt: prompt,
      videoAspectRatio: '16:9',
      videoDuration: 5,
      videoQuality: '540p',
      videoModel: 'v4.5',
      videoImageUrl: imageUrl,
      videoPublic: false
    })

    const taskId = gen.data?.taskId
    if (!taskId) return m.reply('task gagal dibuat')

    const timeout = Date.now() + 180000
    let videoUrl

    while (Date.now() < timeout) {
      const res = await axios.post('https://veo31ai.io/api/pixverse-token/get', {
        taskId,
        videoPublic: false,
        videoQuality: '540p',
        videoAspectRatio: '16:9',
        videoPrompt: prompt
      })

      videoUrl = res.data?.videoData?.url
      if (videoUrl) break

      await new Promise(r => setTimeout(r, 5000))
    }

    if (!videoUrl) return m.reply('vidio gagal dibuat')

    await conn.sendMessage(m.chat, { video: { url: videoUrl } })

  } catch (e) {
    m.reply(`Eror kak : ${e.message}`)
  }
}

handler.help = ['img2vid <prompt>']
handler.tags = ['ai']
handler.command = ['img2vid']

export default handler