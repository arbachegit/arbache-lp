import { test } from '@playwright/test';

test('Captura screenshot Soluções para Organizações', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('#solucoes-org');

  // Scroll to section
  await page.locator('#solucoes-org').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // Full section screenshot
  await page.locator('#solucoes-org').screenshot({
    path: 'tests/screenshots/solucoes-org-full.png'
  });

  console.log('✅ Screenshot salvo em tests/screenshots/solucoes-org-full.png');
});
