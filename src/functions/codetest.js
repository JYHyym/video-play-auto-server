const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('http://smlyzyxy.hnzkw.org.cn/');
  await page.goto('http://smlyzyxy.hnzkw.org.cn/#/');
  await page.goto('http://smlyzyxy.hnzkw.org.cn/#/login');
  await page.getByPlaceholder('请输入账号').click();
  await page.getByPlaceholder('请输入账号').fill('410182198911042571');
  await page.getByPlaceholder('请输入密码').click();
  await page.getByPlaceholder('请输入密码').fill('111111');
  await page.locator('form').getByText('登 录').click();
  await page.locator('div').filter({ hasText: /^向右滑动完成验证$/ }).nth(2).click();
  await page.getByText('向右滑动完成验证').click();
  await page.locator('.verify-move-block').click();
  await page.getByText('向右滑动完成验证').click();
  await page.locator('div').filter({ hasText: /^向右滑动完成验证$/ }).nth(2).click();
  await page.locator('img').nth(3).click();
  await page.locator('div').filter({ hasText: /^向右滑动完成验证$/ }).nth(2).click();
  await page.locator('img').nth(3).click();
  await page.locator('div').filter({ hasText: '请完成安全验证 向右滑动完成验证' }).nth(3).click({
    button: 'right'
  });
  await page.locator('div').filter({ hasText: /^向右滑动完成验证$/ }).first().click();
  await page.getByText('向右滑动完成验证').click();
  await page.locator('div').filter({ hasText: /^向右滑动完成验证$/ }).nth(2).click();
  await page.locator('img').nth(3).click();
  await page.locator('form').getByText('登 录').click();

  // ---------------------
  await context.storageState({ path: 'auth.json' });
  await context.close();
  await browser.close();
})();