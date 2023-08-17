const express = require('express');
const app = express();
const timeout = require('connect-timeout')

const { login: loginFun, login } = require('./functions/login'); // 导入fun方法

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

// 处理POST请求
app.post('/api/login', (req, res) => {
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
      const resLogin = await loginFun(link, account, psw) 

    // if(resLogin?.courseListInfo) {
      console.log('登录res: ===>', resLogin)
      res.send({
        link,
        account, 
        psw, 
        courseList: resLogin?.courseList,
        courseListInfo: resLogin?.courseListInfo,
        msg: resLogin?.msg,
        code: resLogin?.code
      })
    } catch (err) {
      console.log('执行了res.send',  res.send({msg: 'error', code: 2}))
    }
    
    // }
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});