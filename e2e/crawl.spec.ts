import { test, expect } from '@playwright/test';
import { setupGuards, GuardReport } from './helpers/consoleNetworkGuards';
import { discoverLinks, getInteractiveElements, getPageMetrics } from './helpers/discovery';
import { safeClick, safeFill, generateSyntheticData, safeHover } from './helpers/actions';

const MAX_PAGES = parseInt(process.env.E2E_MAX_PAGES || '30');
const MAX_ACTIONS = parseInt(process.env.E2E_MAX_ACTIONS_PER_PAGE || '20');

interface CoverageReport {
  pagesVisited: string[];
  actionsExecuted: number;
  elementsInteracted: number;
  hoversExecuted: number;
  formsFound: number;
  errors: { category: string; message: string; url: string }[];
}

test.describe('Crawler - Massive UI Testing', () => {

  test('crawl all discoverable pages and interactions', async ({ page }) => {
    // Disable animations for stability
    await page.emulateMedia({ reducedMotion: 'reduce' });

    const coverage: CoverageReport = {
      pagesVisited: [],
      actionsExecuted: 0,
      elementsInteracted: 0,
      hoversExecuted: 0,
      formsFound: 0,
      errors: [],
    };

    const visited = new Set<string>();
    const toVisit: string[] = ['/'];
    const baseURL = process.env.E2E_BASE_URL || 'http://localhost:3000';

    while (toVisit.length > 0 && coverage.pagesVisited.length < MAX_PAGES) {
      const currentPath = toVisit.shift()!;

      if (visited.has(currentPath)) continue;
      visited.add(currentPath);

      const guards = setupGuards(page);

      try {
        await page.goto(currentPath, { waitUntil: 'networkidle', timeout: 30000 });
        coverage.pagesVisited.push(currentPath);

        // Verify page loaded
        await expect(page.locator('body')).toBeVisible();

        const metrics = await getPageMetrics(page);
        if (metrics.bodyEmpty) {
          coverage.errors.push({
            category: 'NAVIGATION_BROKEN',
            message: 'Page body is empty',
            url: currentPath,
          });
          continue;
        }

        // Discover new links
        const links = await discoverLinks(page, baseURL);
        for (const link of links) {
          if (!visited.has(link) && !toVisit.includes(link)) {
            toVisit.push(link);
          }
        }

        // Check for forms
        const forms = await page.locator('form').count();
        coverage.formsFound += forms;

        // Get interactive elements
        const elements = await getInteractiveElements(page);
        let actionsOnPage = 0;

        // Process elements
        for (const el of elements.slice(0, MAX_ACTIONS)) {
          if (el.isDestructive) {
            console.log(`⚠️ Skipping destructive action: ${el.text}`);
            continue;
          }

          actionsOnPage++;
          coverage.elementsInteracted++;

          try {
            if (el.tag === 'input' || el.tag === 'textarea') {
              const value = generateSyntheticData(el.type || 'text');
              const filled = await safeFill(page, el.selector, value);
              if (filled) coverage.actionsExecuted++;
            } else if (el.tag === 'select') {
              // Try to select first option
              const select = page.locator(el.selector).first();
              const options = await select.locator('option').count();
              if (options > 1) {
                await select.selectOption({ index: 1 }).catch(() => {});
                coverage.actionsExecuted++;
              }
            } else if (el.tag === 'button' || el.tag === 'a') {
              // Skip external links and logout
              const text = el.text.toLowerCase();
              const href = el.href || '';

              if (
                text.includes('logout') ||
                text.includes('sair') ||
                href.startsWith('http') ||
                href.startsWith('mailto:') ||
                href.startsWith('tel:')
              ) {
                continue;
              }

              // For anchor links, just hover
              if (href.startsWith('#')) {
                const hovered = await safeHover(page, el.selector);
                if (hovered) coverage.hoversExecuted++;
              } else if (el.tag === 'button') {
                // Click buttons that look like UI controls
                if (
                  text.includes('fechar') ||
                  text.includes('close') ||
                  text.includes('menu') ||
                  el.selector.includes('modal') ||
                  el.selector.includes('dialog')
                ) {
                  const clicked = await safeClick(page, el.selector);
                  if (clicked) {
                    coverage.actionsExecuted++;
                    await page.waitForTimeout(300);
                  }
                } else {
                  // Just hover other buttons to test hover states
                  const hovered = await safeHover(page, el.selector);
                  if (hovered) coverage.hoversExecuted++;
                }
              }
            }
          } catch (e) {
            // Element might have been removed from DOM
          }
        }

        // Test SVG nodes if present (for ecosystem/solucoes sections)
        const svgNodes = await page.locator('.ecosystem__node, .solucoes__node').all();
        for (const node of svgNodes.slice(0, 15)) {
          try {
            const box = await node.boundingBox();
            if (box) {
              await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
              coverage.hoversExecuted++;
              await page.waitForTimeout(100);
            }
          } catch {
            // Node might be off-screen
          }
        }

        // Check for errors after interactions
        if (guards.pageErrors.length > 0) {
          coverage.errors.push({
            category: 'UNHANDLED_PAGE_ERROR',
            message: guards.pageErrors.join('; '),
            url: currentPath,
          });
        }

        const serverErrors = guards.serverErrors.filter((e) => e.status >= 500);
        for (const err of serverErrors) {
          coverage.errors.push({
            category: 'NETWORK_5XX',
            message: `${err.status} on ${err.url}`,
            url: currentPath,
          });
        }

        // Log 4xx errors (not critical but informative)
        const clientErrors = guards.serverErrors.filter((e) => e.status >= 400 && e.status < 500);
        if (clientErrors.length > 0) {
          console.log(`⚠️ ${currentPath}: ${clientErrors.length} 4xx responses`);
        }

      } catch (error) {
        coverage.errors.push({
          category: 'NAVIGATION_BROKEN',
          message: error instanceof Error ? error.message : String(error),
          url: currentPath,
        });
      }
    }

    // Final report
    console.log('\n================================================================================');
    console.log('                         CRAWLER COVERAGE REPORT');
    console.log('================================================================================');
    console.log(`Pages visited:       ${coverage.pagesVisited.length}`);
    console.log(`Actions executed:    ${coverage.actionsExecuted}`);
    console.log(`Elements interacted: ${coverage.elementsInteracted}`);
    console.log(`Hovers executed:     ${coverage.hoversExecuted}`);
    console.log(`Forms found:         ${coverage.formsFound}`);
    console.log(`Errors found:        ${coverage.errors.length}`);

    if (coverage.pagesVisited.length > 0) {
      console.log('\nPages visited:');
      for (const p of coverage.pagesVisited) {
        console.log(`  - ${p}`);
      }
    }

    if (coverage.errors.length > 0) {
      console.log('\n=== ERRORS ===');
      for (const err of coverage.errors) {
        console.log(`[${err.category}] ${err.url}: ${err.message}`);
      }
    }

    console.log('================================================================================\n');

    // Fail if there are critical errors
    const criticalErrors = coverage.errors.filter(
      (e) => e.category === 'NETWORK_5XX' || e.category === 'UNHANDLED_PAGE_ERROR'
    );

    if (criticalErrors.length > 0) {
      console.log('❌ CRITICAL ERRORS FOUND:');
      for (const err of criticalErrors) {
        console.log(`  [${err.category}] ${err.url}: ${err.message}`);
      }
    }

    expect(criticalErrors).toHaveLength(0);
  });

  test('stress test - rapid navigation', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const sections = ['#proposito', '#quem-somos', '#ecossistema', '#solucoes-org', '#colabs', '#esg', '#contato'];

    // Rapid scroll through all sections
    for (const section of sections) {
      try {
        const el = page.locator(section);
        if (await el.isVisible()) {
          await el.scrollIntoViewIfNeeded({ timeout: 3000 });
          await page.waitForTimeout(200);
        }
      } catch {
        // Section might not exist
      }
    }

    // Verify page is still responsive
    await expect(page.locator('body')).toBeVisible();
    console.log('✅ STRESS: Rapid navigation completed without crash');
  });

  test('interaction stability - hover multiple nodes rapidly', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForSelector('#solucoes-org');
    await page.locator('#solucoes-org').scrollIntoViewIfNeeded();

    // Rapidly hover over all orbital nodes
    for (let i = 1; i <= 11; i++) {
      const nodeId = i < 10 ? `#node-0${i}-solucoes` : `#node-${i}-solucoes`;
      const node = page.locator(nodeId);

      try {
        const box = await node.boundingBox();
        if (box) {
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await page.waitForTimeout(50); // Very fast hover
        }
      } catch {
        // Node might be animating
      }
    }

    // Verify page is still responsive
    await expect(page.locator('body')).toBeVisible();
    console.log('✅ STABILITY: Rapid hover completed without crash');
  });
});
