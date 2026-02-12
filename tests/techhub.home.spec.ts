import { test } from '@playwright/test';
import { TechHubHomePage } from '../POM/TechHubHomePage';

test('TechHub home loads', async ({ page }) => {
  const home = new TechHubHomePage(page);
  await home.goto();
  await home.expectLoaded();
});
