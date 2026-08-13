const puppeteer = require('puppeteer-core')

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const BASE = 'http://localhost:5173'
const results = []
const ok = (name, pass, extra = '') => {
  results.push(`${pass ? 'PASS' : 'FAIL'}  ${name}${extra ? '  -> ' + extra : ''}`)
}

;(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: 'new',
    args: ['--no-first-run', '--disable-gpu'],
  })
  const page = await browser.newPage()
  page.setDefaultTimeout(15000)

  const active = '.modal-sign__form.active'
  const clickActive = (sel) => page.evaluate((s) => document.querySelector(s).click(), `${active} ${sel}`)

  // 1. Sign-in page renders
  await page.goto(BASE + '/', { waitUntil: 'networkidle0' })
  const titleVisible = await page.$eval('.sign__title', (el) => el.textContent).catch(() => '')
  ok('sign-in title renders', titleVisible.includes('Sign In'))

  // 2. Empty submit shows validation errors
  await clickActive('.modal-sign__block-button')
  await page.waitForSelector(`${active} .modal-sign__input.error`)
  const errCount = await page.$$eval(`${active} .modal-sign__input-error__text`, (els) => els.length)
  ok('validation errors shown on empty submit', errCount >= 2, `${errCount} errors`)

  // 3. Fill and submit login -> navigates to /trade
  await page.type(`${active} input[name="email"]`, 'test@example.com')
  await page.type(`${active} input[name="password"]`, 'secret123')
  await clickActive('.modal-sign__block-button')
  await page.waitForSelector('.trade-root', { timeout: 10000 })
  ok('login submits and lands on trade page', page.url().includes('/trade'), page.url())

  // 4. ?signup=1 opens Registration tab
  await page.goto(BASE + '/?signup=1', { waitUntil: 'networkidle0' })
  const regTabActive = await page.$eval('.modal-sign__tab.active', (el) => el.textContent)
  ok('?signup=1 opens Registration tab', regTabActive.trim() === 'Registration', regTabActive.trim())

  // 5. Registration: empty submit errors
  await clickActive('.modal-sign__block-button')
  await page.waitForSelector(`${active} .modal-sign__input.error`)
  const regErrCount = await page.$$eval(`${active} .modal-sign__input-error__text`, (els) => els.length)
  ok('registration validates required fields', regErrCount >= 4, `${regErrCount} errors`)

  // 6. Fill registration, check boxes, submit -> /trade
  await page.click(`${active} .select__trigger`)
  await page.waitForSelector(`${active} .select__option`)
  await page.evaluate((s) => document.querySelectorAll(`${s} .select__option`)[0].click(), active)
  await page.type(`${active} input[name="email"]`, 'reg@example.com')
  await page.type(`${active} input[name="password"]`, 'secret123')
  await page.evaluate((s) => {
    document.querySelector(`${s} input[name="rules"]`).click()
    document.querySelector(`${s} input[name="not-us-citizen"]`).click()
  }, active)
  await clickActive('.modal-sign__block-button')
  await page.waitForSelector('.trade-root', { timeout: 10000 })
  ok('registration submits and lands on trade page', page.url().includes('/trade'), page.url())

  // 7. Header Sign up button opens registration tab
  await page.goto(BASE + '/', { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.querySelector('#button-sign-up').click())
  await new Promise((r) => setTimeout(r, 400))
  const afterSignup = await page.$eval('.modal-sign__tab.active', (el) => el.textContent)
  ok('header Sign up -> Registration tab', afterSignup.trim() === 'Registration', afterSignup.trim())

  // 8. Header Demo account -> trade page
  await page.goto(BASE + '/', { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.querySelector('.header__list--item a').click())
  await page.waitForSelector('.trade-root', { timeout: 10000 })
  ok('header Demo account -> trade page', page.url().includes('/trade'), page.url())

  console.log(results.join('\n'))
  await browser.close()
})().catch((e) => {
  console.error('TEST ERROR:', e.message)
  console.log(results.join('\n'))
  process.exit(1)
})
