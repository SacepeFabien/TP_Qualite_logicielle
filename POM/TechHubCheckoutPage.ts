import { Locator, Page } from '@playwright/test';
import { TechHubBasePage } from './TechHubBasePage';

export type ShippingDetails = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
};

export type PaymentDetails = {
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
};

export class TechHubCheckoutPage extends TechHubBasePage {
  constructor(page: Page) {
    super(page);
  }

  async expectShippingStep() {
    const locators = [
      this.page.getByTestId('shipping-firstname-input'),
      this.page.getByRole('heading', { name: /adresse de livraison/i }),
    ];

    for (const locator of locators) {
      try {
        await locator.first().waitFor({ state: 'visible', timeout: 15000 });
        return;
      } catch {
        // try next candidate
      }
    }

    throw new Error(`Expected shipping step to be visible. Current URL: ${this.page.url()}`);
  }

  async isCartEmpty(timeout = 5000) {
    const emptyMessage = this.page.getByText(/votre panier est vide|panier vide|cart is empty/i);
    const shippingInput = this.page.getByTestId('shipping-firstname-input');
    const gateHeading = this.page.getByRole('heading', { name: /connexion requise/i });

    try {
      await Promise.race([
        emptyMessage.first().waitFor({ state: 'visible', timeout }),
        shippingInput.waitFor({ state: 'visible', timeout }),
        gateHeading.waitFor({ state: 'visible', timeout }),
      ]);
    } catch {
      // ignore and check visibility below
    }

    return emptyMessage.first().isVisible().catch(() => false);
  }

  private async fillRequiredFallback() {
    const requiredInputs = this.page.locator(
      'input[required]:not([type="checkbox"]):not([type="radio"]), textarea[required]'
    );
    const inputCount = await requiredInputs.count();
    for (let i = 0; i < inputCount; i += 1) {
      const input = requiredInputs.nth(i);
      const current = (await input.inputValue()).trim();
      if (current) {
        continue;
      }

      const name = (await input.getAttribute('name'))?.toLowerCase() || '';
      const id = (await input.getAttribute('id'))?.toLowerCase() || '';
      const type = (await input.getAttribute('type'))?.toLowerCase() || '';
      const hint = `${name} ${id} ${type}`;
      let value = 'Test';
      if (hint.includes('email')) value = 'test@example.com';
      if (hint.includes('phone') || hint.includes('tel')) value = '0601020304';
      if (hint.includes('address')) value = '1 rue de la ville';
      if (hint.includes('city') || hint.includes('ville')) value = 'Lille';
      if (hint.includes('postal') || hint.includes('zip') || hint.includes('code')) value = '59000';
      if (hint.includes('first') || hint.includes('prenom') || hint.includes('prénom')) value = 'Test';
      if (hint.includes('last') || hint.includes('nom')) value = 'User';

      await input.fill(value);
    }

    const requiredSelects = this.page.locator('select[required]');
    const selectCount = await requiredSelects.count();
    for (let i = 0; i < selectCount; i += 1) {
      const select = requiredSelects.nth(i);
      const value = await select.inputValue();
      if (value) {
        continue;
      }

      const options = select.locator('option');
      const optionCount = await options.count();
      for (let j = 0; j < optionCount; j += 1) {
        const option = options.nth(j);
        const optValue = await option.getAttribute('value');
        if (optValue) {
          await select.selectOption(optValue);
          break;
        }
      }
    }

    const requiredCheckboxes = this.page.locator('input[type="checkbox"][required]');
    const checkboxCount = await requiredCheckboxes.count();
    for (let i = 0; i < checkboxCount; i += 1) {
      const checkbox = requiredCheckboxes.nth(i);
      if (await checkbox.isChecked()) {
        continue;
      }
      try {
        await checkbox.check();
      } catch {
        // ignore if hidden/disabled
      }
    }
  }

