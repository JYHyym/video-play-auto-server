const fs = require('fs')
const path = require('path')
const axios = require('axios')
const students = require('../data/students')
const courses = require('./courses')
const { courseList } = require('./courseFilter')
let courseElList, courseListInfo

// 向模型发起请求获取验证码 
const getModelCode = async (path) => {
  console.log('验证码url:', path)
  try {
    const response = await axios({
      method: 'post',
      url: 'http://39.105.115.214:8181/ctc_model/predict',
      headers: {
        'Content-Type': 'application/json'
      },
      data: { image: path }
    });
    console.log('向模型发起请求获取验证码:',response.data, '图片路径:', path);
    return response.data;
  } catch (error) {
    console.log('向模型发起请求获取验证码失败：', error);
    throw error;
  }
}

// 将验证码保存到服务器根路径
const saveImageToServer = async (codePath, picName) => {
  console.log('将验证码保存到服务器根路径方法')
  const sourceFilePath = codePath;
  const destinationFilePath = '/root/ctc_service/data/data_image/'+ picName;
  try {
    await fs.promises.copyFile(sourceFilePath, destinationFilePath);
    console.log('文件保存成功！');
    return {code: 1, path: destinationFilePath};
  } catch (err) {
    console.error('文件保存失败：', err);
    throw err;
  }
}


const login = async ($page, link, account, psw, executablePath) => {
    switch (link) {
      // 国开
      case 'https://menhu.pt.ouchn.cn/':
        console.log('登录功能')
        await $page.goto('https://menhu.pt.ouchn.cn/site/ouchnPc/index');

        const newURL = await $page.url()
        if(newURL.includes('https://iam.pt.ouchn.cn/am/UI/Login')) {
          await $page.getByPlaceholder('请输入登录名').click();
          await $page.getByPlaceholder('请输入登录名').fill(account);
          await $page.getByPlaceholder('请输入登录密码').click();
          await $page.getByPlaceholder('请输入登录密码').fill(psw);
          await $page.getByPlaceholder('请输入验证码').click();

          console.log('截图并上传验证码，获取code数字')
          // 截图并上传验证码，获取code数字
          const nowTime = new Date().getTime()
          const codePath = `../pic/gk_code_${account}_${nowTime}.png`
          const picName = `gk_code_${account}_${nowTime}.png`
          await $page.locator('#kaptchaImage').screenshot({ path: codePath });
          // const resCode = await uploadCode(codePath)
          try {
            const result = await saveImageToServer(codePath, picName);
            console.log('res上传图片', result)
            if(result.code === 1){
              // 从模型获取验证码
              const codeRes = await getModelCode(`http://123.56.227.26/${picName}`)
              console.log('从模型获取的验证码信息:', codeRes)
              if(codeRes.result){
                await $page.getByPlaceholder('请输入验证码').fill(codeRes.result);
                await $page.getByRole('button', { name: '登录' }).click();
                console.log('点击登录按钮')
              }
            }
            
          } catch (error) {
            console.error('error验证码处理出错:', error)
            return new Promise((resolve, reject) => {
              resolve({
                error,
                courseElList: [],
                courseListInfo: [],
                msg: '验证码处理出错，账号登录失败，请重试！',
                code: 0
              })
            })
          }
          
          return new Promise((resolve, reject) => {
            $page.on('framenavigated', async (frame) => {
              const mynewURL = await frame.url();
              const currentUrl = await $page.url()
              // mynewURL.includes('https://menhu.pt.ouchn.cn/site/ouchnPc/index') &&
              if(currentUrl.includes('https://menhu.pt.ouchn.cn/site/ouchnPc/index')) {
                const res = await courseList($page, link)
                courseElList = res.courseElList
                courseListInfo = res.courseListInfo
                // console.log('/login====>',{ courseElList,courseListInfo,msg: '账号登录成功！',code: 1 })
                resolve({
                  courseElList,
                  courseListInfo,
                  msg: '账号登录成功！',
                  code: 1
                })
              } else {
                resolve({
                  courseElList: [],
                  courseListInfo: [],
                  msg: '账号登录失败，请重试！',
                  code: 0
                })
              } 
            })
          })
          
        } else{
          const res = await courseList($page, link)
          courseElList = res.courseElList
          courseListInfo = res.courseListInfo
          
          return {
            courseElList,
            courseListInfo,
            msg: '账号登录成功！',
            code: 1
          }
        }
        break
      // 郑州航空工业管理学院继续教育学院 验证码输入
      case 'http://zzia.jxjy.chaoxing.com':
        await $page.fill('#userName', account)
        await $page.fill('#passWord', psw)
        await $page.fill('#verifyCode', '')
        await $page.click('.loginBtn')
        // TODO 筛选课程，观看视频
        break
  
      // 河南大学 验证码输入  =======没有未完成的视频
      case 'https://jjad.henu.edu.cn/np/#/login': 
        await $page.frameLocator('iframe').getByPlaceholder('用户名').click();
        await $page.frameLocator('iframe').getByPlaceholder('用户名').fill(account);
        await $page.frameLocator('iframe').getByPlaceholder('密码').click();
        await $page.frameLocator('iframe').getByPlaceholder('密码').fill(psw);
        await $page.frameLocator('iframe').getByPlaceholder('输入验证码').click();
        await $page.frameLocator('iframe').getByPlaceholder('输入验证码').fill('');
        await $page.frameLocator('iframe').getByRole('button', { name: '登录' }).click();
        break
  
      // 郑州商贸旅游职业学院 滑块校验
      case 'http://smlyzyxy.hnzkw.org.cn/':
        await $page.getByPlaceholder('请输入账号').click();
        await $page.getByPlaceholder('请输入账号').fill(account);
        await $page.getByPlaceholder('请输入密码').click();
        await $page.getByPlaceholder('请输入密码').fill(psw);
        await $page.locator('form').getByText('登 录').click(); 
  
        // 视频在chromium中无法播放 感谢观看此视频弹框
        // 监听URL变化
        $page.on('framenavigated', async (frame) => {
          const newURL = await frame.url();
          // console.log('URL changed:', newURL);
  
          // 在URL变化时（滑块验证通过）
          if(newURL === 'http://smlyzyxy.hnzkw.org.cn/#/index') {
            await courses($page, link)
          }
        });
       
        break
  
      // 河南艺术职业学院 
      case 'http://hnys.hnzkw.org.cn/':
        await $page.getByPlaceholder('请输入账号').click();
        await $page.getByPlaceholder('请输入账号').fill(account);
        await $page.getByPlaceholder('请输入密码').click();
        await $page.getByPlaceholder('请输入密码').fill(psw);
        await $page.locator('form').getByText('登 录').click();
        // 视频在chromium中无法播放 感谢观看此视频弹框
        break
  
      // 长春中医药大学
      case 'https://ccutcm.ls365.net/':
        await $page.getByPlaceholder('账号').click();
        await $page.getByPlaceholder('账号').fill(account);
        await $page.getByPlaceholder('密码').click();
        await $page.getByPlaceholder('密码').fill(psw);
        await $page.getByRole('link', { name: '登 录' }).click();
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

module.exports = { login, courseElList, courseListInfo }