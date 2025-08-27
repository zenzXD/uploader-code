/*
* Nama fitur : Webpilot AI (Web Search)
* Type : Plugin Esm
* Sumber : https://whatsapp.com/channel/0029Vb6chx1LI8YVtJJJ9a0Y
* Author : ZenzzXD
*/

import axios from 'axios'

let handler = async (m, { conn, text, command }) => {
  try {
    if (!text) throw new Error('contoh : .webpilot berita terbaru di indonesia')
    m.reply('wett')
    const { data } = await axios.post(
      'https://api.webpilotai.com/rupee/v1/search',
      {
        q: text,
        threadId: ''
      },
      {
        headers: {
          authority: 'api.webpilotai.com',
          accept: 'application/json, text/plain, */*, text/event-stream',
          'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
          authorization: 'Bearer null',
          'cache-control': 'no-cache',
          'content-type': 'application/json;charset=UTF-8',
          origin: 'https://www.webpilot.ai',
          pragma: 'no-cache',
          referer: 'https://www.webpilot.ai/',
          'sec-ch-ua': '"Not-A.Brand";v="99", "Chromium";v="124"',
          'sec-ch-ua-mobile': '?1',
          'sec-ch-ua-platform': '"Android"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'cross-site',
          'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
        }
      }
    )

    let chat = ''
    data.split('\n').forEach(line => {
      if (line.startsWith('data:')) {
        try {
          const json = JSON.parse(line.slice(5))
          if (
            json.type === 'data' &&
            json.data?.section_id === void 0 &&
            json.data?.content
          ) chat += json.data.content
        } catch {}
      }
    })

    m.reply(`${chat || 'gk ada jawaban dri ai'}`)
  } catch (err) {
    m.reply(`Eror kak : ${err.message}`)
  }
}

handler.command = ['webpilot']
handler.help = ['webpilot <query>']
handler.tags = ['ai']

export default handler
