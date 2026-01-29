import { test as base, expect } from '@playwright/test';
import { PraticeForm } from '../POM/PraticeForm';

type Fixtures = {
  form: PraticeForm;
};

export const test = base.extend<Fixtures>({
  form: async ({ page }, use) => {
    await use(new PraticeForm(page));
  },
});

export { expect };
