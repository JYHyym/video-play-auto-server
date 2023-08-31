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
const startCourse = async ($page, courseElList, link, account, psw) => {
  switch (link) {
    // 国开
    case 'https://menhu.pt.ouchn.cn/':
      // console.log('currentUrl', $page)
      const currentUrl = await $page.url()
      console.log(currentUrl)
      if(await $page.url() === 'https://menhu.pt.ouchn.cn/site/ouchnPc/index') {
        const itemCosePageProm = $page.waitForEvent('popup')
        
        // 点击一门课程（进入选中的课程列表）
        if(await $page.url() === 'https://menhu.pt.ouchn.cn/site/ouchnPc/index') {
          // const expandSelector = '.learning_course'
          // const expandXPath = await $page.locator(expandSelector)
          await courseElList.nth(0).locator('.learning_course').click()
          // 判断是否会跳转到登录页
          try {
            $page.on('popup', async (popup) => {
              // 获取新打开的标签页的URL
              const url = popup.url();
              // 判断URL是否为目标URL
              if (url.includes('https://iam.pt.ouchn.cn/am/UI/Login')) {
                console.log('新标签页已打开并跳转到目标URL');
                const resLogin = await loginFun($page, link, account, psw) 
                courseElList = resLogin?.courseElList
                console.log('点击开始学习跳登录res: ===>', resLogin)
                console.log('url:', await $page.url())
              }
            })
          } catch (error) {
            console.log(error)
          }
          
        }
        // TODO -------获取所有门课，循环刷课-------

        const page1 = await itemCosePageProm

        if(await page1.locator('#course-section span').textContent() === '全部展开'){
          await page1.locator('#course-section').click()
        }
        // 获取所有课程时间较长，需等待一段时间
        setTimeout(async ()=> {
          try {
            //  TODO 获取单节课元素列表(未开始或学习一部分的课)
            const lessonElList = await page1.locator('div.completeness.none, div.completeness.part')
            // const lessonElList = await page1.locator('a.title.ng-binding.ng-scope') // 'div.learning-activity.ng-scope[id^="learning-activity-"]' // a.title.ng-binding.ng-scope
            const lessonCount = await lessonElList.count()

            for(let i = 0; i < lessonCount; i++) {
              const element = await lessonElList.nth(i)
              await element.click()
          
              // 等待页面导航完成
              // await page1.waitForNavigation();
              await page1.waitForLoadState('networkidle')
              await page1.waitForTimeout(3000) 
          
              // 执行鼠标滚轮滚动到底部 (没有生效)
              await page1.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
              });
              
              // ----------- 视频播放逻辑 ------------------
              try {
                // 判断是否有播放视频按钮，有则播放
                await page1.waitForTimeout(3000) 

                const mvpFontsPlay = 'i.mvp-fonts.mvp-fonts-play'  // 播放按钮
                const nodePlay = await page1.locator(mvpFontsPlay)
                const mvpDisplayTime = 'div.mvp-controls-left-area > div' // 视频时长
                const nodeDisplayTime = await page1.locator(mvpDisplayTime)

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
                // 输出结果
                console.log('duration:', duration)
                // 播放视频
                await nodePlay.click()
                // 当前页停留时间
                // await page1.waitForTimeout(1000) // 正式需要替换成下面一行
                await page1.waitForTimeout(duration * 1000) 
              } catch (error) {
                console.log(error)
              }

              // ------------ 查看文件逻辑 ----------------
              try { 
                // body > div.wrapper > div.main-content.gtm-category > div:nth-child(9) > div > div.full-screen-mode-content-wrapper > div.full-screen-mode-main > div.full-screen-mode-content > div > div > div > div > div:nth-child(1) > div > div > div > div.activity-details > div.activity-attributes-section.section.meterial-attachment > full-screen-mode-material-attachment-list > div > div.ivu-table.ivu-table-default > div.ivu-table-body > table > tbody > tr:nth-child(1) > td.ivu-table-column-Beq8q2 > div > a
                const filePreview = ' div.ivu-table.ivu-table-default > div.ivu-table-body > table > tbody > tr > td a'  // 获取table中a标签
                const filePreviewEL = await page1.locator(filePreview)
                const filePreviewELCount = await filePreviewEL.count()
                for(let i = 0; i < filePreviewELCount; i++) {
                  const fileTextContent = await filePreviewEL.nth(i).textContent()
                  if(fileTextContent.includes('查看')) {
                    await filePreviewEL.nth(i).click()
                    // 等加载文件完毕
                    await page1.waitForLoadState('networkidle')
                    await page1.waitForTimeout(3000) 
                    
                    const closeFile = '#file-previewer a.right.close'
                    const closeFileEl = await page1.locator(closeFile)
                    await closeFileEl.waitFor({ state: 'visible'})
                    await closeFileEl.click()
                  }
                } 
              } catch (error) {
                console.log(error)
              }

              // 等待3秒
              await page1.waitForTimeout(3000)

              // 获取按钮内容为"返回课程"的元素并点击
              const backButton = await page1.getByRole('link', { name: ' 返回课程' })
              await backButton.click();
          
              // 等待页面导航完成
              await page1.waitForNavigation({ timeout: 15000 });
            }
          } catch (error) {
            console.log(error)
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