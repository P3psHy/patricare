import { test, expect } from '@playwright/test';

test.describe('Lodgings Management', () => {
  test('Should delete a lodging from the lodgings page', async ({ page }) => {
    await page.goto('http://localhost:3000/lodgings');

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const lodgingCards = page.locator('div.bg-white.rounded-xl:has(> div.bg-gradient-to-br)');
    
    await lodgingCards.first().waitFor({ state: 'visible', timeout: 5000 });
    
    const initialCount = await lodgingCards.count();
    console.log(`Found ${initialCount} lodging cards initially`);
    
    expect(initialCount).toBeGreaterThanOrEqual(1);

    const firstCard = lodgingCards.first();

    page.on('dialog', async (dialog) => {
      console.log('Dialog message:', dialog.message());
      await dialog.accept();
    });

    const buttons = firstCard.locator('button');
    const deleteButton = buttons.last();
    await deleteButton.click();

    await page.waitForTimeout(1500);

    const finalCount = await lodgingCards.count();
    console.log(`Found ${finalCount} lodging cards after deletion`);
    expect(finalCount).toBe(initialCount - 1);
  });
});
