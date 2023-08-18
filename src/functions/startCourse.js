// const { browser } = require('./login.js')

// TODO 开始刷课
const startCourse = async ($page, courseElList, link) => {
  switch (link) {
    // 国开
    case 'https://menhu.pt.ouchn.cn/':
      console.log('currentUrl', $page)
      const currentUrl = await $page.url()
      console.log(currentUrl)
      if(await $page.url() === 'https://menhu.pt.ouchn.cn/site/ouchnPc/index') {
        // await courseProcessFilter(page, page1Promise, link)
        // 点击某节课程，跳转页面
        // await page.locator('li').filter({ hasText: '管理思想史 课程代码：53720 | 课程状态： 正在进行 | 开课时间： 2023年02月05日 选课学生：704 人 | 资料：0 个 | 形考作业：3/3' }).getByRole('progressbar').click();
        // const page1 = await page1Promise;
        // await page1.getByRole('checkbox').check();

        // 进度不为100%的课程
        const filterCount = await courseElList.count() 
        // let courseListInfo = [] // courseList: [{courseName: '形式与政策', process:'89.0%'}]

        // for (let i = 0; i < filterCount; i++) {
        //   // await courseElList.nth(i).locator('.learning_course').textContent()
        //   // 上面拿到的值为'\n                     管理思想史\n                  '格式，需去掉\n和空格
        //   const cnTextContent = await courseElList.nth(i).locator('.learning_course').textContent() 
        //   const proTextContent = await courseElList.nth(i).locator('.el-progress__text').textContent()

        //   courseListInfo.push({
        //     courseName: cnTextContent.trim().replace(/\n/g, ''),
        //     process: proTextContent.trim().replace(/\n/g, '')
        //   })
        // }
        const itemCosePageProm = $page.waitForEvent('popup')
        console.log(await courseElList.nth(0))
        if(await $page.url() === 'https://menhu.pt.ouchn.cn/site/ouchnPc/index') {
          await courseElList.nth(0).locator('.learning_course').click()
        }
        const page1 = await itemCosePageProm

        // await page1.locator('#course-section').click() // 展开所有课程
        await page1.getByRole('checkbox').check() // 筛选未完成课程

        //  TODO 获取不到元素 获取单节课元素列表
        const lessonElList = await page.locator('a.title.ng-binding.ng-scope') // 'div.learning-activity.ng-scope[id^="learning-activity-"]'
        const lessonCount = await lessonElList.count()

        for(let i = 0; i < lessonCount; i++) {
          setTimeout(async() => {
            await lessonElList.nth(i).click()
          }, 1000)
        }

        return {
          msg: '刷课中！',
          code: 1
        }
        // 获取当前页所有
        // return { courseElList, courseListInfo }
      }

      break
    default:
      break
  }
}

module.exports = { startCourse }