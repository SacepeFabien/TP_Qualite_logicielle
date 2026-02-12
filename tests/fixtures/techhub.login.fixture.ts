import { test as base } from '@playwright/test';
import { TechHubAuthPage } from '../../POM/TechHubAuthPage';

type Fixtures = {
  loggedIn: void;
};

export const test = base.extend<Fixtures>({
  loggedIn: async ({ page }, use) => {
    const email = process.env.TECHHUB_EMAIL ?? '';
    const password = process.env.TECHHUB_PASSWORD ?? '';

    if (!email || !password) {
      throw new Error('Missing TECHHUB_EMAIL or TECHHUB_PASSWORD in env/.env.local');
    }

    const auth = new TechHubAuthPage(page);
    await auth.login(email, password);
    await auth.waitForAuthToSettle();

    await use();
  },
});

export { expect } from '@playwright/test';
