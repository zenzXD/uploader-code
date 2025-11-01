/*
* Nama fitur : Youtube Downloader
* Type : Plugin Esm
* Sumber : https://whatsapp.com/channel/0029Vb6chx1LI8YVtJJJ9a0Y
* Author : ZenzzXD
*/

const yt = {

    get url() {
        return {
            origin: 'https://ytmp3.cx'
        }
    },

    get baseHeaders() {
        return {
            'accept-encoding': 'gzip, deflate, br, zstd'
        }
    },

    extractVideoId: function (fV) {
        let v
        if (fV.indexOf('youtu.be') > -1) {
            v = /\/([a-zA-Z0-9\-\_]{11})/.exec(fV)
        } else if (fV.indexOf('youtube.com') > -1) {
            if (fV.indexOf('/shorts/') > -1) {
                v = /\/([a-zA-Z0-9\-\_]{11})/.exec(fV)
            } else {
                v = /v\=([a-zA-Z0-9\-\_]{11})/.exec(fV)
            }
        }
        const result = v?.[1]
        if (!result) throw Error(`gagal extract video id`)
        return result
    },

    getInitUrl: async function () {
        try {
            const r1 = await fetch(this.url.origin, { headers: this.baseHeaders })
            console.log('hit homepage')
            const html = await r1.text()
            const jsPath = html.match(/<script src="(.+?)"/)?.[1]
            const jsUrl = this.url.origin + jsPath
            const r2 = await fetch(jsUrl, { headers: this.baseHeaders })
            console.log('hit js')
            const js = await r2.text()

            const gB_m = js.match(/gB=(.+?),gD/)?.[1]
            const gB = eval(gB_m)

            const html_m = html.match(/<script>(.+?)<\/script>/)?.[1]
            const hiddenGc = eval(html_m + "gC")
            const gC = Object.fromEntries(Object.getOwnPropertyNames(hiddenGc).map(key => [key, hiddenGc[key]]))

            const decodeBin = (d) => d.split(' ').map(v => parseInt(v, 2))
            const decodeHex = (d) => d.match(/0x[a-fA-F0-9]{2}/g).map(v => String.fromCharCode(v)).join("")
            const getTimestamp = () => Math.floor((new Date).getTime() / 1e3)

            function authorization() {
                var dec = decodeBin(gC.d(1)[0])
                var k = ''
                for (var i = 0; i < dec.length; i++) k += (gC.d(2)[0] > 0) ? atob(gC.d(1)[1]).split('').reverse().join('')[(dec[i] - gC.d(2)[1])] : atob(gC.d(1)[1])[(dec[i] - gC.d(2)[1])]
                if (gC.d(2)[2] > 0) k = k.substring(0, gC.d(2)[2])
                switch (gC.d(2)[3]) {
                    case 0:
                        return btoa(k + '_' + decodeHex(gC.d(3)[0]))
                    case 1:
                        return btoa(k.toLowerCase() + '_' + decodeHex(gC.d(3)[0]))
                    case 2:
                        return btoa(k.toUpperCase() + '_' + decodeHex(gC.d(3)[0]))
                }
            }

            const api_m = js.matchAll(/};var \S{1}=(.+?);gR&&\(/g)
            const e = Array.from(api_m)?.[1]?.[1]
            const apiUrl = eval(`${e}`)
            return apiUrl
        } catch (e) {
            throw new Error('fungsi getApiUrl gagal')
        }
    },

    download: async function (url, f = 'mp3') {
        if (!/^mp3|mp4$/.test(f)) throw Error(`format valid mp3 or mp4`)
        const v = this.extractVideoId(url)
        const headers = {
            'referer': this.url.origin,
            ...this.baseHeaders
        }
        const initApi = await this.getInitUrl()
        const r1 = await fetch(initApi, { headers })
        console.log('hit init')
        const j1 = await r1.json()
        const { convertURL } = j1
        const convertApi = convertURL + '&v=' + v + '&f=' + f + '&_=' + Math.random()
        const r2 = await fetch(convertApi, { headers })
        console.log('hit convert url')
        const j2 = await r2.json()
        if (j2.error) throw Error(`ada error di value convert.\n${JSON.stringify(j2, null, 2)}`)
        if (j2.redirectURL) {
            const r3 = await fetch(j2.redirectURL, { headers })
            console.log('hit redirect')
            const j3 = await r3.json()
            const result = {
                title: j3.title,
                downloadURL: j3.downloadURL,
                format: f
            }
            return result
        } else {
            let j3b
            do {
                const r3b = await fetch(j2.progressURL, { headers })
                console.log('hit progress')
                j3b = await r3b.json()
                if (j3b.error) throw Error(`ada error pas cek progress.\n${JSON.stringify(j3b, null, 2)}`)
                if (j3b.progress == 3) {
                    const result = {
                        title: j3b.title,
                        downloadURL: j2.downloadURL,
                        format: f
                    }
                    return result
                }
                await new Promise(resolve => setTimeout(resolve, 3000))
            } while (j3b.error != 3)
        }
    }
}

let handler = async (m, { command, text, conn }) => {
    try {
        switch (command) {
            case 'ytmp3':
                if (!text) return m.reply('url nya mana')
                m.reply('wett')
                {
                    const result = await yt.download(text, 'mp3')
                    await conn.sendMessage(m.chat, { audio: { url: result.downloadURL }, mimetype: 'audio/mpeg', fileName: result.title + '.mp3' }, { quoted: m })
                }
                break
            case 'ytmp4':
                if (!text) return m.reply('url nya mana')
                m.reply('wett')
                {
                    const result = await yt.download(text, 'mp4')
                    await conn.sendMessage(m.chat, { video: { url: result.downloadURL }, mimetype: 'video/mp4', fileName: result.title + '.mp4' }, { quoted: m })
                }
                break
        }
    } catch (e) {
        m.reply(`Eror kak : ${e.message}`)
    }
}

handler.command = ['ytmp3', 'ytmp4']
handler.tags = ['downloader']
handler.help = ['ytmp3 <url>', 'ytmp4 <url>']

export default handler