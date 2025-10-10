/*
Base : https://bg1-remover.netlify.app/
By : Jenn Eksdii
Jangan hujat bg masih belajar, kalau ada salah mohon koreksi 🙏
*/
import fs from 'fs'
import fetch from 'node-fetch'
import FormData from 'form-data'

const X_Api_Key = 'Am8wWXzVWc8pRHpfHw1obfg5'
const input = './thumb-5.jpg'
const output = './jenn.png'

const removebegron = async () => {
  if (!fs.existsSync(input)) return

  try {
    const form = new FormData()
    form.append('image_file', fs.createReadStream(input))
    form.append('size', 'auto')

    const res = await fetch('https://api.remove.bg/v1.0/removebg', { method: 'POST', headers: { 'X-Api-Key': X_Api_Key }, body: form })
    if (!res.ok) return

    fs.writeFileSync(output, Buffer.from(await res.arrayBuffer()))
  } catch {}
}

removebegron()