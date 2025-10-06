/*
* Nama fitur : Fake Story
* Type : Plugin Esm
* Sumber : https://whatsapp.com/channel/0029Vb6chx1LI8YVtJJJ9a0Y
* Author : ZenzzXD
*/

import axios from 'axios'
import FormData from 'form-data'
import moment from 'moment-timezone'

let handler = async (m, { conn, args }) => {
  try {
    const quoted = m.quoted
    const mime = quoted?.mimetype || ''
    if (!/image/.test(mime)) {
      m.reply('reply gambar yang mau dijadiin story kak : .fakestory <username>')
      return
    }

    const username = args.join(' ')
    m.reply('wett')

    const imageBuffer = await quoted.download()
    if (!imageBuffer) {
      m.reply('ggl ngambil gmbar')
      return
    }

    let avatarBuffer
    try {
      const ppUrl = await conn.profilePictureUrl(m.sender, 'image')
      const { data } = await axios.get(ppUrl, { responseType: 'arraybuffer' })
      avatarBuffer = Buffer.from(data)
    } catch {
      avatarBuffer = imageBuffer
    }

    const jam = moment().tz('Asia/Jakarta').format('HH:mm') + ' WIB'

    const form = new FormData()
    form.append('username', username)
    form.append('jam', jam)
    form.append('image', imageBuffer, { filename: 'image.jpg' })
    form.append('avatar', avatarBuffer, { filename: 'avatar.jpg' })

    const res = await axios.post('https://fathurweb.qzz.io/api/canvas/fakestory', form, {
      headers: form.getHeaders(),
      responseType: 'arraybuffer',
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    })

    const hasil = Buffer.from(res.data)
    await conn.sendFile(m.chat, hasil, 'zenn.jpg', '', m)
  } catch (e) {
    m.reply(`Eror kak : ${e.message}`)
  }
}

handler.command = ['fakestory']
handler.tags = ['maker']
handler.help = ['fakestory <username>']

export default handler