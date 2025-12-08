import { test, expect } from '@playwright/test';

test.describe('Authentication Page', () => {

    test.beforeEach(async ({ page }) => {
        // Go to the login page before each test
        await page.goto('/login');
    });

    test('should display login form correctly', async ({ page }) => {
        // Check for the main heading
        await expect(page.getByRole('heading', { name: 'Đăng nhập' })).toBeVisible();

        // Check for input fields
        await expect(page.getByPlaceholder('Email của bạn')).toBeVisible();
        await expect(page.getByPlaceholder('Mật khẩu của bạn')).toBeVisible();

        // Check for Submit button
        await expect(page.getByRole('button', { name: 'Đăng nhập', exact: true })).toBeVisible();
    });

    test('should show validation errors for empty fields', async ({ page }) => {
        // Click login without filling anything
        await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();

        // Check for validation messages
        // Note: Ant Design validation messages usually appear in a div with role 'alert' or specific class
        await expect(page.getByText('Email không được để trống!')).toBeVisible();
        await expect(page.getByText('Mật khẩu không được để trống!')).toBeVisible();
    });

    test('should show error for invalid email format', async ({ page }) => {
        // Fill invalid email
        await page.getByPlaceholder('Email của bạn').fill('invalid-email');
        await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();

        // Expect format error
        await expect(page.getByText('Email không đúng định dạng!')).toBeVisible();
    });
});
