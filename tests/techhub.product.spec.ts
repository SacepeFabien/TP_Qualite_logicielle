import { test } from '@playwright/test';
import { TechHubHomePage } from '../POM/TechHubHomePage';
import { TechHubProductPage } from '../POM/TechHubProductPage';

test('TechHub product detail opens', async ({ page }) => {
  const home = new TechHubHomePage(page);
  const product = new TechHubProductPage(page);
  await home.goto();
  await home.openProductById(2);
  await product.expectLoaded();
});
