/*
* Scrape Capcut Downloader
* Base : https://anydownloader.com
* Sumber : https://whatsapp.com/channel/0029Vb6chx1LI8YVtJJJ9a0Y
* Author : ZenzzXD
*/

const url = 'https://www.capcut.com/tv2/ZSUBuEUPV/'
const body = new URLSearchParams({
  url,
  token: '153d8f770cb72578abab74c2e257fb85a1fd60dcb0330e32706763c90448ae01',
  hash: 'aHR0cHM6Ly93d3cuY2FwY3V0LmNvbS90djIvWlNVQnVFVVBWLw==1037YXBp'
})

const cangcut = async () => {
  try {
    const r = await fetch('https://anydownloader.com/wp-json/api/download/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://anydownloader.com',
        'Referer': 'https://anydownloader.com/en/online-capcut-video-downloader-without-watermark/',
        'User-Agent': 'Mozilla/5.0'
      },
      body
    })
    console.log(await r.json())
  } catch (e) {
    console.log({ status: false, message: e.message })
  }
}

cangcut()

/*
{
  "url": "https://www.capcut.com/tv2/ZSUBuEUPV/",
  "title": "#storyislami",
  "thumbnail": "https://p16-capcut-sign-sg.ibyteimg.com/tos-alisg-v-643f9f/oMkCyDifQCQmFdAupBVE0ysA0IEtgAFnoQCO8f~tplv-4d650qgzx3-image.image?lk3s=2d54f6b1&x-expires=1791694276&x-signature=Dr1UAW%2BaN6jH23XmMfk0AHWyoxo%3D",
  "duration": null,
  "source": "capcut",
  "medias": [
    {
      "url": "https://v16-vod.capcutvod.com/7ce1f8c8b5839bb2da90ca91295681a6/68edd6d1/video/tos/alisg/tos-alisg-v-643f9f/oQE6g5xivKrZoIAC1UArEsBdrKAKYAVFwAiIa/?a=3006&bti=cHJ3bzFmc3dmZEBvY15taF4rcm1gYA%3D%3D&ch=0&cr=0&dr=0&lr=all&cd=0%7C0%7C0%7C0&cv=1&br=5056&bt=2528&cs=0&ds=3&ft=4furFM3a8Zmo0..OeI4jV7uMZJFrKsd.&mime_type=video_mp4&qs=13&rc=amY8OHQ5cjg1NTMzOGVkNEBpamY8OHQ5cjg1NTMzOGVkNEBwbzYyMmRrajFhLS1kYi1zYSNwbzYyMmRrajFhLS1kYi1zcw%3D%3D&vvpl=1&l=20251011125116BA2CD3DB41A0C60D97D5&btag=e00070000",
      "quality": "HD No Watermark",
      "extension": "mp4",
      "size": 4246302,
      "formattedSize": "4.05 MB",
      "videoAvailable": true,
      "audioAvailable": true,
      "chunked": false,
      "cached": false,
      "requiresRendering": false,
      "preview_path": ""
    },
    {
      "url": "https://v16-vod.capcutvod.com/66e24e9e5190891d7211f3f30d0d1741/68edd6d1/video/tos/alisg/tos-alisg-ve-8fe9aq-sg/oEDUQmfsgUZCoFEuxd0BCWQyEiIBVQqgt7kzJe/?a=3006&bti=cHJ3bzFmc3dmZEBvY15taF4rcm1gYA%3D%3D&ch=0&cr=0&dr=0&lr=all&cd=0%7C0%7C0%7C0&cv=1&br=3010&bt=1505&cs=0&ds=3&ft=4furFM3a8Zmo0..OeI4jV7uMZJFrKsd.&mime_type=video_mp4&qs=0&rc=N2k4PGRpNjo4OGdoZGdnM0BpamY8OHQ5cjg1NTMzOGVkNEBiLi4tNTQtNmIxXi4tYy8yYSNwbzYyMmRrajFhLS1kYi1zcw%3D%3D&vvpl=1&l=20251011125116BA2CD3DB41A0C60D97D5&btag=e000b0000",
      "quality": "No Watermark",
      "extension": "mp4",
      "size": 2519308,
      "formattedSize": "2.4 MB",
      "videoAvailable": true,
      "audioAvailable": true,
      "chunked": false,
      "cached": false,
      "requiresRendering": false,
      "preview_path": ""
    },
    {
      "url": "https://v16-vod.capcutvod.com/dcdd19f65fd35ba42c699cbfc37a536e/68edd6d1/video/tos/alisg/tos-alisg-ve-8fe9aq-sg/oc0UxQsECWQZiEmoCUgItVqFQfsfn5uQBDyBg7/?a=3006&bti=cHJ3bzFmc3dmZEBvY15taF4rcm1gYA%3D%3D&ch=0&cr=0&dr=0&lr=all&cd=0%7C0%7C0%7C0&cv=1&br=2992&bt=1496&cs=0&ds=3&ft=4furFM3a8Zmo0..OeI4jV7uMZJFrKsd.&mime_type=video_mp4&qs=0&rc=aWk5NmloOmloNDZlZzRmZ0BpamY8OHQ5cjg1NTMzOGVkNEBhMTRjLzQvXy8xLmM1YDReYSNwbzYyMmRrajFhLS1kYi1zcw%3D%3D&vvpl=1&l=20251011125116BA2CD3DB41A0C60D97D5&btag=e000b0000",
      "quality": "Watermark",
      "extension": "mp4",
      "size": 2504264,
      "formattedSize": "2.39 MB",
      "videoAvailable": true,
      "audioAvailable": true,
      "chunked": false,
      "cached": false,
      "requiresRendering": false,
      "preview_path": ""
    }
  ],
  "sid": "262ca6206259d09abfcdb928e2b517a2b29f629f"
}
*/