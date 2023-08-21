// const { browser } = require('./login.js')

// TODO 开始刷课
const startCourse = async ($page, courseElList, link) => {
  switch (link) {
    // 国开
    case 'https://menhu.pt.ouchn.cn/':
      // console.log('currentUrl', $page)
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
        // console.log(await courseElList.nth(0))
        // 点击一门课程（进入选中的课程列表）
        if(await $page.url() === 'https://menhu.pt.ouchn.cn/site/ouchnPc/index') {
          // const expandSelector = '.learning_course'
          // const expandXPath = await $page.locator(expandSelector)
          await courseElList.nth(0).locator('.learning_course').click()
        }
        const page1 = await itemCosePageProm

        // await page1.locator('#course-section').click() // 展开所有课程
        // const defaultExpandedValue = await page.getAttribute('#course-section', 'default-expanded')
        // if(defaultExpandedValue)
        if(await page1.locator('#course-section span').textContent() === '全部展开'){
          await page1.locator('#course-section').click()
        }
        // 获取所有课程时间较长，需等待一段时间
        setTimeout(async ()=> {
          // await page1.getByRole('checkbox').check() // 筛选未完成课程


          //  TODO 获取单节课元素列表(未开始或学习一部分的课)
          const lessonElList = await page1.locator('div.completeness.none, div.completeness.part')
          // const lessonElList = await page1.locator('a.title.ng-binding.ng-scope') // 'div.learning-activity.ng-scope[id^="learning-activity-"]' // a.title.ng-binding.ng-scope
          const lessonCount = await lessonElList.count()

          // await lessonElList.nth(0).click()
          

          // page1.on('framenavigated', async (frame) => {
          //   const mynewURL = await frame.url()
          //   const currentUrl = await page1.url()

          //   if(mynewURL === currentUrl && currentUrl.includes('https://lms.ouchn.cn/course')) {
          //     // 等待页面导航完成
          //     await frame.waitForURL(currentUrl)
          //     // 执行鼠标滚轮滚动到底部
          //     await page1.evaluate(() => {
          //       window.scrollTo(0, document.body.scrollHeight)
          //     })

          //     const buttonSelector = 'button.next-btn.ivu-btn.ivu-btn-default'
          //     const buttonNode = await page1.locator(buttonSelector)

          //     try {
          //       setTimeout(async () => {
          //         await buttonNode.waitFor({ state: 'visible', timeout: 5000 })
          //         // await buttonNode.waitForElementState('enabled')
          //         await buttonNode.click()
          //       }, 3000)
          //     } catch (error) {
                
          //     }

          //     // setTimeout(async () => {
          //     //   const nextBtn = await page1.$(buttonSelector)
          //     //   if(nextBtn) {
          //     //     nextBtn.click()
          //     //   }
          //     // }, 3000)
             
          //   }
          // })

          const currentUrl = await page1.url()
          for(let i = 0; i < lessonCount; i++) {
            // setTimeout(async() => {
            //   await page1.waitForURL(currentUrl)
            //   if(currentUrl.includes('https://lms.ouchn.cn/course') && !currentUrl.includes('learning-activity')) {
            //     await lessonElList.nth(i).click()
            //   }
            //   // 执行鼠标滚轮滚动到底部
            //   await page1.evaluate(() => {
            //     window.scrollTo(0, document.body.scrollHeight)
            //   })

            //   await page1.getByRole('link', { name: ' 返回课程' }).click()
            // }, 3000)
            
            const element = await lessonElList.nth(i)
            await element.click()
        
            // 等待页面导航完成
            // await page1.waitForNavigation();
            await page1.waitForLoadState('networkidle')
        
            // 执行鼠标滚轮滚动到底部
            await page1.evaluate(() => {
              window.scrollTo(0, document.body.scrollHeight);
            });
            
            // 等待5秒
            await page1.waitForTimeout(5000)
            // 获取按钮内容为"返回课程"的元素并点击
            const backButton = await page1.getByRole('link', { name: ' 返回课程' })
            await backButton.click();
        
            // 等待页面导航完成
            await page1.waitForNavigation({ timeout: 15000 });
          }

          return {
            msg: '刷课中！',
            code: 1
          }
        }, 15000)

        // 获取当前页所有
        // return { courseElList, courseListInfo }
      }

      break
    default:
      break
  }
}

module.exports = { startCourse }