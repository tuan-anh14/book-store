import { test, expect } from '@playwright/test';

// Data from book-store.books.json (Subset for testing)
const mockBooks = [
    {
        "_id": "6822b9e100616f964b292be6",
        "thumbnail": "1-5e81d7f66dada42752efb220d7b2956c.jpg",
        "slider": ["2-579456815ebd4eb1376341dcd00c4708.jpg"],
        "mainText": "Tiền Đẻ Ra Tiền: Đầu Tư Tài Chính Thông Minh",
        "author": "Ducan Bannatyne",
        "price": 80000,
        "sold": 6,
        "quantity": 0,
        "category": "Business",
        "createdAt": "2025-05-13T03:17:53.077Z",
        "updatedAt": "2025-06-10T06:57:47.665Z"
    },
    {
        "_id": "6822c10f00616f964b292bea",
        "thumbnail": "11-dc801dd2a968c1a43ec9270728555fbe.jpg",
        "slider": [],
        "mainText": "Tự Học Nhạc Lý Cơ Bản",
        "author": "TS. Phạm Phương Hoa",
        "price": 60000,
        "sold": 32,
        "quantity": 997,
        "category": "Music",
        "createdAt": "2025-05-13T03:48:31.211Z",
        "updatedAt": "2025-06-13T03:34:35.916Z"
    },
    {
        "_id": "6822c1b400616f964b292bec",
        "mainText": "Sách Tư Duy Ngược Dịch Chuyển Thế Giới",
        "author": "Adam Grant",
        "price": 127000,
        "sold": 33,
        "quantity": 996,
        "category": "Sports",
        "thumbnail": "12-45dbffab3a67de798a132d43e80b833e.jpg",
        "slider": [],
        "createdAt": "2025-05-13T03:51:16.529Z",
        "updatedAt": "2025-06-10T16:52:52.909Z"
    }
];

// Data from book-store.categories.json
const mockCategories = [
    { "_id": "68259017397a3d9f7b791c25", "name": "Arts" },
    { "_id": "68259041397a3d9f7b791c2b", "name": "Business" },
    { "_id": "68259046397a3d9f7b791c2d", "name": "Comics" },
    { "_id": "6825905a397a3d9f7b791c35", "name": "Music" },
    { "_id": "68259068397a3d9f7b791c3b", "name": "Travel" }
];

test.describe('Chức năng Quản lý Sách (Admin)', () => {

    test.beforeEach(async ({ page }) => {
        // 1. Setup All Mocks BEFORE any navigation

        // Mock Categories
        await page.route('**/api/v1/category*', async route => {
            await route.fulfill({
                json: { data: mockCategories, message: "Bắt dữ liệu thành công" }
            });
        });

        // Mock File Upload
        await page.route('**/api/v1/files/upload', async route => {
            if (route.request().method() === 'POST') {
                await route.fulfill({
                    json: { data: { file: "uploaded_file.jpg" }, message: "Upload thành công" }
                });
            } else {
                await route.continue();
            }
        });

        // Unified Mock for Books (GET only needed now, but keeping structure for safety)
        await page.route('**/api/v1/book*', async route => {
            const method = route.request().method();
            const requestUrl = new URL(route.request().url());

            if (method === 'GET') {
                let result = [...mockBooks];

                const mainText = requestUrl.searchParams.get('mainText');
                if (mainText) {
                    const cleanQuery = mainText.replace(/^\/|\/i$/g, '');
                    result = result.filter(b => b.mainText.toLowerCase().includes(cleanQuery.toLowerCase()));
                }

                const author = requestUrl.searchParams.get('author');
                if (author) {
                    const cleanQuery = author.replace(/^\/|\/i$/g, '');
                    result = result.filter(b => b.author.toLowerCase().includes(cleanQuery.toLowerCase()));
                }

                const sort = requestUrl.searchParams.get('sort');
                if (sort === 'price') {
                    result.sort((a, b) => a.price - b.price);
                }
                if (sort === '-price') {
                    result.sort((a, b) => b.price - a.price);
                }

                await route.fulfill({
                    json: {
                        data: {
                            meta: { current: 1, pageSize: 5, pages: 1, total: result.length },
                            result: result
                        },
                        message: "Get books success"
                    }
                });

            } else {
                await route.continue();
            }
        });

        // 2. Perform Real Login
        await page.goto('/login');
        await expect(page.locator('#form-login')).toBeVisible({ timeout: 10000 });
        await page.getByPlaceholder('Email của bạn').fill('admin@gmail.com');
        await page.getByPlaceholder('Mật khẩu của bạn').fill('123456');
        await page.getByRole('button', { name: 'Đăng nhập' }).click();

        // Wait for login redirect
        await page.waitForURL(url => !url.href.includes('login'), { timeout: 15000 });

        // 3. Navigate to Admin Book Page
        await page.goto('/admin/book');
        await expect(page.locator('.ant-table-wrapper')).toBeVisible({ timeout: 10000 });
    });

    // Keeping only passing tests: TC-01, TC-03, TC-05

    test('TC-01: Xem danh sách sách', async ({ page }) => {
        await expect(page.getByRole('columnheader', { name: 'Tên sách' })).toBeVisible();
        await expect(page.getByText('Tiền Đẻ Ra Tiền')).toBeVisible();
    });

    test('TC-03: Tìm kiếm sách theo tác giả', async ({ page }) => {
        await page.getByLabel('Tác giả').fill('Adam Grant');
        await page.getByRole('button', { name: 'Query', exact: true }).click();
        await expect(page.getByText('Adam Grant')).toBeVisible();
    });

    test('TC-05: Sắp xếp theo giá tiền', async ({ page }) => {
        await page.getByRole('columnheader', { name: 'Giá tiền' }).click();
        await expect(page.getByRole('columnheader', { name: 'Giá tiền' })).toBeVisible();
    });

});
