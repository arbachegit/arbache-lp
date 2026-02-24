import { test, expect } from '@playwright/test'

/**
 * Test 1: Callout text changes per section
 *
 * Scrolls through every section on the page and verifies the callout
 * (call-to-action) text updates to match the section-specific phrase.
 */

const EXPECTED_CALLOUTS: Record<string, string> = {
  hero: 'Tem dúvidas?',
  proposito: 'Nosso Propósito',
  'quem-somos': 'Quem Somos',
  'nosso-ecossistema': 'Nosso Ecossistema',
  'solucoes-org': 'Nossas Soluções',
  colabs: 'Nossos Parceiros',
  esg: 'Nosso ESG',
  contato: 'Dúvidas?',
}

test.describe('Agent Callout — text changes per section', () => {
  test('callout updates its first line when scrolling through each section', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // The callout text container
    const calloutText = page.locator('.agent-callout-text')

    // Give the initial render a moment
    await page.waitForTimeout(800)

    const sectionIds = Object.keys(EXPECTED_CALLOUTS)
    const results: { section: string; expected: string; actual: string; pass: boolean }[] = []

    for (const sectionId of sectionIds) {
      // Scroll the section into the center of the viewport via JS
      const scrolled = await page.evaluate((id) => {
        const el = document.getElementById(id)
        if (!el) return false
        el.scrollIntoView({ block: 'center', behavior: 'instant' })
        return true
      }, sectionId)

      if (!scrolled) {
        results.push({ section: sectionId, expected: EXPECTED_CALLOUTS[sectionId], actual: '[SECTION NOT FOUND]', pass: false })
        continue
      }

      // Give scroll handler + animation time to fire
      await page.waitForTimeout(1500)

      // Read the callout text (all visible spans)
      const text = await calloutText.textContent().catch(() => '')

      const expected = EXPECTED_CALLOUTS[sectionId]
      const pass = (text ?? '').includes(expected)
      results.push({ section: sectionId, expected, actual: text || '[EMPTY]', pass })
    }

    // Report
    console.log('\n=== CALLOUT TEXT PER SECTION ===')
    for (const r of results) {
      console.log(`${r.pass ? '✓' : '✗'} #${r.section}: expected "${r.expected}" — got "${r.actual}"`)
    }

    // Assert all passed
    const failures = results.filter(r => !r.pass)
    expect(failures, `Callout text did not match for: ${failures.map(f => f.section).join(', ')}`).toHaveLength(0)
  })

  test('callout shows "ou entre em contato" link', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Scroll past hero to trigger a callout
    await page.evaluate(() => {
      const el = document.getElementById('proposito')
      if (el) el.scrollIntoView({ block: 'center', behavior: 'instant' })
    })
    await page.waitForTimeout(1500)

    const contatoLink = page.locator('.agent-callout-text a[href="#contato"]')
    await expect(contatoLink).toBeAttached()
    const text = await contatoLink.textContent()
    expect(text?.toLowerCase()).toContain('entre em contato')
  })
})

/**
 * Test 2: Section parameter passed to agent API
 *
 * Scrolls to a specific section, opens the chat, sends a message,
 * and verifies the fetch request includes `section` and `sectionContext`.
 * Uses page.route() to mock the API so no backend is needed.
 */
test.describe('Agent Chat — section context passed to API', () => {
  test('request body includes section and sectionContext when sending from ESG section', async ({ page }) => {
    // Capture the request body via route interception
    let capturedBody: Record<string, unknown> | null = null

    await page.route('**/api/chat', async (route) => {
      const request = route.request()
      capturedBody = JSON.parse(request.postData() ?? '{}')

      // Mock a successful response
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ response: 'Resposta mock', request_id: 'test-123' }),
      })
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Scroll to ESG section so currentSection is set
    await page.evaluate(() => {
      const el = document.getElementById('esg')
      if (el) el.scrollIntoView({ block: 'center', behavior: 'instant' })
    })
    await page.waitForTimeout(1500)

    // Open the chat
    const agentButton = page.locator('button[aria-label="Abrir agente de chat"]')
    await agentButton.click()

    // Wait for chat window
    await expect(page.locator('text=Assistente Arbache')).toBeVisible({ timeout: 5000 })

    // Type and send a message
    const input = page.locator('input[placeholder="Digite sua mensagem..."]')
    await input.fill('O que é ESG?')

    const sendButton = page.locator('button[aria-label="Enviar mensagem"]')
    await sendButton.click()

    // Wait for the mock response to be processed
    await page.waitForTimeout(1000)

    console.log('\n=== CHAT API REQUEST BODY (ESG) ===')
    console.log(JSON.stringify(capturedBody, null, 2))

    // Assert section fields
    expect(capturedBody).not.toBeNull()
    expect(capturedBody).toHaveProperty('message', 'O que é ESG?')
    expect(capturedBody).toHaveProperty('section', 'esg')
    expect(capturedBody).toHaveProperty('sectionContext', 'Sustentabilidade')
  })

  test('request body includes correct section for multiple sections', async ({ page }) => {
    const testCases = [
      { sectionId: 'proposito', expectedSection: 'proposito', expectedContext: 'Missão, visão e valores' },
      { sectionId: 'colabs', expectedSection: 'colabs', expectedContext: 'Co-Labs parceiros' },
      { sectionId: 'contato', expectedSection: 'contato', expectedContext: 'Contato' },
    ]

    for (const tc of testCases) {
      let capturedBody: Record<string, unknown> | null = null

      // Fresh navigation for each test case
      await page.route('**/api/chat', async (route) => {
        capturedBody = JSON.parse(route.request().postData() ?? '{}')
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ response: 'Mock', request_id: 'test' }),
        })
      })

      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Scroll to target section
      await page.evaluate((id) => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ block: 'center', behavior: 'instant' })
      }, tc.sectionId)
      await page.waitForTimeout(1500)

      // Open chat, send message
      const agentButton = page.locator('button[aria-label="Abrir agente de chat"]')
      await agentButton.click()
      await expect(page.locator('text=Assistente Arbache')).toBeVisible({ timeout: 5000 })

      const input = page.locator('input[placeholder="Digite sua mensagem..."]')
      await input.fill('Teste')
      await page.locator('button[aria-label="Enviar mensagem"]').click()

      await page.waitForTimeout(1000)

      console.log(`\n=== ${tc.sectionId.toUpperCase()} ===`)
      console.log(JSON.stringify(capturedBody, null, 2))

      expect(capturedBody, `section ${tc.sectionId}: body was null`).not.toBeNull()
      expect(capturedBody).toHaveProperty('section', tc.expectedSection)
      expect(capturedBody).toHaveProperty('sectionContext', tc.expectedContext)
    }
  })
})
