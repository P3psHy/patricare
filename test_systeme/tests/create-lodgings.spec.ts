import { test, expect } from '@playwright/test';

test.describe('Lodgings Management', () => {

  test('Should create a new lodging from the lodgings page', async ({ page }) => {
    await page.goto('http://localhost:3000/lodgings');

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    const lodgingCards = page.locator('div.bg-white.rounded-xl:has(> div.bg-gradient-to-br)');

    await lodgingCards.first().waitFor({ state: 'visible', timeout: 5000 });
    const initialCount = await lodgingCards.count();
    console.log(`Initial lodging count: ${initialCount}`);

    const addButton = page.getByRole('button', { name: /ajouter un bien/i });
    await addButton.click();

    const modal = page.locator('text=Ajouter un bien immobilier');
    await modal.waitFor({ state: 'visible', timeout: 5000 });

    await page.getByPlaceholder(/Ex: Appartement Paris 15ème/).fill('Appartement Playwright');
    await page.getByPlaceholder(/65/).fill('46');
    await page.getByPlaceholder(/3/).fill('2');
    await page.getByPlaceholder(/1250/).fill('900');

    const submitBtn = page.getByRole('button', { name: /ajouter le bien/i });
    await submitBtn.click();

    await modal.waitFor({ state: 'detached', timeout: 5000 });

    await page.waitForTimeout(1500);

    const finalCount = await lodgingCards.count();
    console.log(`Final lodging count: ${finalCount}`);

    expect(finalCount).toBe(initialCount + 1);

    const lastCard = lodgingCards.nth(finalCount - 1);
    await expect(lastCard).toContainText('Appartement Playwright');
  });

});
