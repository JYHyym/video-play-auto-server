const { chromium } = require('playwright')
const fs = require('fs')
const students = require('../data/students')
const courses = require('./courses.js')
const courseProcessFilter = require('./courseFilter.js')

const login = async (link, account, psw, executablePath) => {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500,
    executablePath: executablePath ||  '/Users/yym/Desktop/Google Chrome.app/Contents/MacOS/Google Chrome'
    // executablePath: executablePath || 'C:/Users/cnic/AppData/Local/Google/Chrome/Application/chrome.exe' 
  });

  const context = await browser.newContext()
  // Create pages, interact with UI elements, assert values
  let page;
  const filePath = `path_cookie/${account}_cookie.json`;

  if (fs.existsSync(filePath)) {
    // File exists at the specified path
    console.log('File exists');
    page = await browser.newPage(storage_state=`path_cookie/${account}_cookie.json`);
  } else {
    // File does not exist at the specified path
    console.log('File does not exist');
    page = await browser.newPage()
    await page.goto(link);
  }

  // // 加载存储状态
  // let storageState = JSON.parse(await fs.readFile('path/to/storage_' + account + '.json'));
  // await context.storageState(storageState)

  // 加载之前保存的存储状态
  // const savedStorageState = JSON.parse(await fs.readFile('storage-state_' + account + '.json', 'utf-8'));
  // await context.setStorageState(savedStorageState);
  
  // 打开登录页

  switch (link) {
    // 国开
    case 'https://menhu.pt.ouchn.cn/':
      // await page.getByPlaceholder('请输入登录名').click();
      // await page.getByPlaceholder('请输入登录名').fill(account);
      // await page.getByPlaceholder('请输入登录密码').click();
      // await page.getByPlaceholder('请输入登录密码').fill(psw);
      // await page.getByPlaceholder('请输入验证码').click();
      // await page.getByPlaceholder('请输入验证码').fill('');
      // await page.getByRole('button', { name: '登录' }).click();
      await page.goto('https://menhu.pt.ouchn.cn/site/ouchnPc/index');
    
      // 监听页面路径是否改变（是否已登录并进入待学习课程页） 
      page.on('framenavigated', async (frame) => {
        const newURL = await frame.url();
        console.log('URL 国开changed:', newURL);
        // await page.goto('https://iam.pt.ouchn.cn/am/UI/Login?realm=%2F&service=initService&goto=https%3A%2F%2Fiam.pt.ouchn.cn%2Fam%2Foauth2%2Fauthorize%3Fservice%3DinitService%26response_type%3Dcode%26client_id%3D345fcbaf076a4f8a%26scope%3Dall%26redirect_uri%3Dhttps%253A%252F%252Fmenhu.pt.ouchn.cn%252Fouchnapp%252Fwap%252Flogin%252Findex%26decision%3DAllow');
        
        // 在验证通过且URL变化时
        if(newURL.includes('https://iam.pt.ouchn.cn/am/UI/Login')) {
          await page.locator('p').filter({ hasText: '请输入登录名' }).click();
          await page.getByPlaceholder('请输入登录名').click();
          await page.getByPlaceholder('请输入登录名').fill(account);
          await page.getByPlaceholder('请输入登录密码').click();
          await page.getByPlaceholder('请输入登录密码').fill(psw);
          await page.getByPlaceholder('请输入验证码').click();
          await page.getByPlaceholder('请输入验证码').fill('');
          await page.getByRole('button', { name: '登录' }).click();
          context.storage_state(path=`path_cookie/${account}_cookie.json`) // 保存storage_state 到JSON文件
        }
          const page1Promise = page.waitForEvent('popup');
          // await courseProcessFilter(page, page1Promise, link)
          // TODO点击去掉弹框
          await page.locator('li').filter({ hasText: '管理思想史 课程代码：53720 | 课程状态： 正在进行 | 开课时间： 2023年02月05日 选课学生：704 人 | 资料：0 个 | 形考作业：3/3' }).getByRole('progressbar').click();
          const page1 = await page1Promise;
          await page1.getByRole('checkbox').check();
        
      });

      
      // // 监听页面路径是否改变（是否已登录并进入待学习课程页）
      // page.on('framenavigated', async (frame) => {
      //   const newURL = await frame.url();
      //   console.log('URL 国开changed:', newURL);

      //   // 在验证通过且URL变化时
      //   if(newURL === 'https://menhu.pt.ouchn.cn/site/ouchnPc/index') {
      //     const page1Promise = page.waitForEvent('popup');
      //     await courseProcessFilter(page, page1Promise, link)
      //   }
      // });

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
  

  // if(hasVail) {

  // } else {
  //   await page.click(loginEl)
  // }
  // await context.storageState({ path: 'auth.json' });

  // 关闭浏览器前保存存储状态
  // const storageState = await context.storageState();
  // 将存储状态保存到文件中
  // await fs.writeFile('path/to/storage_' + account + '.json', JSON.stringify(storageState));
  // 保存存储状态
  // const storageState = await context.storageState();
  // await fs.writeFile('storage-state_' + account + '.json', JSON.stringify(storageState));
  
  // await browser.close();
}

// const studentInfo = students[1]
// login(studentInfo.link, studentInfo.account, studentInfo.psw, studentInfo.accountEl, studentInfo.pswEl, studentInfo.hasVail, studentInfo.loginEl)
module.exports = login