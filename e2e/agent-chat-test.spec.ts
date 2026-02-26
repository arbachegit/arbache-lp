import { test, expect } from '@playwright/test';

test.describe('Agent Chat API Test', () => {
  test('chat API responds correctly', async ({ page }) => {
    // Navigate to the page
    await page.goto('/');
    
    // Setup network monitoring
    const apiResponses: { url: string; status: number; body?: string }[] = [];
    
    page.on('response', async (response) => {
      if (response.url().includes('/chat')) {
        const body = await response.text().catch(() => 'unable to read');
        apiResponses.push({
          url: response.url(),
          status: response.status(),
          body: body.substring(0, 500)
        });
      }
    });
    
    page.on('requestfailed', (request) => {
      if (request.url().includes('api.arbache.com') || request.url().includes('/chat')) {
        console.log('❌ Request failed:', request.url(), request.failure()?.errorText);
      }
    });
    
    // Click the agent button
    const agentButton = page.locator('button[aria-label="Abrir agente de chat"]');
    await expect(agentButton).toBeVisible({ timeout: 10000 });
    await agentButton.click();
    
    // Wait for chat window
    const chatWindow = page.locator('text=Assistente Arbache');
    await expect(chatWindow).toBeVisible({ timeout: 5000 });
    
    // Type a message
    const input = page.locator('input[placeholder*="Arbache"], input[placeholder*="mensagem"]').first();
    await expect(input).toBeVisible();
    await input.fill('Olá, teste');
    
    // Send the message
    const sendButton = page.locator('button[aria-label="Enviar mensagem"]');
    await sendButton.click();
    
    // Wait for response (or error)
    await page.waitForTimeout(10000);
    
    // Check what happened
    console.log('\n=== API RESPONSES ===');
    for (const resp of apiResponses) {
      console.log(`URL: ${resp.url}`);
      console.log(`Status: ${resp.status}`);
      console.log(`Body: ${resp.body}`);
    }
    
    // Check for error message in chat
    const errorMessage = page.locator('text=Desculpe, ocorreu um erro');
    const hasError = await errorMessage.isVisible();
    
    if (hasError) {
      console.log('\n❌ ERROR MESSAGE DISPLAYED IN CHAT');
    }
    
    // Check for successful response
    const agentResponse = page.locator('.bg-\\[\\#1a1a1f\\].rounded-2xl.rounded-tl-sm').last();
    const responseText = await agentResponse.textContent();
    console.log('\n=== AGENT RESPONSE ===');
    console.log(responseText);
    
    // Fail if error
    expect(hasError).toBe(false);
  });
});
