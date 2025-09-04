/*
* Nama fitur : Youtube Transcript
* Type : Plugin Esm
* Sumber : https://whatsapp.com/channel/0029Vb6chx1LI8YVtJJJ9a0Y
* Author : ZenzzXD
*/

import axios from 'axios'
import * as cheerio from 'cheerio'

async function YoutubeTranscript(youtubeUrl) {
  try {
    let videoId = ''
    if (youtubeUrl.includes('youtu.be/')) {
      videoId = youtubeUrl.split('youtu.be/')[1].substring(0, 11)
    } else if (youtubeUrl.includes('watch?v=')) {
      videoId = youtubeUrl.split('watch?v=')[1].substring(0, 11)
    } else {
      throw new Error('lu ngirim url mana si 😂')
    }

    const targetUrl = `https://youtubetotranscript.com/transcript?v=${videoId}&current_language_code=en`
    const { data } = await axios.get(targetUrl, {
      headers: { 'user-agent': 'Mozilla/5.0' }
    })

    const $ = cheerio.load(data)
    const title = $('h1.card-title').text().trim() || ''
    const author = $("a[data-ph-capture-attribute-element='author-link']").text().trim() || ''
    const thumbnail = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`

    const transcriptArr = []
    $('#transcript span.transcript-segment').each((i, el) => {
      const txt = $(el).text().trim()
      if (txt) transcriptArr.push(txt)
    })
    const transcript = transcriptArr.join(' ')

    return { title, author, thumbnail, transcript }
  } catch (e) {
    throw e
  }
}

let handler = async (m, { usedPrefix, command, text, conn }) => {
  try {
    if (!text) throw new Error('contoh : .ytranskrip <url>')
    m.reply('wett')
    const res = await YoutubeTranscript(text)
    const caption = `Title : ${res.title}\nChannel : ${res.author}\n\nTranscript :\n${res.transcript}`
    await conn.sendMessage(m.chat, { image: { url: res.thumbnail }, caption })
  } catch (e) {
    m.reply(`Eror kak : ${e.message}`)
  }
}

handler.command = ['ytranskrip']
handler.help = ['ytranskrip <url>']
handler.tags = ['tools']

export default handler
