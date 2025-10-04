/*
* Nama fitur : Image to text (ocr)
* Type : Plugin Esm
* Sumber : https://whatsapp.com/channel/0029Vb6chx1LI8YVtJJJ9a0Y
* Author : ZenzzXD
*/

import fs from 'fs'

let handler = async (m, { command, args }) => {
  try {
    const mime = m.quoted?.mimetype || ''
    if (!/image/.test(mime)) {
      return m.reply('reply gambar dengan command .ocr')
    }
    m.reply('wett')
    let buffer = await m.quoted.download()
    const imageBase64 = buffer.toString('base64')
    const url = 'https://staging-ai-image-ocr-266i.frontend.encr.app/api/ocr/process'
    const mimeType = mime || 'image/jpeg'
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ imageBase64, mimeType })
    })

    if (!res.ok) throw new Error(await res.text())
    const json = await res.json()

    let text = json.extractedText
      .replace(/\\n/g, '\n')
      .replace(/```/g, '')
      .trim()

    m.reply(text || 'gk ada teks yang terdeteksi')
  } catch (e) {
    m.reply(`Eror kak : ${e.message}`)
  }
}

handler.command = ['ocr']
handler.help = ['ocr']
handler.tags = ['tools']

export default handler