import { faker } from '@faker-js/faker';
import { test } from '@playwright/test';
import { TechHubAuthPage, type TechHubUser } from '../POM/TechHubAuthPage';
import { TechHubHomePage } from '../POM/TechHubHomePage';

test('TechHub create account', async ({ page }) => {
  const home = new TechHubHomePage(page);
  const auth = new TechHubAuthPage(page);
  const seed = Date.now();
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const user: TechHubUser = {
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName, provider: 'example.com' }),
    password: 'Test!12345',
  };

  await home.goto();
  await home.openRegister();
  await auth.register(user);
  await auth.waitForAuthToSettle();
});
