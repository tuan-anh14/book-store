import { test, expect } from '@playwright/test';

test.describe('Chức năng Quên mật khẩu', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/forgot-password');
    });

    test('TC-01: Nhập email rỗng', async ({ page }) => {
        // Leave Email empty
        await page.getByRole('button', { name: 'Gửi yêu cầu', exact: true }).click();

        await expect(page.getByText('Email không được để trống!')).toBeVisible();
    });

    test('TC-02: Nhập email không đúng định dạng', async ({ page }) => {
        await page.getByPlaceholder('Email của bạn').fill('admin.com');
        await page.getByRole('button', { name: 'Gửi yêu cầu', exact: true }).click();

        await expect(page.getByText('Email không đúng định dạng!')).toBeVisible();
    });

    test('TC-03: Email chưa đăng ký trong hệ thống', async ({ page }) => {
        // Mock API error response for non-existent email
        await page.route('**/api/v1/auth/forgot-password', async route => { // Verify api.ts: export const forgotPasswordAPI = (email: string) => ... "/api/v1/auth/forgot-password"
            const json = {
                message: "Email không tồn tại trong hệ thống",
                statusCode: 400
            };
            await route.fulfill({ status: 400, json });
        });

        await page.getByPlaceholder('Email của bạn').fill('pat@gmail.com');
        await page.getByRole('button', { name: 'Gửi yêu cầu', exact: true }).click();

        await expect(page.getByText('Email không tồn tại trong hệ thống')).toBeVisible();
    });

    test('TC-04: Email đã đăng ký trong hệ thống', async ({ page }) => {
        // Mock API success response
        await page.route('**/api/v1/auth/forgot-password', async route => {
            const json = {
                data: true,
                message: "Gửi email thành công"
            };
            await route.fulfill({ json });
        });

        await page.getByPlaceholder('Email của bạn').fill('admin@gmail.com');
        await page.getByRole('button', { name: 'Gửi yêu cầu', exact: true }).click();

        await expect(page.getByText('Vui lòng kiểm tra email của bạn để đặt lại mật khẩu!')).toBeVisible();
    });

    test('TC-05: Gửi yêu cầu nhiều lần liên tiếp', async ({ page }) => {
        // Mock API success response
        await page.route('**/api/v1/auth/forgot-password', async route => {
            const json = {
                data: true,
                message: "Gửi email thành công"
            };
            await route.fulfill({ json });
        });

        await page.getByPlaceholder('Email của bạn').fill('admin@gmail.com');

        // Click multiple times
        await page.getByRole('button', { name: 'Gửi yêu cầu', exact: true }).click();
        await expect(page.getByText('Vui lòng kiểm tra email của bạn để đặt lại mật khẩu!')).toBeVisible();

        // In a real e2e without reload, the form might stay or clear.
        // Assuming current logic just shows message.
        // If message is toast, it disappears. If page redirects, test fails.
        // Based on code: it shows messageApi.success but doesn't navigate away.

        // Wait a bit or click again
        await page.waitForTimeout(500); // Small wait
        await page.getByRole('button', { name: 'Gửi yêu cầu', exact: true }).click();

        // Expect success again
        // Note: Antd message might stack. Playwright finds by text.
        await expect(page.getByText('Vui lòng kiểm tra email của bạn để đặt lại mật khẩu!').first()).toBeVisible();
    });

    test('TC-06: Xử lý lỗi server', async ({ page }) => {
        // Mock API server error 500
        await page.route('**/api/v1/auth/forgot-password', async route => {
            const json = {
                message: "Có lỗi xảy ra!",
                statusCode: 500
            };
            await route.fulfill({ status: 500, json });
        });

        await page.getByPlaceholder('Email của bạn').fill('admin@gmail.com');
        await page.getByRole('button', { name: 'Gửi yêu cầu', exact: true }).click();

        await expect(page.getByText('Có lỗi xảy ra!')).toBeVisible();
    });

});
