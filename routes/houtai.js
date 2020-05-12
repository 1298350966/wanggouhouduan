const router = require('koa-router')()
const Login = require('../models/houtai');
const addtoken = require('../token/addtoken');

router.get('/', async ctx => {
  ctx.body = {  //这是向前台返回的数据 因为没有连接数据库所以我们自己定义，后面讲连接数据库
    user:'111',
    code:1,
    status:200
  };
});
router.post('/login',async (ctx, next)=> {
    let {username,password} = ctx.request.body
    
    console.log(username,password);
  
  await  Login.findOne({username:username,password:password}, function (err,doc) {
    if(err){ 
      ctx.body = {
            status:"0",
            msg:err.message
        }
    }else{
        if(doc){
          let token = addtoken({user:doc.username})
            //req.session.user = doc;
            ctx.body = {
                token,
                status:'200',
                msg:'',
                result:{
                  username:doc.username
                }
            }
        }
    }
  });
  });
module.exports = router