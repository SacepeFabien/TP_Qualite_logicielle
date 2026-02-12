import { Locator, Page } from '@playwright/test';

export class TechHubBasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  protected async clickFirst(locators: Locator[], description: string) {
    for (const locator of locators) {
      try {
        await locator.first().waitFor({ state: 'visible', timeout: 5000 });
        await locator.first().click();
        return;
      } catch {
        // try next candidate
      }
    }
    throw new Error(`Unable to find ${description}`);
  }

  protected async clickOptional(locators: Locator[], timeout = 2000) {
    for (const locator of locators) {
      try {
        await locator.first().waitFor({ state: 'visible', timeout });
        await locator.first().click();
        return true;
      } catch {
        // try next candidate
      }
    }
    return false;
  }

  protected async fillFirst(locators: Locator[], value: string, description: string) {
    for (const locator of locators) {
      try {
        await locator.first().waitFor({ state: 'visible', timeout: 5000 });
        await locator.first().fill(value);
        return;
      } catch {
        // try next candidate
      }
    }
    throw new Error(`Unable to find ${description}`);
  }

  protected async fillOptional(locators: Locator[], value: string, timeout = 2000) {
    for (const locator of locators) {
      try {
        await locator.first().waitFor({ state: 'visible', timeout });
        await locator.first().fill(value);
        return true;
      } catch {
        // try next candidate
      }
    }
    return false;
  }

  protected async isAnyVisible(locators: Locator[], timeout = 1500) {
    for (const locator of locators) {
      try {
        await locator.first().waitFor({ state: 'visible', timeout });
        return true;
      } catch {
        // try next candidate
      }
    }
    return false;
  }

  protected async expectAnyVisible(locators: Locator[], description: string) {
    for (const locator of locators) {
      try {
        await locator.first().waitFor({ state: 'visible', timeout: 5000 });
        return;
      } catch {
        // try next candidate
      }
    }
    throw new Error(`Expected ${description} to be visible`);
  }
}
