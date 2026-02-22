import { test, expect } from '@playwright/test';

// BASELINE - valores mínimos obrigatórios (mesmos do Ecossistema)
const BASELINE = {
  sectionMinHeight: 500,    // Seção deve ter no mínimo 500px
  svgMinHeight: 450,        // SVG deve ter no mínimo 450px
  svgMinWidth: 700,         // SVG deve ter no mínimo 700px
  svgHeightRatio: 0.92,     // SVG deve ocupar ≥92% da altura do container
  svgWidthRatio: 0.98,      // SVG deve ocupar ≥98% da largura do container
};

test.describe('Soluções para Organizações - Validação Nuclear', () => {

  test('Gate C: Diagrama não pode encolher', async ({ page }) => {
    await page.goto('/');

    // Aguarda seção carregar
    await page.waitForSelector('#solucoes-org');

    // Mede a seção
    const section = await page.locator('#solucoes-org').boundingBox();
    expect(section).not.toBeNull();
    expect(section!.height).toBeGreaterThanOrEqual(BASELINE.sectionMinHeight);

    // Mede o container do SVG
    const vizContainer = await page.locator('.solucoes__viz').boundingBox();
    expect(vizContainer).not.toBeNull();

    // Mede o SVG
    const svg = await page.locator('.solucoes__svg').boundingBox();
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

  test('Gate D: Hub centralizado e 11 nós orbitais', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#solucoes-org');

    // Verifica que hub existe
    const hub = await page.locator('#node-hub-solucoes').boundingBox();
    expect(hub).not.toBeNull();

    // Verifica que todos os 11 nós orbitais existem
    for (let i = 1; i <= 11; i++) {
      const nodeId = i < 10 ? `#node-0${i}-solucoes` : `#node-${i}-solucoes`;
      const node = await page.locator(nodeId).boundingBox();
      expect(node).not.toBeNull();
    }

    console.log('✅ Hub e 11 nós orbitais presentes');
  });

  test('Gate E: Cores P&B apenas', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#solucoes-org');

    // Verifica que a seção usa fundo escuro (P&B)
    const sectionBg = await page.locator('#solucoes-org').evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );

    // Deve ser preto/cinza escuro (rgb values próximos)
    const match = sectionBg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      const [, r, g, b] = match.map(Number);
      // Verifica se é cinza (R ≈ G ≈ B) e escuro (< 60)
      expect(Math.abs(r - g)).toBeLessThan(10);
      expect(Math.abs(g - b)).toBeLessThan(10);
      expect(r).toBeLessThan(60);
      console.log(`✅ Fundo P&B: rgb(${r}, ${g}, ${b})`);
    }
  });

  test('Gate A: Conteúdo intacto', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#solucoes-org');

    // Verifica textos obrigatórios
    const textos = [
      'Soluções para Organizações',
      'Conheça nosso ecossistema de soluções integradas',
      'ARBACHE',
      'CONSULTING',
      'ORGANIZAÇÕES',
    ];

    for (const texto of textos) {
      const element = await page.locator(`text=${texto}`).first();
      await expect(element).toBeVisible();
    }

    console.log('✅ Todos os textos obrigatórios presentes');
  });

  test('Gate F: Todos os 11 serviços presentes', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#solucoes-org');

    // Verifica que existem exatamente 11 nós orbitais + 1 hub
    const nodes = await page.locator('.solucoes__node').count();
    expect(nodes).toBe(12); // 11 orbitais + 1 hub

    // Verifica que os labels dos 11 serviços existem (versão compacta)
    const servicos = [
      'Trilhas e',
      'Curadoria e',
      'Formação de',
      'Assessment',
      'Senior Advisor',
      'Mentoria de',
      'Auditorias e',
      'Missões e',
      'Redes e',
      'Processos',
      'Palestras e',
    ];

    for (const servico of servicos) {
      const label = await page.locator(`text=${servico}`).first();
      await expect(label).toBeVisible();
    }

    console.log('✅ Todos os 11 serviços originais presentes');
  });

});
