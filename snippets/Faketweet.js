/*
* Nama fitur : Fake Tweet
* Type : Plugin Esm
* Sumber : https://whatsapp.com/channel/0029Vb6chx1LI8YVtJJJ9a0Y
* Author : ZenzzXD
*/

let handler = async (m, { command, args }) => {
  try {
    const mime = m.quoted?.mimetype || ''
    if (!/image/.test(mime)) {
      return m.reply('reply gambar dengan command .faketweet name|username|isi tweet|theme|retweets|quote|likes')
    }
    const text = args.join(' ')
    if (!text.includes('|')) {
      return m.reply('gunakan : name|username|isi tweet|theme|retweets|quote|likes')
    }
    const [name, username, tweet, theme, retweets, quotes, likes] = text.split('|')
    const validThemes = ['light', 'dim', 'dark']
    if (!validThemes.includes(theme)) {
      return m.reply('List theme nyah :\n> light\n> dim\n> dark')
    }
    m.reply('wett')
    const buffer = await m.quoted.download()
    const blob = new Blob([buffer], { type: mime })

    const form = new FormData()
    form.append('profile', blob, 'profile.jpg')
    form.append('name', name)
    form.append('username', username)
    form.append('tweet', tweet)
    form.append('theme', theme)
    form.append('font', 'system')
    form.append('emoji', 'twemoji')
    form.append('agent', 'iphone')
    form.append('retweets', retweets || '0')
    form.append('quotes', quotes || '0')
    form.append('likes', likes || '0')

    const res = await fetch('https://fathurweb.qzz.io/api/tools/faketweet', {
      method: 'POST',
      body: form
    })

    if (!res.ok) throw new Error(await res.text())
    const hasil = Buffer.from(await res.arrayBuffer())

    await m.reply(hasil)
  } catch (e) {
    m.reply(`Eror kak : ${e.message}`)
  }
}

handler.command = ['faketweet']
handler.help = ['faketweet']
handler.tags = ['maker']

export default handler