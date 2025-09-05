/*
* Nama fitur : Apple Music Downloader
* Type : Plugin Esm
* Sumber : https://whatsapp.com/channel/0029Vb6chx1LI8YVtJJJ9a0Y
* Author : ZenzzXD
*/

import axios from 'axios'
import { CookieJar } from 'tough-cookie'
import { wrapper } from 'axios-cookiejar-support'
import * as cheerio from 'cheerio'
import FormData from 'form-data'

const jar = new CookieJar()
const client = wrapper(
    axios.create({
        jar,
        withCredentials: true,
        headers: {
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    })
)

function parseDownloadLinks(html) {
    const $ = cheerio.load(html)
    const results = []

    $('#download-block a').each((i, el) => {
        const href = $(el).attr('href') || ''
        const name = $(el).text().trim()

        if (href.startsWith('/dl?token=') && name) {
            const fullUrl = `https://aplmate.com${href}`
            results.push({ name, url: fullUrl })
        }
    })

    return results
}

class appleMusic {
    async getToken(url, siteKey, type, proxy) {
        const urls = `https://anabot.my.id/api/tools/bypass?url=${encodeURIComponent(url)}&siteKey=${encodeURIComponent(siteKey)}&type=${encodeURIComponent(type)}&proxy=${encodeURIComponent(proxy)}&apikey=freeApikey`
        const options = {
            method: 'GET',
            headers: { Accept: 'application/json' }
        }
        try {
            const res = await fetch(urls, options)
            const json = await res.json()
            return json?.data?.result?.token
        } catch (err) {
            console.error('error:' + err)
        }
    }

    async getHiddenField() {
        const res = await client.get('https://aplmate.com/')
        const $ = cheerio.load(res.data)
        const input = $('input[name^="_"][type="hidden"]')
        const name = input.attr('name')
        const value = (input.val() || '').trim()
        if (!name || !value) throw new Error('Hidden field tidak ditemukan / kosong')
        return { name, value }
    }

    async download(url) {
        const { name, value } = await this.getHiddenField()
        const turnstileToken = await this.getToken(
            'https://aplmate.com/',
            '0x4AAAAAABdqfzl6we62dQyp',
            'turnstile-min',
            ''
        )
        const form = new FormData()
        form.append('url', url)
        form.append(name, value)
        form.append('cf-turnstile-response', turnstileToken)

        const headers = {
            ...form.getHeaders(),
            Origin: 'https://aplmate.com',
            Referer: 'https://aplmate.com/',
            Accept: 'application/json, text/plain, */*'
        }

        const res = await client.post('https://aplmate.com/action', form, { headers })
        const $ = cheerio.load(res.data?.html)
        const data = $('input[name="data"]').val()
        const base = $('input[name="base"]').val()
        const token = $('input[name="token"]').val()
        return await this.getDataDownload({ data, base, token })
    }

    async getDataDownload({ data, base, token }) {
        const form = new FormData()
        form.append('data', data)
        form.append('base', base)
        form.append('token', token)
        const headers = {
            ...form.getHeaders(),
            Origin: 'https://aplmate.com',
            Referer: 'https://aplmate.com/',
            Accept: 'application/json, text/plain, */*'
        }
        const { data: html } = await client.post('https://aplmate.com/action/track', form, { headers })
        return parseDownloadLinks(html?.data)
    }
}

let handler = async (m, { conn, text }) => {
    try {
        if (!text) throw new Error('url nya mana bg?, contoh, .applemusic <url>')
        m.reply('wett')
        const dl = new appleMusic()
        const result = await dl.download(text)
        if (!result.length) throw new Error('gagal mendapatkan link download')
        let audio = result.find(v => v.name.toLowerCase().includes('mp3')) || result[0]
        await conn.sendMessage(m.chat, { audio: { url: audio.url }, mimetype: 'audio/mpeg', ptt: false }, { quoted: m })
    } catch (e) {
        m.reply(`Eror kak : ${e.message}`)
    }
}

handler.command = ['applemusic']
handler.help = ['applemusic']
handler.tags = ['downloader']

export default handler
