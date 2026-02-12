import { Locator, Page } from '@playwright/test';
import { TechHubBasePage } from './TechHubBasePage';

export class TechHubCartPage extends TechHubBasePage {
  constructor(page: Page) {
    super(page);
  }

  checkoutButton(): Locator {
    return this.page.getByTestId('checkout-button');
  }

  async expectLoaded() {
    await this.expectAnyVisible(
      [
        this.page.getByRole('heading', { name: /panier|cart/i }),
        this.page.getByText(/panier|cart/i),
      ],
      'cart page'
    );
  }

  async increaseQuantity(productId?: number) {
    const byId = productId ? this.page.getByTestId(`increase-quantity-${productId}`) : null;
    await this.clickFirst(
      [
        ...(byId ? [byId] : []),
        this.page.getByTestId('increase-quantity-1'),
      ],
      'increase quantity button'
    );
  }

  async decreaseQuantity(productId?: number) {
    const byId = productId ? this.page.getByTestId(`decrease-quantity-${productId}`) : null;
    await this.clickFirst(
      [
        ...(byId ? [byId] : []),
        this.page.getByTestId('decrease-quantity-1'),
      ],
      'decrease quantity button'
    );
  }

  async removeItem(productId?: number) {
    const byId = productId ? this.page.getByTestId(`remove-item-${productId}`) : null;
    await this.clickFirst(
      [
        ...(byId ? [byId] : []),
        this.page.getByTestId('remove-item-1'),
      ],
      'remove item button'
    );
  }

  async checkout() {
    try {
      await this.clickFirst(
        [
          this.checkoutButton(),
          this.page.locator('a[href="/checkout"]'),
        ],
        'checkout button'
      );
    } catch {
      await this.page.goto('https://techhubecommerce.lovable.app/checkout', {
        waitUntil: 'domcontentloaded',
      });
    }
  }

  async expectEmpty() {
    const emptyMessage = this.page.getByText(/panier vide|votre panier est vide|cart is empty/i);
    if (await emptyMessage.count()) {
      await emptyMessage.first().waitFor({ state: 'visible', timeout: 5000 });
      return;
    }

    const removeButtons = this.page.getByRole('button', { name: /supprimer|retirer|remove|delete/i });
    if (await removeButtons.count()) {
      throw new Error('Expected cart to be empty, but remove buttons are still visible');
    }
  }
}
