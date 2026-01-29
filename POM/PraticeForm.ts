import { Locator, Page } from '@playwright/test';
import { faker } from '@faker-js/faker';

export class PraticeForm {
  firstName: Locator;
  lastName: Locator;
  email: Locator;
  genderMale: Locator;
  userNumber: Locator;
  submit: Locator;
  titleSuccess: Locator;

  constructor(private page: Page) {
    this.firstName = this.page.locator('#firstName');
    this.lastName = this.page.locator('#lastName');
    this.email = this.page.locator('#userEmail');
    this.genderMale = this.page.getByText('Male', { exact: true });
    this.userNumber = this.page.locator('#userNumber');
    this.submit = this.page.locator('#submit');
    this.titleSuccess = this.page.locator('#example-modal-sizes-title-lg');
  }

  async goto() {
    await this.page.goto('https://demoqa.com/automation-practice-form');
  }

  async fillForm() {
    await this.firstName.fill(process.env.FIRST_NAME!);
    await this.lastName.fill(process.env.LAST_NAME!);
    await this.email.fill(process.env.EMAIL!);
    await this.genderMale.click();
    await this.userNumber.fill(process.env.PHONE!);
    await this.submit.click();
  }
}
