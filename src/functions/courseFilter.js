// TODO 对课程进度筛选分类：课程进度不为100%的，为100%，未完成，已完成等状态。
const courseProcessFilter = async (page, page1Promise, link) => {
  switch (link) {
    // 国开
    case 'https://menhu.pt.ouchn.cn/':
      // 调用页面的evaluate方法，并将方法和参数传递给它
      // const filterElements = await page.locator('li').filter({ hasText: '92.7%'})  
      // console.log('filterElements===>', filterElements)
      // const page1 = await pagePromise;
      // await page1.getByRole('checkbox').check();
      // const result = await filterElements.evaluate(menhuPTOuchn, filterElements); // 将获取到的ul标签信息作为参数传递给方法

      // console.log('arrFinish:', result.arrFinish);
      // console.log('arrNotFinish:', result.arrNotFinish);
      
      const filterElements = await page.locator('li').filter({ hasText: '89.2%' })
      filterElements.getByRole('progressbar').click()
      console.log('filterElements===>', filterElements)
      const page1 = await page1Promise;
      await page1.getByRole('checkbox').check()

      break
    default:
      break
  }
}

const menhuPTOuchn = async (elements) => {
  // 将获取到的ul标签信息作为参数传递给方法
    const arrFinish = [];
    const arrNotFinish = [];

    const ulElement = document.createElement('ul');
    ulElement.innerHTML = elements;

    const liElements = ulElement.querySelectorAll('li');
    liElements.forEach(li => {
      const progressText = li.querySelector('.el-progress__text').innerText;
      const courseName = li.querySelector('.learning_course').innerText.trim();

      if (progressText.includes('100')) {
        arrFinish.push({ courseName, html: li.innerHTML });
      } else {
        arrNotFinish.push({ courseName, html: li.innerHTML });
      }
    });

  return { arrFinish, arrNotFinish };

}

module.exports = courseProcessFilter