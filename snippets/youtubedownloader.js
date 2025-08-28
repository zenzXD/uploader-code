/*
* Nama fitur : Youtube Downloader MP3 & MP4
* Type : Plugin Esm
* Sumber : https://whatsapp.com/channel/0029Vb6chx1LI8YVtJJJ9a0Y
* Author : ZenzzXD
*/

const yt = {
  get baseUrl() {
    return { origin: 'https://ssvid.net' }
  },
  get baseHeaders() {
    return {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'origin': this.baseUrl.origin,
      'referer': this.baseUrl.origin + '/youtube-to-mp3'
    }
  },
  validateFormat(userFormat) {
    const validFormat = ['mp3', '360p', '720p', '1080p']
    if (!validFormat.includes(userFormat)) throw Error(`invalid format!. available formats: ${validFormat.join(', ')}`)
  },
  handleFormat(userFormat, searchJson) {
    this.validateFormat(userFormat)
    let result
    if (userFormat == 'mp3') result = searchJson.links?.mp3?.mp3128?.k
    else {
      const allFormats = Object.entries(searchJson.links.mp4)
      let selectedFormat = userFormat
      const quality = allFormats.map(v => v[1].q).filter(v => /\d+p/.test(v)).map(v => parseInt(v)).sort((a, b) => b - a).map(v => v + 'p')
      if (!quality.includes(userFormat)) selectedFormat = quality[0]
      const find = allFormats.find(v => v[1].q == selectedFormat)
      result = find?.[1]?.k
    }
    if (!result) throw Error(`${userFormat} gak ada`)
    return result
  },
  hit: async function(path, payload) {
    try {
      const body = new URLSearchParams(payload)
      const r = await fetch(`${this.baseUrl.origin}${path}`, { method: 'POST', headers: this.baseHeaders, body })
      if (!r.ok) throw Error(`${r.status} ${r.statusText}\n${await r.text()}`)
      return await r.json()
    } catch (e) {
      throw Error(`${path}\n${e.message}`)
    }
  },
  download: async function(queryOrYtUrl, userFormat='mp3') {
    this.validateFormat(userFormat)
    let search = await this.hit('/api/ajax/search', { query: queryOrYtUrl, cf_token:'', vt:'youtube' })
    if (search.p=='search') {
      if (!search?.items?.length) throw Error(`hasil pencarian ${queryOrYtUrl} tidak ada`)
      const { v } = search.items[0]
      const videoUrl = 'https://www.youtube.com/watch?v='+v
      search = await this.hit('/api/ajax/search', { query: videoUrl, cf_token:'', vt:'youtube' })
    }
    const vid = search.vid
    const k = this.handleFormat(userFormat, search)
    const convert = await this.hit('/api/ajax/convert', { k, vid })
    if (convert.c_status=='CONVERTING') {
      let convert2
      const limit = 5
      let attempt = 0
      do {
        attempt++
        convert2 = await this.hit('/api/convert/check?hl=en', { vid, b_id: convert.b_id })
        if (convert2.c_status=='CONVERTED') return convert2
        await new Promise(r=>setTimeout(r,5000))
      } while (attempt<limit && convert2.c_status=='CONVERTING')
      throw Error('file belum siap / status belum diketahui')
    } else return convert
  }
}

let handler = async (m, { text, command, conn }) => {
  try {
    m.reply('wett')
    if (!text) throw Error('masukin url  youtube')
    let res
    if (command == 'ytmp3') res = await yt.download(text, 'mp3')
    else if (command == 'ytmp4') res = await yt.download(text, '720p')
    else throw Error('command gk di kenali')

    if (command == 'ytmp3') {
      await conn.sendMessage(
        m.chat,
        { audio: { url: res.dlink }, mimetype: 'audio/mpeg', ptt: false },
        { quoted: m }
      )
    } else if (command == 'ytmp4') {
      await conn.sendMessage(
        m.chat,
        { video: { url: res.dlink }, mimetype: 'video/mp4' },
        { quoted: m }
      )
    }
  } catch (err) {
    m.reply(`Eror kak : ${err.message}`)
  }
}

handler.command = ['ytmp3v2','ytmp4v2']
handler.help = ['ytmp3v2 <url>','ytmp4 <url>']
handler.tags = ['downloader']

export default handler
