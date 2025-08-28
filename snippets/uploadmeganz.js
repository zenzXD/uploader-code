/*
* Nama fitur : Upload mega.nz
* Type : Plugin Esm
* Sumber : https://whatsapp.com/channel/0029Vb6Zs8yEgGfRQWWWp639
* Author : ZenzzXD
*/

import { Storage } from 'megajs'

const email = 'example@gmail.com' // login ke https://mega.nz/register
const password = 'examplepassword' // login ke https://mega.nz/register

async function aplotomega(fileName, buffer) {
  const storage = await new Storage({ email, password }).ready
  const file = await storage.upload(fileName, buffer).complete
  return await file.link()
}

let handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) return m.reply('replay file dengan command .upmeganz')

  let buffer = await q.download()
  if (!buffer) return m.reply('gagal download file')

  try {
    m.reply('wett')
    let fileName = q.filename || `zenn_${Date.now()}`
    let link = await aplotomega(fileName, buffer)
    m.reply(`file berhasil di upload : ${link}`)
  } catch (err) {
    m.reply(`Eror kak : ${err.message}`)
  }
}

handler.help = ['upmeganz']
handler.tags = ['tools']
handler.command = ['upmeganz']

export default handler