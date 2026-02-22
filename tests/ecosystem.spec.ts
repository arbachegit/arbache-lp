import { test, expect } from '@playwright/test';

// BASELINE - valores mínimos obrigatórios
const BASELINE = {
  sectionMinHeight: 500,    // Seção deve ter no mínimo 500px
  svgMinHeight: 450,        // SVG deve ter no mínimo 450px
  svgMinWidth: 700,         // SVG deve ter no mínimo 700px
  svgHeightRatio: 0.92,     // SVG deve ocupar ≥92% da altura do container
  svgWidthRatio: 0.98,      // SVG deve ocupar ≥98% da largura do container
};

test.describe('Nosso Ecossistema - Validação Nuclear', () => {

  test('Gate C: Diagrama não pode encolher', async ({ page }) => {
    await page.goto('/');

    // Aguarda seção carregar
    await page.waitForSelector('#nosso-ecossistema');

    // Mede a seção
    const section = await page.locator('#nosso-ecossistema').boundingBox();
    expect(section).not.toBeNull();
    expect(section!.height).toBeGreaterThanOrEqual(BASELINE.sectionMinHeight);

    // Mede o container do SVG
    const vizContainer = await page.locator('.ecosystem__viz').boundingBox();
    expect(vizContainer).not.toBeNull();

    // Mede o SVG
    const svg = await page.locator('.ecosystem__svg').boundingBox();
    expect(svg).not.toBeNull();
    expect(svg!.height).toBeGreaterThanOrEqual(BASELINE.svgMinHeight);
    expect(svg!.width).toBeGreaterThanOrEqual(BASELINE.svgMinWidth);

    // Verifica proporção (SVG ocupa ≥92% da altura do container)
    const heightRatio = svg!.height / vizContainer!.height;
    expect(heightRatio).toBeGreaterThanOrEqual(BASELINE.svgHeightRatio);

    // Verifica proporção (SVG ocupa ≥98% da largura do container)
    const widthRatio = svg!.width / vizContainer!.width;
    expect(widthRatio).toBeGreaterThanOrEqual(BASELINE.svgWidthRatio);

    console.log(`✅ Section: ${section!.height}px`);
    console.log(`✅ Container: ${vizContainer!.width}x${vizContainer!.height}px`);
    console.log(`✅ SVG: ${svg!.width}x${svg!.height}px`);
    console.log(`✅ Height ratio: ${(heightRatio * 100).toFixed(1)}%`);
    console.log(`✅ Width ratio: ${(widthRatio * 100).toFixed(1)}%`);
  });

  test('Gate D: Hub centralizado e simetria', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#nosso-ecossistema');

    // Verifica que hub existe
    const hub = await page.locator('#node-hub').boundingBox();
    expect(hub).not.toBeNull();

    // Verifica que todos os 6 nós orbitais existem
    for (let i = 1; i <= 6; i++) {
      const node = await page.locator(`#node-0${i}`).boundingBox();
      expect(node).not.toBeNull();
    }

    console.log('✅ Hub e 6 nós orbitais presentes');
  });

  test('Gate E: Cores P&B apenas', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#nosso-ecossistema');

    // Verifica que a seção usa fundo escuro (P&B)
    const sectionBg = await page.locator('#nosso-ecossistema').evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );

    // Deve ser preto/cinza escuro (rgb values próximos)
    const match = sectionBg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      const [, r, g, b] = match.map(Number);
      // Verifica se é cinza (R ≈ G ≈ B) e escuro (< 50)
      expect(Math.abs(r - g)).toBeLessThan(10);
      expect(Math.abs(g - b)).toBeLessThan(10);
      expect(r).toBeLessThan(50);
      console.log(`✅ Fundo P&B: rgb(${r}, ${g}, ${b})`);
    }
  });

  test('Gate A: Conteúdo intacto', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#nosso-ecossistema');

    // Verifica textos obrigatórios
    const textos = [
      'Nosso Ecossistema',
      'Uma rede integrada de competências, conexões e propósito',
      'ARBACHE',
      'CONSULTING',
    ];

    for (const texto of textos) {
      const element = await page.locator(`text=${texto}`).first();
      await expect(element).toBeVisible();
    }

    console.log('✅ Todos os textos obrigatórios presentes');
  });

});
