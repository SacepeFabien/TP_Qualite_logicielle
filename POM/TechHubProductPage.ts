import { Locator, Page } from '@playwright/test';
import { TechHubBasePage } from './TechHubBasePage';

export class TechHubProductPage extends TechHubBasePage {
  constructor(page: Page) {
    super(page);
  }

  addToCartButton(): Locator {
    return this.page.getByTestId('product-detail-add-to-cart');
  }

  async expectLoaded() {
    await this.expectAnyVisible(
      [
        this.addToCartButton(),
      ],
      'product detail page'
    );
  }

  async addToCart() {
    await this.clickFirst(
      [
        this.addToCartButton(),
      ],
      'add to cart button'
    );
  }

  async backToList() {
    await this.clickFirst(
      [
        this.page.getByTestId('product-detail-back-link'),
      ],
      'back to products link'
    );
  }

  async openCart() {
    await this.clickFirst(
      [
        this.page.getByTestId('cart-button'),
        this.page.locator('a[href="/cart"]'),
      ],
      'cart button'
    );
  }
}
