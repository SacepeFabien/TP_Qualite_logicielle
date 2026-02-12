import { test } from '@playwright/test';
import { TechHubAuthPage } from '../POM/TechHubAuthPage';
import { TechHubCartPage } from '../POM/TechHubCartPage';
import { TechHubCheckoutPage, type PaymentDetails, type ShippingDetails } from '../POM/TechHubCheckoutPage';
import { TechHubHomePage } from '../POM/TechHubHomePage';
import { TechHubProductPage } from '../POM/TechHubProductPage';

const baseUrl = 'https://techhubecommerce.lovable.app/';

test('TechHub full e2e flow', async ({ page }) => {
  const fullName = 'Test User';
  const email = process.env.TECHHUB_EMAIL ?? '';
  const password = process.env.TECHHUB_PASSWORD ?? '';
  const month = '12';
  const year = '28';

  if (!email || !password) {
    throw new Error('Missing TECHHUB_EMAIL or TECHHUB_PASSWORD in env/.env.local');
  }

  const home = new TechHubHomePage(page);
  const auth = new TechHubAuthPage(page);
  const product = new TechHubProductPage(page);
  const cart = new TechHubCartPage(page);
  const checkout = new TechHubCheckoutPage(page);

  const shippingDetails: ShippingDetails = {
    firstName: 'Test',
    lastName: 'User',
    email,
    phone: '0600000000',
    address: '1 rue de la ville',
    city: 'Lille',
    postalCode: '59000',
  };

  const paymentDetails: PaymentDetails = {
    cardNumber: '4242424242424242',
    cardName: fullName,
    expiry: `${month}/${year}`,
    cvv: '123',
  };

  await auth.login(email, password);
  await auth.waitForAuthToSettle();

  await home.goto();
  await home.openProductById(7);
  await product.addToCart();
  await product.openCart();
  await cart.checkout();

  if (await page.getByRole('heading', { name: /connexion requise/i }).isVisible().catch(() => false)) {
    await auth.login(email, password);
    await auth.waitForAuthToSettle();
    await page.goto(`${baseUrl}checkout`);
  }

  await checkout.fillShipping(shippingDetails);
  await checkout.submitShipping();
  await checkout.expectPaymentStep();
  await checkout.fillPayment(paymentDetails);
  await checkout.submitPayment();
  await checkout.expectConfirmation();
});
