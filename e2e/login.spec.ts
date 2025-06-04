import { test, expect, Page } from '@playwright/test';

// 攔截 /api/login，根據密碼決定回傳成功或失敗
const mockLoginRoute = async (page: Page) => {
  await page.route('**/auth/login', async (route, request) => {
    const postData = request.postDataJSON?.();
    if (postData?.password === 'password123') {
      // 模擬登入成功
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'mock-token', email: postData.email, name: 'Test User' }),
      });
    } else {
      // 模擬登入失敗
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: '帳號或密碼錯誤' }),
      });
    }
  });
};

test.describe('登入流程', () => {
  test('成功登入會導向 /boards', async ({ page }) => {
    await mockLoginRoute(page);
    await page.goto('/');
    await page.getByPlaceholder('電子郵件').fill('test@example.com');
    await page.getByPlaceholder('密碼').fill('password123');
    await page.getByRole('button', { name: /登入/i }).click();
    await expect(page).toHaveURL(/.*\/boards/);
  });

  test('帳號或密碼錯誤時顯示錯誤訊息', async ({ page }) => {
    await mockLoginRoute(page);
    await page.goto('/');
    await page.getByPlaceholder('電子郵件').fill('test@example.com');
    await page.getByPlaceholder('密碼').fill('wrongpassword');
    await page.getByRole('button', { name: /登入/i }).click();
    await expect(page.getByText('帳號或密碼錯誤')).toBeVisible();
  });
});
