const { browser, $page } = require('../functions/login.js')

// TODO 对课程进度筛选分类：课程进度不为100%的，为100%，未完成，已完成等状态。\
// TODO 课程列表及进度
const courseList = async ($page, link) => {
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
      
      // const filterElements = await page.locator('li').filter({ hasText: '89.2%' })
      // filterElements.getByRole('progressbar').click()
      // console.log('filterElements===>', filterElements)
      // const page1 = await page1Promise;
      // await page1.getByRole('checkbox').check()

      if(await $page.url() === 'https://menhu.pt.ouchn.cn/site/ouchnPc/index') {
        // const page1Promise = $page.waitForEvent('popup');

        // 检查是否有弹框，有则关闭
        const closeSelector = 'body > div:nth-child(1) > div.ouchnPc_index_advertisement > img.cloneImg'
        const nodeClose = await $page.$(closeSelector)
        console.log('nodeClose：', nodeClose)
        
        if(nodeClose) {
          await $page.click(closeSelector)
        }

        // await courseProcessFilter(page, page1Promise, link)
        // 点击某节课程，跳转页面
        // await page.locator('li').filter({ hasText: '管理思想史 课程代码：53720 | 课程状态： 正在进行 | 开课时间： 2023年02月05日 选课学生：704 人 | 资料：0 个 | 形考作业：3/3' }).getByRole('progressbar').click();
        // const page1 = await page1Promise;
        // await page1.getByRole('checkbox').check();

        // 过滤学习进度不为100%的课程
        const courseElList = await $page.locator('li')
        .filter({ hasText: '学习进度' })
        .filter({ hasNotText: '100.0%' })
        const filterCount = await courseElList.count()
        let courseListInfo = [] // courseList: [{courseName: '形式与政策', process:'89.0%'}]
        console.log('filterCount:===>', filterCount, courseElList,await courseElList.count())

        for (let i = 0; i < filterCount; i++) {
          // await courseElList.nth(i).locator('.learning_course').textContent()
          // 上面拿到的值为'\n                     管理思想史\n                  '格式，需去掉\n和空格
          const cnTextContent = await courseElList.nth(i).locator('.learning_course').textContent() 
          const proTextContent = await courseElList.nth(i).locator('.el-progress__text').textContent()

          courseListInfo.push({
            courseName: cnTextContent.trim().replace(/\n/g, ''),
            process: proTextContent.trim().replace(/\n/g, '')
          })
        }
        console.log('courseListInfo:===>', courseListInfo)

        // const processedCourseListInfo = courseListInfo.map(item => {
        //   const courseName = item.courseName.trim().replace(/\n/g, '')
        //   const process = item.process.trim().replace(/\n/g, '')
        //   return {
        //     courseName,
        //     process
        //   }
        // })

        return { courseElList, courseListInfo }
      }

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

module.exports = { courseList }