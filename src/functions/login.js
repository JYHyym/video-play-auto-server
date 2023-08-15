const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')
const students = require('../data/students')
const courses = require('./courses.js')
const courseProcessFilter = require('./courseFilter.js')

const login = async (link, account, psw, executablePath) => {
  const browser = await chromium.launchPersistentContext(path.resolve('.../../userDataDir'), { 
    headless: false,
    slowMo: 500,
    // executablePath: executablePath ||  '/Users/yym/Desktop/Google Chrome.app/Contents/MacOS/Google Chrome'
    // executablePath: executablePath || 'C:/Users/cnic/AppData/Local/Google/Chrome/Application/chrome.exe' 
  });

  // Create pages, interact with UI elements, assert values
  const [page] = browser.pages()

  console.log('page:===>', page)
    // await page.goto(link)
    switch (link) {
      // 国开
      case 'https://menhu.pt.ouchn.cn/':
        
        await page.goto('https://menhu.pt.ouchn.cn/site/ouchnPc/index');

        // 监听路由变化
        // await page.on('framenavigated', async (frame) => {
        //   const newURL = await frame.url();
        //   if(newURL.includes('https://iam.pt.ouchn.cn/am/UI/Login')) {
        //     await page.getByPlaceholder('请输入登录名').click();
        //     await page.getByPlaceholder('请输入登录名').fill(account);
        //     await page.getByPlaceholder('请输入登录密码').click();
        //     await page.getByPlaceholder('请输入登录密码').fill(psw);
        //     await page.getByPlaceholder('请输入验证码').click();
        //     await page.getByPlaceholder('请输入验证码').fill('');
        //     await page.getByRole('button', { name: '登录' }).click();
        //   } 
    
        // })
        // 获取当前url,为登录时则进入登录操作，如已登录则继续其他操作
        const newURL = await page.url()
        if(newURL.includes('https://iam.pt.ouchn.cn/am/UI/Login')) {
          await page.getByPlaceholder('请输入登录名').click();
          await page.getByPlaceholder('请输入登录名').fill(account);
          await page.getByPlaceholder('请输入登录密码').click();
          await page.getByPlaceholder('请输入登录密码').fill(psw);
          await page.getByPlaceholder('请输入验证码').click();
          await page.getByPlaceholder('请输入验证码').fill('');
          await page.getByRole('button', { name: '登录' }).click();
        } 

        // 进入课程页
        await page.waitForURL('https://menhu.pt.ouchn.cn/site/ouchnPc/index')
        // 检查是否有弹框，有则关闭
        const closeSelector = 'body > div:nth-child(1) > div.ouchnPc_index_advertisement > img.cloneImg'
        const nodeClose = await page.$(closeSelector)
        console.log('nodeClo/se：', nodeClose)
        if(nodeClose) {
          await page.click(closeSelector)
        }

        if(await page.url() === 'https://menhu.pt.ouchn.cn/site/ouchnPc/index') {
          const page1Promise = page.waitForEvent('popup');
          // await courseProcessFilter(page, page1Promise, link)
          // 点击某节课程，跳转页面
          await page.locator('li').filter({ hasText: '管理思想史 课程代码：53720 | 课程状态： 正在进行 | 开课时间： 2023年02月05日 选课学生：704 人 | 资料：0 个 | 形考作业：3/3' }).getByRole('progressbar').click();
          const page1 = await page1Promise;
          await page1.getByRole('checkbox').check();
        }
       
        break
      // 郑州航空工业管理学院继续教育学院 验证码输入
      case 'http://zzia.jxjy.chaoxing.com':
        await page.fill('#userName', account)
        await page.fill('#passWord', psw)
        await page.fill('#verifyCode', '')
        await page.click('.loginBtn')
        // TODO 筛选课程，观看视频
        break
  
      // 河南大学 验证码输入  =======没有未完成的视频
      case 'https://jjad.henu.edu.cn/np/#/login': 
        await page.frameLocator('iframe').getByPlaceholder('用户名').click();
        await page.frameLocator('iframe').getByPlaceholder('用户名').fill(account);
        await page.frameLocator('iframe').getByPlaceholder('密码').click();
        await page.frameLocator('iframe').getByPlaceholder('密码').fill(psw);
        await page.frameLocator('iframe').getByPlaceholder('输入验证码').click();
        await page.frameLocator('iframe').getByPlaceholder('输入验证码').fill('');
        await page.frameLocator('iframe').getByRole('button', { name: '登录' }).click();
        break
  
      // 郑州商贸旅游职业学院 滑块校验
      case 'http://smlyzyxy.hnzkw.org.cn/':
        await page.getByPlaceholder('请输入账号').click();
        await page.getByPlaceholder('请输入账号').fill(account);
        await page.getByPlaceholder('请输入密码').click();
        await page.getByPlaceholder('请输入密码').fill(psw);
        await page.locator('form').getByText('登 录').click(); 
  
        // 视频在chromium中无法播放 感谢观看此视频弹框
        // 监听URL变化
        page.on('framenavigated', async (frame) => {
          const newURL = await frame.url();
          console.log('URL changed:', newURL);
  
          // 在URL变化时（滑块验证通过）
          if(newURL === 'http://smlyzyxy.hnzkw.org.cn/#/index') {
            await courses(page, link)
          }
        });
       
        break
  
      // 河南艺术职业学院 
      case 'http://hnys.hnzkw.org.cn/':
        await page.getByPlaceholder('请输入账号').click();
        await page.getByPlaceholder('请输入账号').fill(account);
        await page.getByPlaceholder('请输入密码').click();
        await page.getByPlaceholder('请输入密码').fill(psw);
        await page.locator('form').getByText('登 录').click();
        // 视频在chromium中无法播放 感谢观看此视频弹框
        break
  
      // 长春中医药大学
      case 'https://ccutcm.ls365.net/':
        await page.getByPlaceholder('账号').click();
        await page.getByPlaceholder('账号').fill(account);
        await page.getByPlaceholder('密码').click();
        await page.getByPlaceholder('密码').fill(psw);
        await page.getByRole('link', { name: '登 录' }).click();
        break
  
      // 西安工业大学
      case 'https://xatu.168wangxiao.com/web/login':
  
        break
  
      // 长春大学
      case 'http://www.5xuexi.com/passport/toLogin.action':
        break
  
      // 郑州城市职业学院
      case 'http://zzcsxy.w-ling.cn/':
        break
      
      // 长沙理工大学
      case 'https://csustcj.edu-edu.com.cn/':
        break
      
      // 河南水利与环境职业学院
      case 'http://hnshxy.hnzkw.org.cn/':
        break
      
      // 吉林财经大学
      case 'https://jlufe.mhtall.com/':
        break
      
      // 河南师范大学
      case 'http://htu.xjjwedu.com/':
        break
      
      // 三峡职业技术学院
      case 'http://crjy.wencaischool.net/smxzyjsxy/console/':
        break
      
      // 大连工业
      case 'https://degree.qingshuxuetang.com/dlgy/Home':
        break
  
      // 郑州航空工业管理学院继续教育学院
      case 'http://zzia.jxjy.chaoxing.com':
        break
      default:
        break
    }
    
  // await browser.close();
}

module.exports = login