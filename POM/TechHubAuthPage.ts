import { Locator, Page } from '@playwright/test';
import { TechHubBasePage } from './TechHubBasePage';

export type TechHubUser = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export class TechHubAuthPage extends TechHubBasePage {
  constructor(page: Page) {
    super(page);
  }

  private async isLoginFormVisible() {
    try {
      return await this.page.getByTestId('login-email-input').isVisible();
    } catch {
      return false;
    }
  }

  private async isSignupFormVisible() {
    try {
      return await this.page.getByTestId('signup-email-input').isVisible();
    } catch {
      return false;
    }
  }

  private async ensureAuthPage() {
    if ((await this.isLoginFormVisible()) || (await this.isSignupFormVisible())) {
      return;
    }

    await this.page.goto('https://techhubecommerce.lovable.app/auth', {
      waitUntil: 'domcontentloaded',
    });
  }

  async isAuthPage() {
    if (this.page.url().includes('/auth')) {
      return true;
    }

    return (await this.isLoginFormVisible()) || (await this.isSignupFormVisible());
  }

  private loginEmailLocators(): Locator[] {
    return [
      this.page.getByTestId('login-email-input'),
      this.page.locator('#login-email'),
    ];
  }

  private loginPasswordLocators(): Locator[] {
    return [
      this.page.getByTestId('login-password-input'),
      this.page.locator('#login-password'),
    ];
  }

  private signupEmailLocators(): Locator[] {
    return [
      this.page.getByTestId('signup-email-input'),
      this.page.locator('#signup-email'),
    ];
  }

  private signupPasswordLocators(): Locator[] {
    return [
      this.page.getByTestId('signup-password-input'),
      this.page.locator('#signup-password'),
    ];
  }

  private confirmPasswordLocators(): Locator[] {
    return [
      this.page.getByLabel(/confirme|confirmation|confirm/i),
      this.page.getByPlaceholder(/confirme|confirmation|confirm/i),
      this.page.locator('input[name="confirmPassword"]'),
      this.page.locator('#confirmPassword'),
    ];
  }

  private fullNameLocators(): Locator[] {
    return [
      this.page.getByTestId('signup-name-input'),
      this.page.locator('#signup-name'),
    ];
  }

  private async openRegisterForm() {
    await this.clickOptional([
      this.page.getByTestId('signup-tab'),
      this.page.getByRole('tab', { name: /inscription|cr[eé]er un compte|register|sign up/i }),
    ]);
  }

  private async openLoginForm() {
    await this.clickOptional([
      this.page.getByRole('tab', { name: /connexion|se connecter|login/i }),
    ]);
  }

  private async acceptTermsIfPresent() {
    const terms = this.page.getByRole('checkbox', {
      name: /conditions|cgv|termes|terms|privacy|j'accepte/i,
    });
    if (await terms.count()) {
      try {
        await terms.first().check();
      } catch {
        // ignore if disabled or hidden
      }
    }
  }

  async register(user: TechHubUser) {
    await this.ensureAuthPage();
    await this.openRegisterForm();
    if (!(await this.isSignupFormVisible())) {
      await this.openRegisterForm();
    }
    await this.fillOptional(this.fullNameLocators(), `${user.firstName} ${user.lastName}`);
    await this.fillFirst(this.signupEmailLocators(), user.email, 'email input');
    await this.fillFirst(this.signupPasswordLocators(), user.password, 'password input');
    await this.fillOptional(this.confirmPasswordLocators(), user.password);
    await this.acceptTermsIfPresent();

    await this.clickFirst(
      [
        this.page.getByTestId('signup-submit-button'),
      ],
      'register submit button'
    );
  }

  async login(email: string, password: string) {
    await this.ensureAuthPage();
    await this.openLoginForm();
    const loginEmailVisible = await this.isAnyVisible(this.loginEmailLocators(), 2000);
    if (!loginEmailVisible) {
      return;
    }

    await this.fillFirst(this.loginEmailLocators(), email, 'email input');
    await this.fillFirst(this.loginPasswordLocators(), password, 'password input');

    await this.clickFirst(
      [
        this.page.getByTestId('login-submit-button'),
      ],
      'login submit button'
    );
  }

  async waitForAuthToSettle() {
    await this.page.waitForTimeout(500);
    if (!this.page.url().includes('/auth')) {
      return;
    }

    const loginVisible = await this.isLoginFormVisible();
    const signupVisible = await this.isSignupFormVisible();

    if (!loginVisible && !signupVisible) {
      return;
    }
  }

  async ensureLoggedIn(email: string, password: string) {
    const loginVisible = await this.isLoginFormVisible();
    const signupVisible = await this.isSignupFormVisible();

    if (!loginVisible && !signupVisible) {
      return;
    }

    await this.login(email, password);
    await this.waitForAuthToSettle();
  }
}
