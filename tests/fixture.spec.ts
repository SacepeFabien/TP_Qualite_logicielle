import { test, expect } from '../POM/fixture';

test.beforeEach(async ({ page }) => {
  await page.goto(process.env.URL!);
});

test('formulaire avec fixture', async ({ form }) => {
  await form.fillForm();
  await expect(form.titleSuccess).toBeVisible();
});
