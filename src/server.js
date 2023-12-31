const express = require('express');
const app = express();
const multer = require('multer');
const { chromium } = require('playwright') 
const path = require('path')

let $browser, $page
(async () => {
  console.log('调用浏览器')
  try {
    $browser = await chromium.launchPersistentContext(path.resolve('.../../userDataDir'), { 
      headless: false,
      slowMo: 500,
      channel: 'msedge',
      // 默认开启控制台。不然无法自动播放视频
      devtools: true
    });
    console.log('浏览器调用成功')
    $page = $browser.pages()[0]
    // TODO 判断是否跳转到新登录页
    // $page.on('framenavigated', async (frame) => {
    //   const mynewURL = await frame.url()
    //   const currentUrl = await $page.url()
  
    //   if(currentUrl.includes('https://iam.pt.ouchn.cn/am/UI/Login')) {
    //     await $page.getByPlaceholder('请输入登录名').click();
    //     await $page.getByPlaceholder('请输入登录名').fill(account);
    //     await $page.getByPlaceholder('请输入登录密码').click();
    //     await $page.getByPlaceholder('请输入登录密码').fill(psw);
    //     await $page.getByPlaceholder('请输入验证码').click();
    //     await $page.getByPlaceholder('请输入验证码').fill('');
    //     await $page.getByRole('button', { name: '登录' }).click()
    //   }
    // })
  } catch (error) {
    console.log('浏览器调用失败：', error)
  }
  
})() 

const { login: loginFun } = require('./functions/login') // 导入方法
const { startCourse } = require('./functions/startCourse');
const { error } = require('console');
let courseElList, courseListInfo 

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // 允许所有来源的请求
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // 允许的HTTP方法
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // 允许的请求头
  next()
})

// app.get('/api/login', (req, res) => {
//   console.log('-----:',req, res)
//   // loginFun(); // 调用fun方法
//   res.send('Fun method called success', req, res); // 返回响应
// });

// 登录请求api
app.post('/api/login', (req, res) => {
  console.log('执行登录请求')
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', async () => {
    // 在这里处理POST请求的参数
    // postParams 中包含解析后的参数对象
    let postParams, link, account, psw
    if(typeof body !== 'string') {
      // ???
      postParams = new URLSearchParams(body);
      [link, account, psw] = [postParams.get('link'), postParams.get('account'), postParams.get('psw')]
    } else {
      postParams = JSON.parse(body)
      link = postParams.link
      account = postParams.account
      psw = postParams.psw
    }
    // console.log(typeof postParams, '---params', body, '=====', link, account, psw);
    try {
      console.log('登录账号中: ===>', account)
      const resLogin = await loginFun($page, link, account, psw) 
      courseElList = resLogin?.courseElList
      courseListInfo = resLogin?.courseListInfo
      res.send({
        link,
        account, 
        psw, 
        courseElList: resLogin?.courseElList,
        courseListInfo: resLogin?.courseListInfo,
        // $page: JSON.stringify(resLogin?.$page),
        msg: resLogin?.msg,
        code: resLogin?.code,
        error: resLogin?.error || ''
      })
    } catch (err) {
      res.send({msg: err, code: 2})
      console.log('执行了err', err)
    }
    
    // }
  });
});

// 开始刷课
app.post('/api/startCourse', (req, res) => {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', async () => {
    // 在这里处理POST请求的参数
    // postParams 中包含解析后的参数对象
    let postParams, link, account, psw
    if(typeof body !== 'string') {
      // ???
      postParams = new URLSearchParams(body);
      [link, account, psw] = [postParams.get('link'), postParams.get('account'), postParams.get('psw')]
    } else {
      postParams = JSON.parse(body)
      link = postParams.link
      account = postParams.account
      psw = postParams.psw
      // courseElList = postParams.courseElList
      // $page = JSON.parse(postParams.$page)
    }
    // console.log(typeof postParams, '---params', body, '=====', link, account, psw);
    try { 
      const results = await startCourse($page, courseElList, courseListInfo, link, account, psw) 
      console.log('开始刷课res: ===>', results)
      res.send({
        link,
        account,
        courseListInfo,
        msg: results?.msg,
        code: results?.code
      })
    } catch (err) {
      console.log('error:', err, '执行了res.send',  res.send({msg: 'error', code: 2}))
    }
    
    // }
  });
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

module.exports = { $page }