  private async ensureInputValue(testId: string, value: string) {
    const locator = this.page.getByTestId(testId);
    if (!(await locator.count())) {
      return;
    }

    try {
      const current = (await locator.first().inputValue()).trim();
      if (!current) {
        await locator.first().fill(value);
      }
    } catch {
      // ignore if inputValue is not supported for this locator
    }
  }

  private async listMissingRequiredFields() {
    const missing: string[] = [];
    const requiredFields = this.page.locator('input[required], textarea[required], select[required]');
    const count = await requiredFields.count();
    for (let i = 0; i < count; i += 1) {
      const field = requiredFields.nth(i);
      const tag = (await field.evaluate((el) => el.tagName.toLowerCase())).toLowerCase();
      const type = ((await field.getAttribute('type')) || '').toLowerCase();

      if (tag === 'select') {
        const value = (await field.inputValue()).trim();
        if (value) {
          continue;
        }
      } else if (type === 'checkbox' || type === 'radio') {
        if (await field.isChecked()) {
          continue;
        }
      } else {
        const value = (await field.inputValue()).trim();
        if (value) {
          continue;
        }
      }

      const name =
        (await field.getAttribute('aria-label')) ||
        (await field.getAttribute('placeholder')) ||
        (await field.getAttribute('name')) ||
        (await field.getAttribute('id')) ||
        `${tag}:${type || 'text'}`;
      missing.push(name.trim());
    }

    return Array.from(new Set(missing));
  }

  private shippingSubmitButton(): Locator {
    return this.page.getByTestId('shipping-submit-button');
  }

  private paymentSubmitButton(): Locator {
    return this.page.getByTestId('payment-submit-button');
  }

  async fillShipping(details: ShippingDetails) {
    const paymentVisible = await this.isAnyVisible(
      [
        this.page.getByTestId('payment-cardnumber-input'),
        this.page.getByLabel(/num[eé]ro de carte|carte|card number/i),
        this.page.getByText(/paiement/i),
      ],
      1500
    );
    if (paymentVisible) {
      return;
    }

    await this.expectShippingStep();
    await this.page.waitForTimeout(300);
    const shippingInputVisible = await this.isAnyVisible(
      [
        this.page.getByTestId('shipping-firstname-input'),
        this.page.locator('#firstName'),
      ],
      2000
    );

    if (!shippingInputVisible) {
      await this.clickOptional(
        [
          this.page.getByRole('button', { name: /modifier|editer|éditer|changer|adresse|livraison/i }),
          this.page.getByRole('link', { name: /modifier|editer|éditer|changer|adresse|livraison/i }),
        ],
        1000
      );
      await this.page.waitForTimeout(300);
    }

    await this.fillFirst(
      [
        this.page.getByTestId('shipping-firstname-input'),
        this.page.locator('#firstName'),
      ],
      details.firstName,
      'shipping first name'
    );
    await this.fillFirst(
      [
        this.page.getByTestId('shipping-lastname-input'),
        this.page.locator('#lastName'),
      ],
      details.lastName,
      'shipping last name'
    );
    await this.fillFirst(
      [
        this.page.getByTestId('shipping-email-input'),
        this.page.locator('#email'),
      ],
      details.email,
      'shipping email'
    );
    await this.fillFirst(
      [
        this.page.getByTestId('shipping-phone-input'),
        this.page.locator('#phone'),
      ],
      details.phone,
      'shipping phone'
    );
    await this.fillFirst(
      [
        this.page.getByTestId('shipping-address-input'),
        this.page.locator('#address'),
      ],
      details.address,
      'shipping address'
    );
    await this.fillFirst(
      [
        this.page.getByTestId('shipping-city-input'),
        this.page.locator('#city'),
      ],
      details.city,
      'shipping city'
    );
    await this.fillFirst(
      [
        this.page.getByTestId('shipping-postalcode-input'),
        this.page.locator('#postalCode'),
      ],
      details.postalCode,
      'shipping postal code'
    );

    await this.ensureInputValue('shipping-firstname-input', details.firstName);
    await this.ensureInputValue('shipping-lastname-input', details.lastName);
    await this.ensureInputValue('shipping-email-input', details.email);
    await this.ensureInputValue('shipping-phone-input', details.phone);
    await this.ensureInputValue('shipping-address-input', details.address);
    await this.ensureInputValue('shipping-city-input', details.city);
    await this.ensureInputValue('shipping-postalcode-input', details.postalCode);

    await this.fillRequiredFallback();

    const shippingRadios = this.page.getByRole('radio');
    if (await shippingRadios.count()) {
      await shippingRadios.first().check();
    }
  }

