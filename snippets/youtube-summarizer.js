/*
* Nama fitur : Youtube Summarizer 
* Type : Plugin Esm
* Sumber : https://whatsapp.com/channel/0029Vb6chx1LI8YVtJJJ9a0Y
* Author : ZenzzXD
*/

import axios from 'axios'

function generateRandomDeviceHash() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 32; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

function getRandomOSName() {
    const osNames = [
        'HONOR', 'Samsung', 'Xiaomi', 'OnePlus', 'Huawei',
        'OPPO', 'Vivo', 'Realme', 'Google', 'LG',
        'Sony', 'Motorola', 'Nokia', 'TCL', 'ASUS'
    ]
    return osNames[Math.floor(Math.random() * osNames.length)]
}

function getRandomOSVersion() {
    const versions = ['8', '9', '10', '11', '12', '13', '14']
    return versions[Math.floor(Math.random() * versions.length)]
}

function getRandomPlatform() {
    const platforms = [1, 2, 3]
    return platforms[Math.floor(Math.random() * platforms.length)]
}

async function ytsummarizer(url, { lang = 'id' } = {}) {
    try {
        if (!/youtube.com|youtu.be/.test(url)) throw new Error('Invalid youtube url')

        const randomDeviceHash = generateRandomDeviceHash()
        const randomOSName = getRandomOSName()
        const randomOSVersion = getRandomOSVersion()
        const randomPlatform = getRandomPlatform()

        console.log(`Using device: ${randomOSName} ${randomOSVersion}, Platform: ${randomPlatform}, Hash: ${randomDeviceHash}`)

        const { data: a } = await axios.post('https://gw.aoscdn.com/base/passport/v2/login/anonymous', {
            brand_id: 29,
            type: 27,
            platform: randomPlatform,
            cli_os: 'web',
            device_hash: randomDeviceHash,
            os_name: randomOSName,
            os_version: randomOSVersion,
            product_id: 343,
            language: 'en'
        }, {
            headers: { 'content-type': 'application/json' }
        })

        const { data: b } = await axios.post('https://gw.aoscdn.com/app/gitmind/v3/utils/youtube-subtitles/overviews?language=en&product_id=343', {
            url: url,
            language: lang,
            deduct_status: 0
        }, {
            headers: {
                authorization: `Bearer ${a.data.api_token}`,
                'content-type': 'application/json'
            }
        })

        while (true) {
            const { data } = await axios.get(`https://gw.aoscdn.com/app/gitmind/v3/utils/youtube-subtitles/overviews/${b.data.task_id}?language=en&product_id=343`, {
                headers: {
                    authorization: `Bearer ${a.data.api_token}`,
                    'content-type': 'application/json'
                }
            })
            if (data.data.sum_status === 1) return data.data
            await new Promise(res => setTimeout(res, 1000))
        }
    } catch (error) {
        throw new Error(error.message)
    }
}

let handler = async (m, { text }) => {
    if (!text) return m.reply('masukin link yutup contoh : .ytsummarizer https://youtube.com/watch?v=xxxx')

    m.reply('wett')

    try {
        const result = await ytsummarizer(text)
        if (!result || !result.content) throw new Error('eror saat ngambil ringkasan')
        m.reply(result.content)
    } catch (err) {
        m.reply(`Eror kak : ${err.message}`)
    }
}

handler.command = ['ytsummarizer']
handler.help = ['ytsummarizer <url>']
handler.tags = ['tools']

export default handler