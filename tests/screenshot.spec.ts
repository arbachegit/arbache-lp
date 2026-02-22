import { test } from '@playwright/test';

test('Captura screenshot Ecossistema', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('#nosso-ecossistema');

  // Scroll para a seção
  await page.locator('#nosso-ecossistema').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // Screenshot da seção
  await page.locator('#nosso-ecossistema').screenshot({
    path: 'tests/screenshots/ecosystem-baseline.png'
  });

  console.log('✅ Screenshot salvo em tests/screenshots/ecosystem-baseline.png');
});
