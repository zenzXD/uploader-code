/*
* Nama fitur : Meganz Downloader
* Type : Plugin Esm
* Sumber : https://whatsapp.com/channel/0029Vb6Zs8yEgGfRQWWWp639
* Author : ZenzzXD
*/ 

import { File } from 'megajs'
import path from 'path'

async function apeniwok(inih_url) {
  const file = File.fromURL(inih_url)
  await file.loadAttributes()
  const buffer = await file.downloadBuffer()
  return {
    name: file.name,
    size: file.size,
    buffer
  }
}

let handler = async (m, { args, usedPrefix, command, conn }) => {
  if (!args[0]) return m.reply(`contoh : ${command} https://mega.nz/file/p4YFyRCK#zVv8OJ-Rd9O3h6_7BUdnHw2YpzjU7RTC2nzUcqFnkH4`)
  m.reply('wett')
  try {
    const data = await apeniwok(args[0])
    const ext = path.extname(data.name) || ''
    await conn.sendMessage(m.chat, { document: data.buffer, fileName: data.name, mimetype: ext ? `application/${ext.slice(1)}` : 'application/octet-stream' }, { quoted: m })
  } catch (e) {
    m.reply(`Eror kak : ${e.message}`)
  }
}

handler.help = ['megadl <url>']
handler.tags = ['downloader']
handler.command = ['mega', 'megadl']

export default handler