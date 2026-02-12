import { test } from '@playwright/test';
import { TechHubCartPage } from '../POM/TechHubCartPage';
import { TechHubHomePage } from '../POM/TechHubHomePage';
import { TechHubProductPage } from '../POM/TechHubProductPage';

test('TechHub add product to cart', async ({ page }) => {
  const home = new TechHubHomePage(page);
  const product = new TechHubProductPage(page);
  const cart = new TechHubCartPage(page);
  await home.goto();
  await home.openProductById(2);
  await product.addToCart();
  await product.openCart();
  await cart.expectLoaded();
});
