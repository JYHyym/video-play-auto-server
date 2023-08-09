const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://menhu.pt.ouchn.cn/site/ouchnPc/index');
  await page.goto('https://iam.pt.ouchn.cn/am/UI/Login?realm=%2F&service=initService&goto=https%3A%2F%2Fiam.pt.ouchn.cn%2Fam%2Foauth2%2Fauthorize%3Fservice%3DinitService%26response_type%3Dcode%26client_id%3D345fcbaf076a4f8a%26scope%3Dall%26redirect_uri%3Dhttps%253A%252F%252Fmenhu.pt.ouchn.cn%252Fouchnapp%252Fwap%252Flogin%252Findex%26decision%3DAllow');
  await page.locator('p').filter({ hasText: '请输入登录名' }).click();
  await page.getByPlaceholder('请输入登录名').click();
  await page.getByPlaceholder('请输入登录名').fill('2241001208072');
  await page.getByPlaceholder('请输入登录密码').click();
  await page.getByPlaceholder('请输入登录密码').fill('Ouchn@2021');
  await page.getByPlaceholder('请输入验证码').click();
  await page.getByPlaceholder('请输入验证码').fill('4156');
  await page.getByRole('button', { name: '登录' }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.locator('li').filter({ hasText: '管理思想史 课程代码：53720 | 课程状态： 正在进行 | 开课时间： 2023年02月05日 选课学生：704 人 | 资料：0 个 | 形考作业：3/3' }).getByRole('progressbar').click();
  const page1 = await page1Promise;
  await page1.getByRole('checkbox').check();
  await page1.locator('#module-60000269104 a').click();
  await page1.locator('#module-60000203369 a').click();
  await page1.locator('#learning-activity-60002217352 div').filter({ hasText: '页面 | 省校公告' }).nth(3).click();
  await page1.locator('a').filter({ hasText: '显示基本信息' }).click();
  await page1.locator('full-screen-mode-sidebar div').filter({ hasText: '学习资源' }).nth(2).click();
  await page1.locator('span').filter({ hasText: '《管理思想史》(本) 第01讲' }).click();
  const page2Promise = page1.waitForEvent('popup');
  const downloadPromise = page1.waitForEvent('download');
  await page1.getByRole('link', { name: ' 新页签打开' }).click();
  const page2 = await page2Promise;
  const download = await downloadPromise;
  await page2.close();
  await page1.locator('span').filter({ hasText: '《管理思想史》(本) 第02讲' }).click();
  const page3Promise = page1.waitForEvent('popup');
  const download1Promise = page1.waitForEvent('download');
  await page1.getByRole('link', { name: ' 新页签打开' }).click();
  const page3 = await page3Promise;
  const download1 = await download1Promise;
  await page3.close();
  await page1.locator('span').filter({ hasText: '管理思想史复习（一）' }).click();
  await page1.getByText('查看').click();
  await page1.frameLocator('#pdf-viewer').getByRole('button', { name: '下一页' }).click();

  // ---------------------
  await context.close();
  await browser.close();
})();

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://menhu.pt.ouchn.cn/site/ouchnPc/index');
  await page.goto('https://iam.pt.ouchn.cn/am/UI/Login?realm=%2F&service=initService&goto=https%3A%2F%2Fiam.pt.ouchn.cn%2Fam%2Foauth2%2Fauthorize%3Fservice%3DinitService%26response_type%3Dcode%26client_id%3D345fcbaf076a4f8a%26scope%3Dall%26redirect_uri%3Dhttps%253A%252F%252Fmenhu.pt.ouchn.cn%252Fouchnapp%252Fwap%252Flogin%252Findex%26decision%3DAllow');
  await page.locator('p').filter({ hasText: '请输入登录名' }).click();
  await page.getByPlaceholder('请输入登录名').click();
  await page.getByPlaceholder('请输入登录名').fill('2241001208072');
  await page.getByPlaceholder('请输入登录密码').click();
  await page.getByPlaceholder('请输入登录密码').fill('Ouchn@2021');
  await page.getByPlaceholder('请输入验证码').click();
  await page.getByPlaceholder('请输入验证码').fill('4156');
  await page.getByRole('button', { name: '登录' }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.locator('li').filter({ hasText: '管理思想史 课程代码：53720 | 课程状态： 正在进行 | 开课时间： 2023年02月05日 选课学生：704 人 | 资料：0 个 | 形考作业：3/3' }).getByRole('progressbar').click();
  const page1 = await page1Promise;
  await page1.getByRole('checkbox').check();
  await page1.locator('#module-60000269104 a').click();
  await page1.locator('#module-60000203369 a').click();
  await page1.locator('#learning-activity-60002217352 div').filter({ hasText: '页面 | 省校公告' }).nth(3).click();
  await page1.locator('a').filter({ hasText: '显示基本信息' }).click();
  await page1.locator('full-screen-mode-sidebar div').filter({ hasText: '学习资源' }).nth(2).click();
  await page1.locator('span').filter({ hasText: '《管理思想史》(本) 第01讲' }).click();
  const page2Promise = page1.waitForEvent('popup');
  const downloadPromise = page1.waitForEvent('download');
  await page1.getByRole('link', { name: ' 新页签打开' }).click();
  const page2 = await page2Promise;
  const download = await downloadPromise;
  await page2.close();
  await page1.locator('span').filter({ hasText: '《管理思想史》(本) 第02讲' }).click();
  const page3Promise = page1.waitForEvent('popup');
  const download1Promise = page1.waitForEvent('download');
  await page1.getByRole('link', { name: ' 新页签打开' }).click();
  const page3 = await page3Promise;
  const download1 = await download1Promise;
  await page3.close();
  await page1.locator('span').filter({ hasText: '管理思想史复习（一）' }).click();
  await page1.getByText('查看').click();
  await page1.frameLocator('#pdf-viewer').getByRole('button', { name: '下一页' }).click();
  await page1.locator('#file-previewer a').first().click();
  await page1.locator('span').filter({ hasText: '《管理思想史》(本) 第05讲' }).click();
  const page4Promise = page1.waitForEvent('popup');
  const download2Promise = page1.waitForEvent('download');
  await page1.getByRole('link', { name: ' 新页签打开' }).click();
  const page4 = await page4Promise;
  const download2 = await download2Promise;
  await page4.close();
  const page5 = await context.newPage();
  await page5.goto('chrome://downloads/');
  await page5.getByTitle('C:\\Users\\cnic\\AppData\\Local\\Temp\\playwright-artifacts-UIvqFN\\8d477b8a-9aa7-4651-b1ed-b0fd2a29e68a').click();
  const page6Promise = page5.waitForEvent('popup');
  const download3Promise = page5.waitForEvent('download');
  await page5.getByRole('link', { name: 'http://vod.open.ha.cn/kfkt/glsxsb/glsxsb05.wmv' }).click();
  const page6 = await page6Promise;
  const download3 = await download3Promise;
  await page6.close();
  await page1.getByRole('link', { name: ' 返回课程' }).click();
  await page1.locator('#learning-activity-60002241786').getByText('查看文件').click();
  await page1.getByText('参考题十四 .docx').click();
  await page1.locator('#file-previewer-with-note > .popup-content > .pdf-reader-detail > .header > .right').click();
  await page1.getByRole('link', { name: '我的课程' }).click();
  await page1.locator('#academic-year-select_ms').click();
  await page1.getByLabel('2022-2023', { exact: true }).check();
  await page1.getByRole('link', { name: '首页' }).click();
  await page1.getByRole('link', { name: '我的主页 ' }).click();
  await page1.locator('a').filter({ hasText: /^我的课程$/ }).click();
  await page1.getByText('公司概论 2022-2023第2学期 查看课程介绍 完成度: 89.2% 课程代码: 202303-00523410 开课: 2023-02-05').click();
  await page1.locator('#module-60000193100 a').first().click();
  await page1.locator('#module-60000193134 a').click();
  await page1.locator('#learning-activity-60001597620 div').filter({ hasText: '音视频教材 | 企业集团 影片长度 00:27:52' }).nth(3).click();
  await page1.getByText('企业集团 笔记 当前视频无法支持直接播放，请等待转码完成 还没有任何笔记 添加一条笔记... 00:00 取消 保存 上一个 下一个').click();
  await page1.getByRole('application').click();
  await page1.getByRole('button', { name: '下一个 ' }).click();
  await page1.getByRole('button', { name: '下一个 ' }).click();
  await page1.getByRole('button', { name: '下一个 ' }).click();
  await page1.getByRole('button', { name: '下一个 ' }).click();
  await page1.getByRole('button', { name: '下一个 ' }).click();
  await page1.getByRole('button', { name: '下一个 ' }).click();

  // ---------------------
  await context.close();
  await browser.close();
})();