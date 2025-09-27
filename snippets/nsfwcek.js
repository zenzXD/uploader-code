/*
* Nama fitur : Nsfw Check 
* Type : Plugin Esm
* Sumber : https://whatsapp.com/channel/0029Vb6chx1LI8YVtJJJ9a0Y
* Author : ZenzzXD
*/

import axios from 'axios'
import FormData from 'form-data'

async function nyckelCheck(imageBuffer) {
  const form = new FormData()
  form.append('file', imageBuffer, { filename: 'zen.jpg' })
  const res = await axios.post(   'https://www.nyckel.com/v1/functions/o2f0jzcdyut2qxhu/invoke',
    form,
    {
      headers: {
        ...form.getHeaders(),
        'accept': 'application/json, text/javascript, */*; q=0.01',
        'origin': 'https://www.nyckel.com',
        'referer': 'https://www.nyckel.com/pretrained-classifiers/nsfw-identifier/',
        'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36',
        'x-requested-with': 'XMLHttpRequest'
      }
    }
  )

  const { labelName, labelId, confidence } = res.data
  return `labelName : ${labelName}\nlabelId : ${labelId}\nconfidence : ${confidence}`
}

let handler = async (m, { conn, args }) => {
  try {
    const mime = m.quoted?.mimetype || ''
    if (!/image/.test(mime)) {
      return m.reply('reply gambar dengan command : .nsfwcek')
    }
    m.reply('wett')
    const imageBuffer = await m.quoted.download()
    if (!imageBuffer) return m.reply('eror pas mengunduh gambar')

    const result = await nyckelCheck(imageBuffer)
    m.reply(result)
  } catch (e) {
    m.reply(`Eror kak : ${e.message}`)
  }
}

handler.command = ['nsfwcek']
handler.help = ['nsfwcek']
handler.tags = ['tools']

export default handler