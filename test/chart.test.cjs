const puppeteer = require('puppeteer-core')

;(async () => {
  const b = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-first-run', '--disable-gpu'],
  })
  const pg = await b.newPage()
  pg.setDefaultTimeout(15000)
  await pg.goto('http://localhost:5173/trade', { waitUntil: 'networkidle0' })
  await pg.waitForSelector('.chart-canvas canvas')
  await new Promise((r) => setTimeout(r, 2500))

  const sample = async () =>
    pg.evaluate(() => {
      const cv = document.querySelector('.chart-canvas canvas')
      if (!cv) return null
      const ctx = cv.getContext('2d')
      const d = ctx.getImageData(0, 0, cv.width, cv.height).data
      let green = 0
      let red = 0
      let light = 0
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i]
        const g = d[i + 1]
        const bl = d[i + 2]
        if (g > 120 && r < 100 && bl < 130) green++
        if (r > 150 && g < 120 && bl < 120) red++
        if (r > 180 && g > 180 && bl > 180) light++
      }
      return { w: cv.width, h: cv.height, green, red, light }
    })

  const s1 = await sample()
  await new Promise((r) => setTimeout(r, 2000))
  const s2 = await sample()

  const fmt = (s) => `${s.w}x${s.h} green=${s.green} red=${s.red} axis/labels=${s.light}`
  console.log('sample1:', fmt(s1))
  console.log('sample2:', fmt(s2))
  const hasCandles = s1 && s2 && (s1.green + s1.red > 200)
  const isLive = s1 && s2 && (s1.green !== s2.green || s1.red !== s2.red)
  console.log('candles drawn:', hasCandles)
  console.log('candles updating live:', isLive)
  await b.close()
})().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
