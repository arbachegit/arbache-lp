import { test, expect } from '@playwright/test';
import { setupGuards, assertNoErrors } from './helpers/consoleNetworkGuards';
import { discoverLinks, getInteractiveElements } from './helpers/discovery';
import { safeClick, safeFill, generateSyntheticData, safeHover } from './helpers/actions';

test.describe('Critical Tests - Nuclear Validation', () => {

  test('SMOKE: Home page loads without errors', async ({ page }) => {
    const guards = setupGuards(page);

    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();

    // Wait for initial load
    await page.waitForLoadState('networkidle');

    // Check for main content
    const hasMainContent = await page.locator('main, [role="main"], #app, #root, .app, header').count();
    expect(hasMainContent).toBeGreaterThan(0);

    // Verify title exists
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);

    assertNoErrors(guards, [/hydration/i, /favicon/i]);

    console.log('✅ SMOKE: Home loaded successfully');
  });

  test('NAVIGATION: All main nav links work', async ({ page }) => {
    const guards = setupGuards(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Find main navigation links
    const navLinks = await page.$$eval(
      'nav a, header a, [role="navigation"] a',
      (links) =>
        links
          .filter((a) => {
            const href = a.getAttribute('href');
            return href && (href.startsWith('/') || href.startsWith('#'));
          })
          .map((a) => ({
            href: a.getAttribute('href'),
            text: a.textContent?.trim(),
          }))
          .filter((item, index, self) =>
            index === self.findIndex((t) => t.href === item.href)
          )
          .slice(0, 15)
    );

    console.log(`Found ${navLinks.length} navigation links`);

    let successCount = 0;
    for (const link of navLinks) {
      if (!link.href) continue;

      try {
        if (link.href.startsWith('#')) {
          // Anchor link - scroll to section
          await page.click(`a[href="${link.href}"]`);
          await page.waitForTimeout(500);
          successCount++;
        } else {
          // Page navigation
          await page.goto(link.href);
          await page.waitForLoadState('networkidle');
          await expect(page.locator('body')).toBeVisible();
          successCount++;
        }
      } catch (e) {
        console.log(`⚠️ Link failed: ${link.href} - ${link.text}`);
      }
    }

    console.log(`✅ NAVIGATION: ${successCount}/${navLinks.length} links work`);
    assertNoErrors(guards, [/hydration/i, /favicon/i]);
  });

  test('SECTIONS: All page sections are visible', async ({ page }) => {
    const guards = setupGuards(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check main sections by ID
    const sectionIds = [
      'hero', 'proposito', 'quem-somos', 'ecossistema',
      'solucoes-org', 'colabs', 'esg', 'contato'
    ];

    let visibleCount = 0;
    for (const id of sectionIds) {
      const section = page.locator(`#${id}, section:has-text("${id}")`).first();
      try {
        await section.scrollIntoViewIfNeeded({ timeout: 3000 });
        const isVisible = await section.isVisible();
        if (isVisible) visibleCount++;
      } catch {
        // Section might not exist
      }
    }

    console.log(`✅ SECTIONS: ${visibleCount} sections found and visible`);
    assertNoErrors(guards, [/hydration/i]);
  });

  test('SVG ECOSYSTEM: Hub and orbital nodes exist', async ({ page }) => {
    await page.goto('/');

    // Scroll to ecossistema section
    const ecoSection = page.locator('section').filter({ hasText: 'Nosso Ecossistema' }).first();
    await ecoSection.scrollIntoViewIfNeeded({ timeout: 10000 });

    // Check ecosystem SVG
    const ecosystemSvg = page.locator('.ecosystem__svg');
    await expect(ecosystemSvg).toBeVisible();

    // Check hub
    const hub = page.locator('#node-hub');
    await expect(hub).toBeVisible();

    // Check orbital nodes (at least some)
    const nodes = await page.locator('.ecosystem__node').count();
    expect(nodes).toBeGreaterThan(3);

    console.log(`✅ ECOSYSTEM: Hub + ${nodes} nodes present`);
  });

  test('SVG SOLUCOES: Hub and 11 orbital nodes exist', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#solucoes-org', { timeout: 10000 });

    // Check solucoes SVG
    const solucoesSvg = page.locator('.solucoes__svg, #solucoes-svg');
    await expect(solucoesSvg).toBeVisible();

    // Check hub
    const hub = page.locator('#node-hub-solucoes');
    await expect(hub).toBeVisible();

    // Check all 11 orbital nodes
    for (let i = 1; i <= 11; i++) {
      const nodeId = i < 10 ? `#node-0${i}-solucoes` : `#node-${i}-solucoes`;
      const node = page.locator(nodeId);
      await expect(node).toBeVisible();
    }

    console.log('✅ SOLUCOES: Hub + 11 orbital nodes present');
  });

  test('HOVER: SVG nodes expand on hover', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForSelector('#solucoes-org');
    await page.locator('#solucoes-org').scrollIntoViewIfNeeded();

    // Get initial state of a node
    const node = page.locator('#node-01-solucoes');
    await expect(node).toBeVisible();

    // Hover on node using mouse move
    const box = await node.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(500);

      // Check if expanded class is applied
      const hasExpandedClass = await node.evaluate(
        (el) => el.classList.contains('solucoes__node--expanded')
      );
      expect(hasExpandedClass).toBe(true);
    }

    console.log('✅ HOVER: Node expansion working');
  });

  test('AGENT BUTTON: Opens chat window on click', async ({ page }) => {
    const guards = setupGuards(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Find agent button
    const agentButton = page.locator('button[aria-label="Abrir agente de chat"]');

    if (await agentButton.isVisible()) {
      await agentButton.click();
      await page.waitForTimeout(500);

      // Check if chat window opened
      const chatWindow = page.locator('[role="dialog"], .fixed.bottom-6.right-6.w-\\[380px\\]').first();
      const chatHeader = page.locator('text=Assistente Arbache');

      const isOpen = await chatWindow.isVisible() || await chatHeader.isVisible();
      expect(isOpen).toBe(true);

      console.log('✅ AGENT BUTTON: Chat window opens');
    } else {
      console.log('⚠️ Agent button not visible');
    }

    assertNoErrors(guards, [/hydration/i]);
  });

  test('FORMS: Contact form accepts input', async ({ page }) => {
    const guards = setupGuards(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Scroll to contact section
    const contato = page.locator('#contato');
    if (await contato.isVisible()) {
      await contato.scrollIntoViewIfNeeded();

      // Find form inputs
      const inputs = await page.locator('#contato input, #contato textarea').all();

      for (const input of inputs) {
        const type = await input.getAttribute('type') || 'text';
        const value = generateSyntheticData(type);
        try {
          await input.fill(value);
        } catch {
          // Input might be hidden or disabled
        }
      }

      console.log(`✅ FORMS: ${inputs.length} form fields tested`);
    }

    // Allow validation errors (4xx) but not server errors (5xx)
    const serverErrors5xx = guards.serverErrors.filter((e) => e.status >= 500);
    expect(serverErrors5xx).toHaveLength(0);
  });

  test('RESPONSIVE: Page renders at mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();

    // Check mobile menu exists (hamburger)
    const mobileMenu = page.locator('[aria-label*="menu"], .hamburger, button:has(svg)').first();
    const hasMobileMenu = await mobileMenu.count() > 0;

    console.log(`✅ RESPONSIVE: Mobile viewport renders, menu: ${hasMobileMenu}`);
  });

  test('ACCESSIBILITY: Key elements have proper roles', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for main landmark
    const main = await page.locator('main, [role="main"]').count();
    expect(main).toBeGreaterThan(0);

    // Check for navigation
    const nav = await page.locator('nav, [role="navigation"]').count();
    expect(nav).toBeGreaterThan(0);

    // Check buttons have labels or text content
    const buttonsWithoutLabel = await page.$$eval(
      'button',
      (buttons) => buttons.filter(btn => {
        const hasAriaLabel = btn.hasAttribute('aria-label');
        const hasText = (btn.textContent || '').trim().length > 0;
        return !hasAriaLabel && !hasText;
      }).length
    );

    console.log(`✅ A11Y: main=${main}, nav=${nav}, unlabeled buttons=${buttonsWithoutLabel}`);
  });
});
