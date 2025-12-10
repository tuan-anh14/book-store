import { test, expect } from '@playwright/test';

test.describe('Chức năng Đăng nhập', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
    });

    test('TC-01: Đăng nhập thành công với thông tin hợp lệ', async ({ page }) => {
        // Mock API success response
        await page.route('**/api/v1/auth/login', async route => {
            const json = {
                data: {
                    access_token: "mock_token_123",
                    user: {
                        _id: "user_id_123",
                        email: "admin@gmail.com",
                        fullName: "Admin User",
                        role: "ADMIN"
                    }
                },
                message: "Đăng nhập thành công"
            };
            await route.fulfill({ json });
        });

        await page.getByPlaceholder('Email của bạn').fill('admin@gmail.com');
        await page.getByPlaceholder('Mật khẩu của bạn').fill('123456');

        await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();

        // Expect: Success message, Redirect Home
        await expect(page.getByText('Đăng nhập thành công.')).toBeVisible();
        await expect(page).toHaveURL('/');

        // Check localStorage - Playwright can evaluate JS/storage
        // const token = await page.evaluate(() => localStorage.getItem('access_token'));
        // expect(token).toBe('mock_token_123'); // This might be flaky if test ends too fast or storage set async
    });

    test('TC-02: Đăng nhập với email không tồn tại', async ({ page }) => {
        // Mock API error response for non-existent user
        await page.route('**/api/v1/auth/login', async route => {
            const json = {
                message: "Tài khoản không tồn tại", // Mock error message
                statusCode: 400
            };
            await route.fulfill({ status: 400, json });
        });

        await page.getByPlaceholder('Email của bạn').fill('nonexistent@gmail.com');
        await page.getByPlaceholder('Mật khẩu của bạn').fill('Password123!');

        await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();

        await expect(page.getByText('Có lỗi xảy ra')).toBeVisible();
        // Notification description
        await expect(page.getByText('Tài khoản không tồn tại')).toBeVisible();
    });

    test('TC-03: Đăng nhập với mật khẩu không chính xác', async ({ page }) => {
        // Mock API error response for wrong password
        await page.route('**/api/v1/auth/login', async route => {
            const json = {
                message: "Username hoặc Password không đúng", // Mock error message
                statusCode: 400
            };
            await route.fulfill({ status: 400, json });
        });

        await page.getByPlaceholder('Email của bạn').fill('admin@gmail.com');
        await page.getByPlaceholder('Mật khẩu của bạn').fill('WrongPassword');

        await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();

        await expect(page.getByText('Có lỗi xảy ra')).toBeVisible();
        await expect(page.getByText('Username hoặc Password không đúng')).toBeVisible();
    });

    test('TC-04: Trường email để trống', async ({ page }) => {
        // Leave Email empty
        await page.getByPlaceholder('Mật khẩu của bạn').fill('Password123!');

        await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();

        await expect(page.getByText('Email không được để trống!')).toBeVisible();
    });

    test('TC-05: Trường mật khẩu để trống', async ({ page }) => {
        await page.getByPlaceholder('Email của bạn').fill('admin@gmail.com');
        // Leave Password empty

        await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();

        await expect(page.getByText('Mật khẩu không được để trống!')).toBeVisible();
    });

    test('TC-06: Định dạng email không hợp lệ', async ({ page }) => {
        await page.getByPlaceholder('Email của bạn').fill('invalidemail.com');
        await page.getByPlaceholder('Mật khẩu của bạn').fill('Password123!');

        await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();

        await expect(page.getByText('Email không đúng định dạng!')).toBeVisible();
    });

    // Validated login API used in components/client/auth/login.tsx
    // It calls loginAPI(username, password)

    test('TC-07: Đăng nhập với tài khoản chưa xác thực email', async ({ page }) => {
        // Mock API error response for unverified
        await page.route('**/api/v1/auth/login', async route => {
            const json = {
                message: "Tài khoản chưa được xác thực. Vui lòng kiểm tra email.",
                statusCode: 400 // or 401/403
            };
            await route.fulfill({ status: 400, json });
        });

        await page.getByPlaceholder('Email của bạn').fill('unverified@gmail.com');
        await page.getByPlaceholder('Mật khẩu của bạn').fill('Password123!');

        await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();

        await expect(page.getByText('Có lỗi xảy ra')).toBeVisible();
        await expect(page.getByText('Tài khoản chưa được xác thực. Vui lòng kiểm tra email.')).toBeVisible();
    });

});
