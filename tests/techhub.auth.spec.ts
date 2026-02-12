import { test } from '@playwright/test';
import { TechHubAuthPage, type TechHubUser } from '../POM/TechHubAuthPage';
import { TechHubHomePage } from '../POM/TechHubHomePage';

test('TechHub create account', async ({ page }) => {
  const home = new TechHubHomePage(page);
  const auth = new TechHubAuthPage(page);
  const seed = Date.now();
  const user: TechHubUser = {
    firstName: 'Test',
    lastName: 'User',
    email: `test+${seed}@example.com`,
    password: 'Test!12345',
  };

  await home.goto();
  await home.openRegister();
  await auth.register(user);
  await auth.waitForAuthToSettle();
});
