/*
* Nama fitur : To figure
* Type : Plugin Esm
* Sumber : https://whatsapp.com/channel/0029Vb6chx1LI8YVtJJJ9a0Y
* Author : ZenzzXD
*/

import { GoogleGenAI } from '@google/genai'

const APIKEY = 'apikey lu'
const PROMPT = 'Using the nano-banana model, a commercial 1/7 scale figurine of the character in the picture was created, depicting a realistic style and a realistic environment. The figurine is placed on a computer desk with a round transparent acrylic base. There is no text on the base. The computer screen shows the Zbrush modeling process of the figurine. Next to the computer screen is a BANDAI-style toy box with the original painting printed on it.'

const handler = async (m, { conn, args }) => {
  try {
    const mime = m.quoted?.mimetype || ''
    if (!/image/.test(mime)) {
      return m.reply('reply gambar dengan command : .tofigure')
    }

    m.reply('wett')

    const imageBuffer = await m.quoted.download()
    if (!imageBuffer) return m.reply('eror pas mengunduh gambar')

    const ai = new GoogleGenAI({ apiKey: APIKEY })
    const base64Image = imageBuffer.toString('base64')

    const contents = [
      { text: PROMPT },
      {
        inlineData: {
          mimeType: mime,
          data: base64Image
        }
      }
    ]

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents
    })

    const parts = response?.candidates?.[0]?.content?.parts || []

    for (const part of parts) {
      if (part.inlineData?.data) {
        const buffer = Buffer.from(part.inlineData.data, 'base64')
        await conn.sendFile(m.chat, buffer, 'zen.png', '', m)
      }
    }
  } catch (e) {
    m.reply(`Eror kak : ${e.message}`)
  }
}

handler.help = ['tofigure']
handler.tags = ['ai']
handler.command = ['tofigure']

export default handler