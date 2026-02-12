import { Locator, Page } from '@playwright/test';
import { TechHubBasePage } from './TechHubBasePage';

export class TechHubHomePage extends TechHubBasePage {
  readonly baseUrl = 'https://techhubecommerce.lovable.app/';

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto(this.baseUrl, { waitUntil: 'domcontentloaded' });
  }

  async expectLoaded() {
    await this.expectAnyVisible(
      [
        this.page.getByRole('heading', { name: /techhub/i }),
        this.page.getByText(/techhub/i),
      ],
      'home page hero'
    );
  }

  productCard(id: number): Locator {
    return this.page.getByTestId(`product-card-${id}`);
  }

  async openProductById(id: number) {
    try {
      await this.clickFirst(
        [
          this.productCard(id),
          this.page.locator(`a[href="/product/${id}"]`),
        ],
        `product card ${id}`
      );
    } catch {
      await this.page.goto(`${this.baseUrl}product/${id}`, { waitUntil: 'domcontentloaded' });
    }
  }

  async openCart() {
    try {
      await this.clickFirst(
        [
          this.page.getByTestId('cart-button'),
          this.page.locator('a[href="/cart"]'),
        ],
        'cart button'
      );
    } catch {
      await this.page.goto(`${this.baseUrl}cart`, { waitUntil: 'domcontentloaded' });
    }
  }

  async openLogin() {
    const clicked = await this.clickOptional(
      [
        this.page.getByTestId('login-button'),
        this.page.getByTestId('nav-link-login'),
        this.page.locator('a[href="/auth"]'),
      ],
      1000
    );

    if (!clicked) {
      await this.page.goto(`${this.baseUrl}auth`, { waitUntil: 'domcontentloaded' });
    }
  }

  async openRegister() {
    const clicked = await this.clickOptional(
      [
        this.page.getByTestId('login-button'),
        this.page.getByTestId('nav-link-register'),
        this.page.locator('a[href="/auth"]'),
      ],
      1000
    );

    if (!clicked) {
      await this.page.goto(`${this.baseUrl}auth`, { waitUntil: 'domcontentloaded' });
    }
  }
}
