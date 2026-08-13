const puppeteer = require('puppeteer-core')
;(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: 'new', args: ['--no-first-run', '--disable-gpu'] })
  const pg = await b.newPage()
  pg.setDefaultTimeout(15000)
  const errs = []
  pg.on('pageerror', e => errs.push(String(e)))
  await pg.goto('http://localhost:5173/trade', { waitUntil: 'networkidle0' })
  await pg.waitForSelector('.trade-panel')

  // 1. open account menu
  const opened = await pg.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(x => x.textContent.includes('LIVE ACCOUNT'))
    if (!btn) return false
    btn.click()
    return true
  })
  await new Promise(r => setTimeout(r, 400))
  const popover = await pg.evaluate(() => {
    const all = [...document.querySelectorAll('div')].filter(d => d.textContent.includes('STANDARD') && d.textContent.includes('Currency:') && d.textContent.includes('[CHANGE]'))
    return all.length ? { present: true, sample: all[0].textContent.replace(/\s+/g, ' ').trim().slice(0, 220) } : { present: false, sample: '' }
  })
  console.log('menu opened:', opened)
  console.log('popover:', popover.present)
  console.log('popover text:', popover.sample)

  // 2. verify quick links + logout present
  const links = await pg.evaluate(() => {
    const btns = [...document.querySelectorAll('button')].map(x => x.textContent.trim())
    return {
      hasDeposit: btns.some(t => t === 'Deposit'),
      hasWithdrawal: btns.some(t => t === 'Withdrawal'),
      hasPayments: btns.some(t => t === 'Payments'),
      hasTrades: btns.some(t => t === 'Trades'),
      hasMyAccount: btns.some(t => t === 'My account'),
      hasLogout: btns.some(t => t === 'Logout'),
    }
  })
  console.log('quick links:', JSON.stringify(links))

  // 3. switch to demo
  await pg.evaluate(() => {
    const rows = [...document.querySelectorAll('button')].filter(x => x.textContent.includes('Demo Account'))
    if (rows[0]) rows[0].click()
  })
  await new Promise(r => setTimeout(r, 400))
  const demoHeader = await pg.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(x => x.textContent.includes('ACCOUNT'))
    return btn ? btn.textContent.replace(/\s+/g, ' ').trim() : '?'
  })
  console.log('header after demo switch:', demoHeader)

  // 4. logout navigates home
  await pg.evaluate(() => {
    const b2 = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === 'Logout')
    if (b2) b2.click()
  })
  await new Promise(r => setTimeout(r, 600))
  const url = pg.url()
  console.log('url after logout:', url)
  console.log('errors:', errs.length ? errs.join('|').slice(0, 200) : 'none')
  await b.close()
})().catch(e => { console.error(e.message); process.exit(1) })
