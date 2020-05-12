const router = require('koa-router')()
const Login = require('../../models/posteriorSystem/adminUser');
const addtoken = require('../../token/addtoken');
router.prefix('/adminUser')
router.get('/', async ctx => {
  // let r =await adminUser.create({
  //     username: "root", 
  //     password: "123456"
  // })
  ctx.body = {  //这是向前台返回的数据 因为没有连接数据库所以我们自己定义，后面讲连接数据库
    status: "200",
    title: "adminUser接口",
  };

});

const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}


// user login
router.post('/login', async ctx => {
  const { username } = ctx.request.body
  const token = tokens[username]
  if (!token) {
    ctx.body = {
      code: 60204,
      message: 'Account and password are incorrect.'
    }
  }

  ctx.body = {
    code: 20000,
    data: token
  }
})
   
router.get('/info', async ctx => {
  
  const { token } = ctx.request.query
  console.log(ctx.request.query.token);
  const info = users[token]
  if (!info) {
    ctx.body = {
      code: 50008,
      message: 'Login failed, unable to get user details.'
    }
  }

  ctx.body = {
    code: 20000,
    data: info
  }
})
  // get user info
router.post('/logout', async ctx => {
  ctx.body =  {
    code: 20000,
    data: 'success'
  }
})
  // user logout



  // router.post('/login', async (ctx, next) => {
  //   let { username, password } = ctx.request.body

  //   console.log(username, password);

  //   await Login.findOne({ username: username, password: password }, function (err, doc) {
  //     if (err) {
  //       ctx.body = {
  //         status: "0",
  //         msg: err.message
  //       }
  //     } else {
  //       if (doc) {
  //         let token = addtoken({ user: doc.username })
  //         //req.session.user = doc;
  //         ctx.body = {
  //           token,
  //           status: '200',
  //           msg: '',
  //           result: {
  //             username: doc.username
  //           }
  //         }
  //       }
  //     }
  //   });
  // });

  // router.get('/info', async (ctx) => {
  //   let {token}  = ctx.request.querystring
  //   const users = {
  //     'admin-token': {
  //       roles: ['admin'],
  //       introduction: 'I am a super administrator',
  //       avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
  //       name: 'Super Admin'
  //     },
  //   }
  //   const info = users
  //   console.log(info);
  //   if (!info ) {
  //     ctx.body =  {
  //       code: 50008,
  //       message: 'Login failed, unable to get user details.'
  //     }
  //   }

  //   ctx.body =  {
  //     code: 200,
  //     data: info ,
  //   }
  // })



  module.exports = router