  async submitShipping() {
    await this.clickFirst(
      [
        this.shippingSubmitButton(),
      ],
      'shipping submit button'
    );

    await this.page.waitForTimeout(500);
    const paymentFieldLocators = [
      this.page.getByTestId('payment-cardnumber-input'),
      this.page.getByTestId('payment-cardname-input'),
      this.page.getByTestId('payment-expiry-input'),
      this.page.getByTestId('payment-cvv-input'),
      this.page.locator('#cardNumber'),
    ];
    let paymentVisible = await this.isAnyVisible(paymentFieldLocators, 2000);

    if (!paymentVisible) {
      await this.clickOptional(
        [
          this.page.getByRole('button', { name: /paiement/i }),
          this.page.getByRole('link', { name: /paiement/i }),
        ],
        1000
      );

      await this.page.waitForTimeout(500);
      paymentVisible = await this.isAnyVisible(paymentFieldLocators, 2000);
    }

    if (!paymentVisible) {
      await this.fillRequiredFallback();
      try {
        await this.page.locator('form').first().evaluate((form: HTMLFormElement) => {
          if (typeof form.requestSubmit === 'function') {
            form.requestSubmit();
          } else {
            form.submit();
          }
        });
      } catch {
        // ignore if form submit fails
      }
    }
  }

  async expectPaymentStep() {
    const paymentLocators = [
      this.page.getByTestId('payment-cardnumber-input'),
      this.page.getByTestId('payment-cardname-input'),
      this.page.getByTestId('payment-expiry-input'),
      this.page.getByTestId('payment-cvv-input'),
      this.page.locator('#cardNumber'),
    ];

    if (await this.isAnyVisible(paymentLocators, 15000)) {
      return;
    }

    const missing = await this.listMissingRequiredFields();
    if (missing.length) {
      throw new Error(`Payment step not visible. Missing required fields: ${missing.join(', ')}`);
    }

    throw new Error('Payment step not visible after submitting shipping details.');
  }

  async fillPayment(details: PaymentDetails) {
    await this.expectPaymentStep();
    await this.fillFirst(
      [
        this.page.getByTestId('payment-cardnumber-input'),
        this.page.locator('#cardNumber'),
      ],
      details.cardNumber,
      'card number'
    );
    await this.fillFirst(
      [
        this.page.getByTestId('payment-cardname-input'),
        this.page.locator('#cardName'),
      ],
      details.cardName,
      'card name'
    );
    await this.fillFirst(
      [
        this.page.getByTestId('payment-expiry-input'),
        this.page.locator('#expiry'),
      ],
      details.expiry,
      'card expiry'
    );
    await this.fillFirst(
      [
        this.page.getByTestId('payment-cvv-input'),
        this.page.locator('#cvv'),
      ],
      details.cvv,
      'card cvv'
    );
  }

  async submitPayment() {
    await this.clickFirst(
      [
        this.paymentSubmitButton(),
      ],
      'payment submit button'
    );
  }

  async expectConfirmation() {
    await this.expectAnyVisible(
      [
        this.page.getByRole('heading', { name: /commande confirm|order confirmed|merci/i }),
        this.page.getByText(/commande confirm|order confirmed|merci/i),
      ],
      'order confirmation'
    );
  }
}
