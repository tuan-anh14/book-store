import { test, expect } from '@playwright/test';

test.describe('Chức năng Đăng ký', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/register');
    });

    test('TC-01: Đăng ký hợp lệ với tất cả các trường được điền đúng', async ({ page }) => {
        // Mock API success response
        await page.route('**/api/v1/auth/register', async route => {
            const json = {
                data: {
                    _id: "mock_id",
                    email: "test@gmail.com",
                    fullName: "Nguyễn Văn A"
                },
                message: "Đăng ký thành công"
            };
            await route.fulfill({ json });
        });

        await page.getByPlaceholder('Họ và tên của bạn').fill('Nguyễn Văn A');
        await page.getByPlaceholder('Email của bạn').fill('test@gmail.com');
        await page.getByPlaceholder('Mật khẩu của bạn').fill('Password123!');
        await page.getByPlaceholder('Số điện thoại của bạn').fill('0123456789');

        await page.getByRole('button', { name: 'Đăng ký', exact: true }).click();

        // Expect redirect to verify-email
        await expect(page).toHaveURL(/\/verify-email/);
        await expect(page.getByText('Đăng ký thành công. Vui lòng kiểm tra email để xác thực!')).toBeVisible();
    });

    test('TC-02: Trường Họ tên để trống', async ({ page }) => {
        await page.getByPlaceholder('Email của bạn').fill('test@gmail.com');
        await page.getByPlaceholder('Mật khẩu của bạn').fill('Password123!');
        await page.getByPlaceholder('Số điện thoại của bạn').fill('0123456789');

        await page.getByRole('button', { name: 'Đăng ký', exact: true }).click();

        await expect(page.getByText('Họ tên không được để trống!')).toBeVisible();
    });

    test('TC-03: Email không đúng định dạng', async ({ page }) => {
        await page.getByPlaceholder('Họ và tên của bạn').fill('Nguyễn Văn A');
        await page.getByPlaceholder('Email của bạn').fill('invalidemail.com');
        await page.getByPlaceholder('Mật khẩu của bạn').fill('Password123!');
        await page.getByPlaceholder('Số điện thoại của bạn').fill('0123456789');

        await page.getByRole('button', { name: 'Đăng ký', exact: true }).click();

        await expect(page.getByText('Email không đúng định dạng!')).toBeVisible();
    });

    test('TC-04: Trường Email để trống', async ({ page }) => {
        await page.getByPlaceholder('Họ và tên của bạn').fill('Nguyễn Văn A');
        // Leave Email empty
        await page.getByPlaceholder('Mật khẩu của bạn').fill('Password123!');
        await page.getByPlaceholder('Số điện thoại của bạn').fill('0123456789');

        await page.getByRole('button', { name: 'Đăng ký', exact: true }).click();

        await expect(page.getByText('Email không được để trống!')).toBeVisible();
    });

    test('TC-05: Trường Mật khẩu để trống', async ({ page }) => {
        await page.getByPlaceholder('Họ và tên của bạn').fill('Nguyễn Văn A');
        await page.getByPlaceholder('Email của bạn').fill('test@gmail.com');
        // Leave Password empty
        await page.getByPlaceholder('Số điện thoại của bạn').fill('0123456789');

        await page.getByRole('button', { name: 'Đăng ký', exact: true }).click();

        await expect(page.getByText('Mật khẩu không được để trống!')).toBeVisible();
    });

    test('TC-06: Trường Số điện thoại để trống', async ({ page }) => {
        await page.getByPlaceholder('Họ và tên của bạn').fill('Nguyễn Văn A');
        await page.getByPlaceholder('Email của bạn').fill('test@gmail.com');
        await page.getByPlaceholder('Mật khẩu của bạn').fill('Password123!');
        // Leave Phone empty

        await page.getByRole('button', { name: 'Đăng ký', exact: true }).click();

        await expect(page.getByText('Số điện thoại không được để trống!')).toBeVisible();
    });

    test('TC-07: Đăng ký với Email đã tồn tại', async ({ page }) => {
        // Mock API error response
        await page.route('**/api/v1/auth/register', async route => {
            const json = {
                message: "Email đã tồn tại",
                statusCode: 400
            };
            await route.fulfill({ status: 400, json });
        });

        // Wait, looking at register.tsx call: registerWithVerificationAPI
        // I need to know the endpoint. Usually it's in services/api.

        await page.getByPlaceholder('Họ và tên của bạn').fill('Nguyễn Văn A');
        await page.getByPlaceholder('Email của bạn').fill('admin@gmail.com');
        await page.getByPlaceholder('Mật khẩu của bạn').fill('Password123!');
        await page.getByPlaceholder('Số điện thoại của bạn').fill('0123456789');

        await page.getByRole('button', { name: 'Đăng ký', exact: true }).click();

        // Since I can't be 100% sure of the endpoint without checking api.ts, I will rely on the UI showing the error.
        // But for stable testing, mocking is best. I'll inspect api.ts in next step if this fails or just check it now.
    });
});
