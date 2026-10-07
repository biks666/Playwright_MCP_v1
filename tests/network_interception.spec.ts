import { test, expect } from '@playwright/test'

test('continue request demo', async ({ page }) => {

    await page.route('**/products.json', async (route) => {

        const request = route.request();

        console.log('URL:', request.url());
        console.log('Method:', request.method());
        console.log('Headers:', request.headers());
        console.log('Product API intercepted');

        await route.continue();
    });

    await page.goto('https://react-shopping-cart-67954.firebaseapp.com/');
    await page.waitForTimeout(5000);

});

test('continue request demo 2', async ({ page }) => {

    await page.route('**/products.json', async (route) => {

        console.log("Product API is blocked")
        await route.abort()
    });

    await page.goto('https://react-shopping-cart-67954.firebaseapp.com/');
    await page.waitForTimeout(5000);

});

test.only('Fulfill Product API - Show only 3 products', async ({ page }) => {

    await page.route('**/products.json', async (route) => {

        console.log('Mocking Product API response');

        // Get real response first
        const response = await route.fetch();
        const body = await response.json();

        // Modify data (keep only 3 products)
        body.products = body.products.slice(0, 3);

        // Send modified response back to UI
        await route.fulfill({
            response,
            body: JSON.stringify(body)
        });
    })
   await page.goto('https://react-shopping-cart-67954.firebaseapp.com/');
    await page.waitForTimeout(5000);
})
