const puppeteer = require('puppeteer-core')

;(async () => {
  const b = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-first-run', '--disable-gpu'],
  })
  const pg = await b.newPage()
  pg.setDefaultTimeout(15000)
  const errs = []
  pg.on('pageerror', (e) => errs.push(String(e)))
  pg.on('console', (m) => {
    if (m.type() === 'error') errs.push(m.text())
  })
  await pg.goto('http://localhost:5173/trade', { waitUntil: 'networkidle0' })
  await pg.waitForSelector('.trade-root')
  await pg.waitForSelector('.chart-canvas canvas')
  const hasPanel = await pg.$('.trade-panel')
  await new Promise((r) => setTimeout(r, 1500))
  console.log('trade root:', !!(await pg.$('.trade-root')))
  console.log('chart canvas:', !!(await pg.$('.chart-canvas canvas')))
  console.log('panel:', !!hasPanel)
  console.log('live price:', !!(await pg.$('.live-price')))
  console.log('errors:', errs.length ? errs.join('|').slice(0, 200) : 'none')
  await b.close()
})().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
