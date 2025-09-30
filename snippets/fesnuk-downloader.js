/*
* Nama fitur : Fesnuk Downloader
* Type : Plugin Esm
* Sumber : https://whatsapp.com/channel/0029Vb6chx1LI8YVtJJJ9a0Y
* Author : ZenzzXD
*/

import axios from 'axios'
import * as cheerio from 'cheerio'
import qs from 'qs'

let handler = async (m, { command, args }) => {
  if (!args[0]) return m.reply('mana linknya')
  m.reply('wett')
  try {
    const url = args[0]
    const payload = qs.stringify({ fb_url: url })
    const res = await axios.post('https://saveas.co/smart_download.php', payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0'
      }
    })
    const $ = cheerio.load(res.data)
    const hd = $('#hdLink').attr('href') || null
    const sd = $('#sdLink').attr('href') || null
    const video = hd || sd
    if (!video) return m.reply('gagal ambil link')
    await m.conn.sendMessage(m.chat, { video: { url: video } }, { quoted: m })
  } catch (e) {
    m.reply(`Eror kak : ${e.message}`)
  }
}

handler.command = ['fbdl']
handler.tags = ['downloader']
handler.help = ['fbdl <url>']
export default handler