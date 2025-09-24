/*
* Nama fitur : Video Enhancer (hdvid)
* Type : Plugin Esm
* Sumber : https://whatsapp.com/channel/0029Vb6chx1LI8YVtJJJ9a0Y
* Author : ZenzzXD
* Sumber skrep : Shannz (https://whatsapp.com/channel/0029Vb2mOzL1Hsq0lIEHoR0N/659)
*/

import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'

const resolutions = {
  'hd': '1280x720',
  'full-hd': '1920x1080',
  '2k': '2560x1440',
  '4k': '3840x2160'
}

async function videoHD(filePath, resolution) {
  if (!fs.existsSync(filePath)) throw new Error(`mana jir`)
  if (!resolution) throw new Error(`harus isi resolusi (hd/full-hd/2k/4k)`)

  const upscaleValue = resolutions[resolution.toLowerCase()]
  if (!upscaleValue) throw new Error(`reso nya gada`)

  try {
    const data = new FormData()
    data.append('upfile', fs.createReadStream(filePath))
    data.append('upscale', upscaleValue)
    data.append('submitfile', '1')

    const config = {
      method: 'POST',
      url: 'https://www.videotoconvert.com/upscale/',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'origin': 'https://www.videotoconvert.com',
        'referer': 'https://www.videotoconvert.com/upscale/',
        ...data.getHeaders()
      },
      data: data
    }

    const response = await axios.request(config)
    const htmlResponse = response.data

    const downloadLinkRegex = /<a href="([^"]+)" target="_blank">Download File/i
    const match = htmlResponse.match(downloadLinkRegex)

    if (match && match[1]) {
      const downloadUrl = match[1]
      return downloadUrl
    } else {
      throw new Error('Rusakk.')
    }
  } catch (error) {
    throw error
  }
}

let handler = async (m, { conn, usedPrefix, command, text }) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mimetype || ''
    if (!mime.includes('video')) return m.reply(`reply video dengan command .hdvid <hd/full-hd/2k/4k>`)
    if (!text) return m.reply(`masukkan resolusi, contoh: .hdvid hd atau .hdvid full-hd`)

    m.reply(:wett')

    let media = await q.download(true)
    let out = await videoHD(media, text.trim())

    await conn.sendFile(m.chat, out, 'zen.mp4', 'done kak', m)
  } catch (e) {
    m.reply(`Eror kak : ${e.message}`)
  }
}

handler.help = ['hdvid <resolusi>']
handler.tags = ['tools']
handler.command = ['hdvid']

export default handler