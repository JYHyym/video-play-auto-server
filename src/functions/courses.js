
const getCourses = async (page, link) => {
  // const page = await browser.newPage()
  
  await page.getByRole('button', { name: '我的课程' }).click();
  // await page.getByText('第二学期').click();
  // await page.locator('div').filter({ hasText: /^计算机基础完成学分：0%思想道德修养与法律基础完成学分：0%企业连锁经营与管理完成学分：0%现代物流管理完成学分：0%$/ }).locator('img').first().click();
  await page.getByText('第三学期').click();

  await page.locator('div').filter({ hasText: /^基础英语完成学分：84%$/ }).first().click()
  // await page.getByText('第二学期').click();
  // await page.locator('div').filter({ hasText: /^计算机基础完成学分：0%思想道德修养与法律基础完成学分：0%企业连锁经营与管理完成学分：0%现代物流管理完成学分：0%$/ }).locator('img').first().click();
  await page.locator('.kecehng_gi_box > div:nth-child(2)').click();
  
}

module.exports = getCourses