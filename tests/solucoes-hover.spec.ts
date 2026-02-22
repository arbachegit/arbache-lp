import { test, expect } from '@playwright/test';

test('Captura hover expansion', async ({ page }) => {
  // Emula prefers-reduced-motion para desabilitar animações
  await page.emulateMedia({ reducedMotion: 'reduce' });

  await page.goto('/');
  await page.waitForSelector('#solucoes-org');

  // Scroll to section
  await page.locator('#solucoes-org').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // Screenshot estado normal
  await page.locator('#solucoes-org').screenshot({
    path: 'tests/screenshots/solucoes-normal.png'
  });

  // Simula hover via mouse move to element center
  const node = page.locator('#node-01-solucoes');
  const box = await node.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(500);
  }

  // Screenshot com hover state
  await page.locator('#solucoes-org').screenshot({
    path: 'tests/screenshots/solucoes-hover-state.png'
  });

  console.log('✅ Screenshots salvos (normal e hover)');
});
