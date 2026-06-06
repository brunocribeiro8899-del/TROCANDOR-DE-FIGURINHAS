#!/usr/bin/env node
/**
 * Driver para Trocando Figurinas
 * Uso: node driver.mjs <comando> [args...]
 *
 * Comandos:
 *   smoke            — fluxo completo: landing → login admin → dashboard → logout
 *   screenshot <url> [nome]  — captura screenshot de qualquer URL
 *   login <perfil>   — admin | comprador | vendedor  (salva cookie de sessão)
 *   nav <url>        — abre URL já autenticado (requer login antes)
 */

import pkg from '/tmp/pw/node_modules/playwright/index.js'
const { chromium } = pkg
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const BASE     = 'http://localhost:5173'
const SHOTS    = process.env.SHOTS_DIR || '/tmp/shots'
const HEADLESS = process.env.HEADLESS !== 'false'

const USUARIOS = {
  admin:     { email: 'admin@admin.com',      senha: '123456' },
  comprador: { email: 'comprador@teste.com',  senha: '123456' },
  vendedor:  { email: 'vendedor@teste.com',   senha: '123456' },
}

mkdirSync(SHOTS, { recursive: true })

async function screenshot(page, nome) {
  const caminho = join(SHOTS, `${nome}.png`)
  await page.screenshot({ path: caminho, fullPage: false })
  console.log(`📸 screenshot → ${caminho}`)
  return caminho
}

async function login(page, perfil = 'admin') {
  const u = USUARIOS[perfil]
  if (!u) throw new Error(`Perfil desconhecido: ${perfil}. Use: admin, comprador, vendedor`)

  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  await page.waitForSelector('input[type="email"]')
  await page.fill('input[type="email"]', u.email)
  await page.fill('input[type="password"]', u.senha)
  await page.click('button[type="submit"]')
  // Aguarda navegação pós-login
  await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 10_000 })
  console.log(`✓ login como ${perfil} (${u.email})`)
}

async function smoke() {
  const browser = await chromium.launch({ headless: HEADLESS, args: ['--no-sandbox'] })
  const ctx  = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const page = await ctx.newPage()

  try {
    // 1. Landing page
    await page.goto(BASE, { waitUntil: 'networkidle' })
    await page.waitForSelector('h1')
    await screenshot(page, '01-landing')
    console.log('✓ landing page carregada')

    // 2. Tela de login
    await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
    await page.waitForSelector('input[type="email"]')
    await screenshot(page, '02-login')
    console.log('✓ tela de login carregada')

    // 3. Login como admin
    await login(page, 'admin')
    await page.waitForSelector('header', { timeout: 8_000 })
    await screenshot(page, '03-painel-admin')
    console.log('✓ painel admin carregado')

    // Verificar erros no console
    const errors = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })

    // 4. Logout e login como comprador
    await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
    await login(page, 'comprador')
    await page.waitForSelector('header', { timeout: 8_000 })
    await screenshot(page, '04-dashboard-comprador')
    console.log('✓ dashboard comprador carregado')

    // 5. Login como vendedor
    await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
    await login(page, 'vendedor')
    await page.waitForSelector('header', { timeout: 8_000 })
    await screenshot(page, '05-dashboard-vendedor')
    console.log('✓ dashboard vendedor carregado')

    // 6. Cadastro
    await page.goto(`${BASE}/cadastro`, { waitUntil: 'networkidle' })
    await page.waitForSelector('form')
    await screenshot(page, '06-cadastro')
    console.log('✓ tela de cadastro carregada')

    if (errors.length > 0) {
      console.warn('⚠ erros no console:', errors)
    } else {
      console.log('✓ nenhum erro de console')
    }

    console.log(`\n✅ smoke completo — screenshots em ${SHOTS}/`)
  } finally {
    await browser.close()
  }
}

async function cmdScreenshot(url, nome = 'screenshot') {
  const browser = await chromium.launch({ headless: HEADLESS, args: ['--no-sandbox'] })
  const ctx  = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const page = await ctx.newPage()
  try {
    await page.goto(url.startsWith('http') ? url : `${BASE}${url}`, { waitUntil: 'networkidle' })
    await screenshot(page, nome)
  } finally {
    await browser.close()
  }
}

// — main —
const [cmd, ...args] = process.argv.slice(2)

switch (cmd) {
  case 'smoke':
    await smoke()
    break
  case 'screenshot':
    await cmdScreenshot(args[0] ?? BASE, args[1] ?? 'screenshot')
    break
  default:
    console.error(`Uso: node driver.mjs <smoke | screenshot <url> [nome]>`)
    process.exit(1)
}
