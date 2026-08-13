const puppeteer = require('puppeteer-core')
;(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: 'new', args: ['--no-first-run', '--disable-gpu'] })
  const pg = await b.newPage()
  pg.setDefaultTimeout(15000)
  const errs = []
  pg.on('pageerror', e => errs.push(String(e)))
  await pg.goto('http://localhost:5173/trade', { waitUntil: 'networkidle0' })
  await pg.waitForSelector('.trade-panel')
  await pg.evaluate(() => {
    const up = [...document.querySelectorAll('button')].find(x => x.textContent.trim().startsWith('Up'))
    up.click()
  })
  await new Promise(r => setTimeout(r, 800))
  const lines = await pg.evaluate(() => {
    const els = [...document.querySelectorAll('div')].filter(d => /Beginning of trade|End of trade/.test(d.textContent))
    return els.map(e => ({ text: e.textContent.trim(), display: getComputedStyle(e).display }))
  })
  console.log('trade line labels:', JSON.stringify(lines))
  const chips = await pg.evaluate(() =>
    [...document.querySelectorAll('div')].filter(d => d.textContent.includes('left')).map(c => c.textContent.trim()).slice(0, 3)
  )
  console.log('countdown chips:', JSON.stringify(chips))
  await new Promise(r => setTimeout(r, 66000))
  const after = await pg.evaluate(() => {
    const el = [...document.querySelectorAll('button')].find(x => x.textContent.includes('LIVE ACCOUNT'))
    return el.textContent.trim()
  })
  console.log('balance after expiry:', after)
  console.log('errors:', errs.length ? errs.join('|').slice(0, 200) : 'none')
  await b.close()
})().catch(e => { console.error(e.message); process.exit(1) })
