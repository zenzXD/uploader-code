/*
* Nama fitur : Tourl
* Type : Plugin Esm
* Sumber : https://whatsapp.com/channel/0029Vb6chx1LI8YVtJJJ9a0Y
* Author : ZenzzXD (refactored)
*/

import { fileTypeFromBuffer } from 'file-type'
import { uploadFile as uploadCloudku } from 'cloudku-uploader'
import fetch from 'node-fetch'
import FormData from 'form-data'

async function uploadToTop4Top(buffer) {
    const origin = 'https://top4top.io'
    const f = await fileTypeFromBuffer(buffer)
    if (!f) throw new Error('gagal mendapatkan extensi file/buffer')
    const data = new FormData()
    data.append('file_1_', buffer, { filename: `zenn?-${Date.now()}.${f.ext}` })
    data.append('submitr', '[ رفع الملفات ]')
    const r = await fetch(origin + '/index.php', { method: 'POST', body: data })
    if (!r.ok) throw new Error(`${r.status} ${r.statusText}\n${await r.text()}`)
    const html = await r.text()
    const matches = html.matchAll(/<input readonly="readonly" class="all_boxes" onclick="this.select\(\);" type="text" value="(.+?)" \/>/g)
    const arr = Array.from(matches)
    const downloadUrl = arr.map(v => v[1]).find(v => v.endsWith(f.ext))
    if (!downloadUrl) throw new Error('eror saat mendapatkan link Top4Top')
    return downloadUrl
}

async function uploadToZen(buffer, filename) {
    const form = new FormData()
    form.append('file', buffer, filename)
    const res = await fetch('https://uploader.zenzxz.dpdns.org/upload', {
        method: 'POST',
        body: form,
        headers: {
            ...form.getHeaders(),
            'User-Agent': 'Mozilla/5.0',
            'Origin': 'https://uploader.zenzxz.dpdns.org',
            'Referer': 'https://uploader.zenzxz.dpdns.org/'
        }
    })
    const html = await res.text()
    const match = html.match(/href="(https?:\/\/uploader\.zenzxz\.dpdns\.org\/uploads\/[^"]+)"/)
    if (!match) throw new Error('eror saat mendapatkan link dari zenzxz')
    return match[1]
}

let handler = async (m, { args }) => {
    try {
        const q = m.quoted || m
        const mime = (q.msg || q).mimetype || ''
        if (!mime || !/image|video/.test(mime)) return m.reply('cumak foto atau video yang bisa diupload')
        m.reply('wett')
        const buffer = await q.download()
        const { ext } = (await fileTypeFromBuffer(buffer)) || { ext: 'bin' }
        const filename = `jenn-${Date.now()}.${ext}`

        const results = await Promise.allSettled([
            uploadCloudku(buffer, filename, args[0] || null),
            uploadToZen(buffer, filename),
            uploadToTop4Top(buffer)
        ])

        let text = ''
        if (results[0].status === 'fulfilled' && results[0].value?.status === 'success') text += `*Cloudku : ${results[0].value.data.url}*\n`
        if (results[1].status === 'fulfilled') text += `*Zenzxz : ${results[1].value}*\n`
        if (results[2].status === 'fulfilled') text += `*Top4Top : ${results[2].value}*\n`

        if (!text) throw new Error('Gagal upload ke semua layanan')
        m.reply('*Upload berhasil :*\n' + text)
    } catch (err) {
        m.reply(`Eror kak : ${err.message}`)
    }
}

handler.help = ['tourl']
handler.tags = ['tools']
handler.command = ['tourl']

export default handler