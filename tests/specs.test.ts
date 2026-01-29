/*import { test, expect } from '@playwright/test';


test.beforeEach('test', async ({ page }) => {
    await page.goto('https://demoqa.com/elements');
});


test('remplir et valider le formulaire', async ({ page }) => {
    await page.locator('//span[text()="Text Box"]').click();
    
    await page.locator('#userName').fill('Antonin Telle');
    await page.locator('#userEmail').fill('antonin.telle@email.com');
    await page.locator('#currentAddress').fill('Chez moi c\'est la rue yaya');
    await page.locator('#permanentAddress').fill('la m');
    await page.locator('#submit').click();
    
    await expect(page.locator('#output')).toContainText('Antonin Telle');
    await expect(page.locator('#output')).toContainText('antonin.telle@email.com');
    await expect(page.locator('#output')).toContainText('Chez moi c\'est la rue yaya');
    await expect(page.locator('#output')).toContainText('la meme');

});

test('checkbox', async ({ page }) => {
    await page.locator('//span[text()="Check Box"]').click();

    await page.getByRole('button', { name: 'Toggle' }).click();
    await page.locator('label').filter({ hasText: 'Desktop' }).getByRole('img').first().check();
    await page.getByRole('listitem').filter({ hasText: /^Desktop$/ }).getByLabel('Toggle').click();
    await page.locator('label').filter({ hasText: 'Notes' }).getByRole('img').first().uncheck();

    await expect(page.locator('#result')).toContainText('desktop');
    await expect(page.locator('#result')).not.toContainText('notes');
});

test('selectOption', async ({ page }) => {
    await page.goto('https://demoqa.com/select-menu');

    await page.locator('#oldSelectMenu').selectOption('5');
    await expect(page.locator('#oldSelectMenu')).toHaveValue('5');
    await page.locator('#oldSelectMenu').selectOption('3');
    await expect(page.locator('#oldSelectMenu')).toHaveValue('3');

    await page.locator('#cars').selectOption(['opel', 'audi']);
});

test('file', async ({ page }) => {

    await page.locator('//span[text()="Upload and Download"]').click();

    await page.locator('#uploadFile').setInputFiles('C:\\Users\\anton\\Downloads\\Get.pdf');

});

test('formulaire', async ({ page }) => {
    await page.goto('https://demoqa.com/automation-practice-form');

    await page.locator('#firstName').fill('Antonin');
    await page.locator('#lastName').fill('Telle');
    await page.locator('#userEmail').fill('antonin.telle@email.com');
    await page.getByText('Male', { exact: true }).click();
    await page.locator('#userNumber').fill('0606060606');
    await page.locator('#dateOfBirthInput').click();
    await page.locator('#subjectsInput').fill('Maths');
    await page.locator('#subjectsInput').press('Enter');
    await page.locator('label').filter({ hasText: 'Reading' }).click();
    await page.locator('#uploadPicture').setInputFiles('C:\\Users\\anton\\Downloads\\Galdric.png');
    await page.locator('#currentAddress').fill('Chez moi c\'est la rue yaya');
    await page.locator('#state').click();
    await page.locator('#stateCity-wrapper').getByText('NCR').click();  
    await page.locator('#submit').click();

    await expect(page.locator('.modal-content')).toBeVisible();
});


import { PraticeForm } from '../POM/PraticeForm'


test.beforeEach(async ({ page }) => {
  await page.goto('https://demoqa.com/automation-practice-form')
})

test('formulaire avec POM', async ({ page }) => {
  const form = new PraticeForm(page);
  await form.fillForm();
})*/
