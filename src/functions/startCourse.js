// const { browser } = require('./login.js')
const { login: loginFun } = require('./login') // 导入方法

// 辅助函数：将格式为“mm:ss”的时间字符串转换为秒数
const timeStrToSeconds = (timeStr) => {
  const [minutes, seconds] = timeStr.split(':');
  return parseInt(minutes) * 60 + parseInt(seconds);
}

// 辅助函数：将秒数转换为格式为“mm:ss”的时间字符串
const secondsToTimeStr = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// TODO 开始刷课
const startCourse = async ($page, courseElList, courseListInfo, link, account, psw) => {
  switch (link) {
    // 国开
    case 'https://menhu.pt.ouchn.cn/':
      // console.log('currentUrl', $page)
      const currentUrl = await $page.url()
      console.log('当前页路径:', currentUrl)
      // 等待页面中的弹出窗口出现
      const itemCosePageProm = $page.waitForEvent('popup')

      if(currentUrl === 'https://menhu.pt.ouchn.cn/site/ouchnPc/index') {
        const courseCount = await courseElList.count() // 待刷课学科数量
        const coursePages = {} // 声明所有学科将弹出的窗口page
        // 点击每门学科（进入选中的课程列表，并刷每节课）---- 循环所有学科的课程，刷课 -------
        for(let courseIndex = 0; courseIndex < courseCount; courseIndex++) {

          await courseElList.nth(courseIndex).locator('.learning_course').click()

          coursePages[courseIndex] = await itemCosePageProm
          // 等待页面加载...
          await coursePages[courseIndex].waitForLoadState('domcontentloaded')

          // 判断点击去学习是否会跳转到登录页
          try {
            // 当等待页面中的弹出窗口出现登录页时，进行登录操作
            const currentPopage = await coursePages[courseIndex].url()
            if(currentPopage.includes('https://iam.pt.ouchn.cn/am/UI/Login')){
              const resLogin = await loginFun(coursePages[courseIndex], link, account, psw)
              // courseElList = resLogin?.courseElList
              console.log('点击开始学习跳登录res: ===>', resLogin)
              console.log('url:', currentPopage)
              return new Promise((resolve, reject) => {
                resolve({
                  msg: '请再次点击开始刷课',
                  code: 0
                })
              })
            }
          } catch (error) {
            console.log('没有出现点击开始学习跳转登录页，或点击开始学习跳登录操作失败：', error)
          }

          // 跳转进入了当前学科课程列表页
          if(await coursePages[courseIndex].locator('#course-section span').textContent() === '全部展开'){
            await coursePages[courseIndex].locator('#course-section').click()
          }

          // 等待页面加载...
          await coursePages[courseIndex].waitForLoadState('domcontentloaded')
          // await page1.waitForTimeout(4000) 

          try {
            // // 获取当前学科列表(未开始或学习一部分的课)
            let lessonElList = await coursePages[courseIndex].locator('div.completeness.none, div.completeness.part')
            let lessonCount = await lessonElList.count()
            let lessonTitle = await coursePages[courseIndex].locator('div.learning-activity.ng-scope div.completeness.none, div.learning-activity.ng-scope div.completeness.part')
            const lessonTitleCount = await lessonTitle.count()

            console.log('====>',lessonTitleCount,  await lessonTitle.nth(0))

            if(lessonCount > 0) {
              console.log('刷课，当前学科:',courseListInfo[courseIndex].courseName, '共：', lessonCount,'节待刷')
              let cantViewCount = 0
              for(let i = 0; i < lessonCount; i++) {
                // 获取当前学科列表(未开始或学习一部分的课),每次返回课程页会将之前的进度刷新，因此需要每次进入页面后重新获取未刷课程                
                if(i !== 0) {
                  // 等待页面加载...
                  await coursePages[courseIndex].waitForLoadState('domcontentloaded')
                  lessonElList = await coursePages[courseIndex].locator('div.completeness.none, div.completeness.part')
                  // lessonCount = await lessonElList.count()
                  lessonTitle = await coursePages[courseIndex].locator('div.learning-activity.ng-scope div.completeness.none, div.learning-activity.ng-scope div.completeness.part')
                  
                }

                const element = await lessonElList.nth(cantViewCount) // 去掉讨论课和测试课
                const currentTitle = await lessonTitle[cantViewCount].innerText() // 课程名
                await element.click()

                if(currentTitle.includes('讨论') || currentTitle.includes('测试')) {
                  cantViewCount +=1
                  console.log('当前正刷第', i+1 , '节课：类型为讨论课/测试，无需处理：', currentTitle)
                } else {
                  console.log('当前正刷第', i+1 , '节课：', currentTitle)
                }

                // 等待单节课页面加载完成
                await coursePages[courseIndex].waitForLoadState('domcontentloaded')
                
                // ----------- 视频播放逻辑 ------------------
                if(currentTitle.includes('音视频')){
                  try {
                    // 判断是否有播放视频按钮，有则播放
                    await coursePages[courseIndex].waitForTimeout(4000) 
    
                    const mvpFontsPlay = 'i.mvp-fonts.mvp-fonts-play'  // 播放按钮
                    const nodePlay = await coursePages[courseIndex].locator(mvpFontsPlay)
                    const mvpDisplayTime = 'div.mvp-controls-left-area > div' // 视频时长
                    const nodeDisplayTime = await coursePages[courseIndex].locator(mvpDisplayTime)
    
                    await nodePlay.waitFor({ state: 'visible', timeout: 8000 })
                    await nodeDisplayTime.waitFor({ state: 'visible', timeout: 8000 })
                    // 获取所有<span>元素的textContent值，计算视频时长，处理在当前页面停留时间
                    const startTimeEl = await nodeDisplayTime.locator('span').nth(0)
                    const startTimeStr = await startTimeEl.textContent()
                    const startTime = timeStrToSeconds(startTimeStr)
    
                    const endTimeEl = await nodeDisplayTime.locator('span').nth(1)
                    const endTimeStr = await endTimeEl.textContent()
                    const endTime = timeStrToSeconds(endTimeStr)
                    // 计算时间差
                    const duration = endTime - startTime // 当前视频还需播放时长（秒）
                    const durationStr = secondsToTimeStr(duration) // 当前视频还需播放时长展示成xx:xx
                    // 播放视频
                    await nodePlay.click()
                    // 输出结果
                    console.log('开始刷视频，视频长度:', durationStr, '...')
                    // 当前页停留时间
                    await coursePages[courseIndex].waitForTimeout(duration * 1000) 
                    console.log('当前课程播放完毕。')
                  } catch (error) {
                    console.log('刷课程出现错误，查看视频：', error)
                    return new Promise((resolve, reject) => {
                      resolve({
                        msg: '刷课程出现错误，查看视频：', error,
                        code: 2
                      })
                    })
                  }
                }

                // ------------ 查看文件逻辑 ----------------
                if(currentTitle.includes('参考资料')){
                  try { 
                    // body > div.wrapper > div.main-content.gtm-category > div:nth-child(9) > div > div.full-screen-mode-content-wrapper > div.full-screen-mode-main > div.full-screen-mode-content > div > div > div > div > div:nth-child(1) > div > div > div > div.activity-details > div.activity-attributes-section.section.meterial-attachment > full-screen-mode-material-attachment-list > div > div.ivu-table.ivu-table-default > div.ivu-table-body > table > tbody > tr:nth-child(1) > td.ivu-table-column-Beq8q2 > div > a
                    const filePreview = ' div.ivu-table.ivu-table-default > div.ivu-table-body > table > tbody > tr > td a'  // 获取table中a标签
                    const filePreviewEL = await coursePages[courseIndex].locator(filePreview)
                    const filePreviewELCount = await filePreviewEL.count()
                    for(let i = 0; i < filePreviewELCount; i++) {
                      const fileTextContent = await filePreviewEL.nth(i).textContent()
                      if(fileTextContent.includes('查看')) {
                        await filePreviewEL.nth(i).click()
                        // 等加载文件完毕
                        await coursePages[courseIndex].waitForLoadState('networkidle')
                        await coursePages[courseIndex].waitForTimeout(3000) 
                        
                        const closeFile = '#file-previewer a.right.close'
                        const closeFileEl = await coursePages[courseIndex].locator(closeFile)
                        await closeFileEl.waitFor({ state: 'visible'})
                        await closeFileEl.click()
                      }
                    } 
                  } catch (error) {
                    console.log('刷课程出现错误，查看文件：', error)
                    return new Promise((resolve, reject) => {
                      resolve({
                        msg: '刷课程出现错误，查看文件：', error,
                        code: 2
                      })
                    })
                  }
                }
                
                // 在当前页等待浏览3秒
                await coursePages[courseIndex].waitForTimeout(5000)

                // 获取按钮内容为"返回课程"的元素并点击
                const backButton = await coursePages[courseIndex].getByRole('link', { name: ' 返回课程' })
                await backButton.click();

                // 等待页面导航完成
                // await page1.waitForNavigation({ timeout: 15000 });
              }
            } else {
              console.log('刷课,当前科目：', courseListInfo[courseIndex].courseName, '已刷完！')
            }

          } catch (error) {
            console.log('获取课程出现错误：', error)
            return new Promise((resolve, reject) => {
              resolve({
                msg: '获取课程出现错误：', error,
                code: 2
              })
            })
          }
        }
        
        return {
          msg: '刷课中。。。',
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