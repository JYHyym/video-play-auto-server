const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://menhu.pt.ouchn.cn/site/ouchnPc/index');
  await page.goto('https://iam.pt.ouchn.cn/am/UI/Login?realm=%2F&service=initService&goto=https%3A%2F%2Fiam.pt.ouchn.cn%2Fam%2Foauth2%2Fauthorize%3Fservice%3DinitService%26response_type%3Dcode%26client_id%3D345fcbaf076a4f8a%26scope%3Dall%26redirect_uri%3Dhttps%253A%252F%252Fmenhu.pt.ouchn.cn%252Fouchnapp%252Fwap%252Flogin%252Findex%26decision%3DAllow');
  await page.getByPlaceholder('请输入登录名').click();
  await page.getByPlaceholder('请输入登录名').click();
  await page.getByPlaceholder('请输入登录名').fill('2141001469329');
  await page.getByPlaceholder('请输入登录密码').click();
  await page.getByPlaceholder('请输入登录密码').fill('Ouchn@2021');
  await page.getByPlaceholder('请输入验证码').click();
  await page.getByPlaceholder('请输入验证码').fill('0934');
  await page.getByPlaceholder('请输入验证码').press('Enter');
  await page.getByText('已学课程').click();
  const page1Promise = page.waitForEvent('popup');
  await page.locator('li').filter({ hasText: '商务英语1 课程代码：04009 | 课程状态： 已截止 | 开课时间： 2022年08月05日 选课学生：3060 人 去学习 随堂测试 开始： 截止： 课程' }).getByRole('link').click();
  const page1 = await page1Promise;
  await page1.locator('#course-section').click();
  await page1.locator('#learning-activity-60000967885 div').filter({ hasText: '页面 | 概要' }).nth(3).click();
  await page1.getByRole('link', { name: ' 返回课程' }).click();
  // await page.locator('div.learning-activity.ng-scope[id^="learning-activity-"]')
  await page1.locator('#learning-activity-60000967886 > .clickable-area > .activity-summary > .activity-container > .activity-header').click();
  await page1.getByRole('link', { name: ' 返回课程' }).click();
  await page1.locator('#learning-activity-60000967888 div').filter({ hasText: '页面 | 学什么' }).nth(3).click({
    button: 'right'
  });
  await page1.locator('#learning-activity-60000967889 div').filter({ hasText: '参考资料 | 内容细目表 最后更新时间: 2022.09.09 16:38 查看文件 未完成完成指标：观看或下载所有参考资料附件 /zyzx/video/ner' }).first().click();
  await page1.getByRole('link', { name: ' 返回课程' }).click();
  await page1.locator('#learning-activity-60000967889 div').filter({ hasText: '参考资料 | 内容细目表 最后更新时间: 2022.09.09 16:38 查看文件 部分完成完成指标：观看或下载所有参考资料附件 /zyzx/video/ne' }).first().click();
  await page1.getByText('查看').click();
  const page2Promise = page.waitForEvent('popup');
  await page.locator('li').filter({ hasText: '商务英语1 课程代码：04009 | 课程状态： 已截止 | 开课时间： 2022年08月05日 选课学生：3060 人 去学习 随堂测试 开始： 截止： 课程' }).getByRole('link').click();
  const page2 = await page2Promise;

  // ---------------------
  await context.close();
  await browser.close();
})();