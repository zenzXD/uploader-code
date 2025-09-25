/*
* Nama fitur : shorturl kua.lat 
* Type : Plugin Esm
* Sumber : https://whatsapp.com/channel/0029Vb6chx1LI8YVtJJJ9a0Y
* Author : ZenzzXD
*/

import axios from 'axios'
import qs from 'querystring'
import zlib from 'zlib'

async function kualatshort(url) {
  const res = await axios.post(
    'https://kua.lat/shorten',
    qs.stringify({ url }),
    {
      responseType: 'arraybuffer',
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'id-ID,id;q=0.9,en-AU;q=0.8,en;q=0.7,en-US;q=0.6',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin': 'https://kua.lat',
        'Referer': 'https://kua.lat/',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      }
    }
  )

  let decoded
  const encoding = res.headers['content-encoding']

  if (encoding === 'br') {
    decoded = zlib.brotliDecompressSync(res.data)
  } else if (encoding === 'gzip') {
    decoded = zlib.gunzipSync(res.data)
  } else if (encoding === 'deflate') {
    decoded = zlib.inflateSync(res.data)
  } else {
    decoded = res.data
  }

  return JSON.parse(decoded.toString())
}

let handler = async (m, { text }) => {
  try {
    if (!text) return m.reply('Contoh : .shorturl https://api.zenzxz.my.id')
    let result = await kualatshort(text)
    m.reply('wett')
    m.reply(`shorturl : ${result.data.shorturl}`)
  } catch (e) {
    m.reply(`Eror kak : ${e.message}`)
  }
}

handler.command = ['shorturl']
handler.help = ['shorturl <url>']
handler.tags = ['tools']

export default handler