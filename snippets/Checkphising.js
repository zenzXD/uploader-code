/*
* Nama fitur : Cekphising 
* Type : Plugin Esm
* Sumber : https://whatsapp.com/channel/0029Vb6chx1LI8YVtJJJ9a0Y
* Author : ZenzzXD
*/

import axios from 'axios'
import FormData from 'form-data'

async function cekWeb(url) {
  const data = new FormData()
  data.append('url', url)

  const config = {
    method: 'POST',
    url: 'https://cekwebphishing.my.id/scan.php',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36',
      'sec-ch-ua-platform': '"Android"',
      'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
      'dnt': '1',
      'sec-ch-ua-mobile': '?1',
      'origin': 'https://cekwebphishing.my.id',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      'referer': 'https://cekwebphishing.my.id/',
      'accept-language': 'id,en-US;q=0.9,en;q=0.8,ja;q=0.7',
      'priority': 'u=1, i',
      ...data.getHeaders()
    },
    data
  }

  const api = await axios.request(config)
  return api.data
}

let handler = async (m, { text }) => {
  try {
    if (!text) return m.reply('Contoh : .cekphising https://api.zenzxz.my.id')
    const result = await cekWeb(text)
    m.reply('wett')
    m.reply(`Result : ${typeof result === 'string' ? result : JSON.stringify(result, null, 2)}`)
  } catch (e) {
    m.reply(`Eror kak : ${e.message}`)
  }
}

handler.command = ['cekphising']
handler.help = ['cekphising <url>']
handler.tags = ['tools']

export default handler