const router = require('koa-router')()
const Users = require('../../models/user');



router.prefix('/clientUser')

router.get('/', async ctx => {
   

  ctx.body = {  //这是向前台返回的数据 因为没有连接数据库所以我们自己定义，后面讲连接数据库
    code:"200",
    title:"clientUser接口",
  };
  
});
//上传图片


router.get('/list', async (ctx) => {
    let items = await Users.find()
    let total = parseInt(items.length) 
    console.log(`/list:${items}`);
    ctx.body = {
      code: '200',
      data:{
        total,
        items
      }
    }
  });
  
  router.post('/addList', async (ctx) => {
    let req = ctx.request.body
    const user = new Users(req);
  
    let data = await user.save()
    console.log(`/addList:${data}`);
    ctx.body = {
      code: '200',
      msg: '',
      result: {
        data
      }
    }
  });
  // 5ea9527467b5b9362cb1e14a
  router.post('/deleteList', async (ctx) => {
  
    let req = ctx.request.body
    let data = await Users.deleteOne( req )
    console.log(`/deleteList:${data}`);
    console.log(req);
    ctx.body = {
      code: '200',
      msg: '',
      result: {
        data
      }
    }
  });
  router.post('/updateList', async (ctx) => {

    let req = ctx.request.body
    let {_id} = ctx.request.body
    console.log(_id);
    console.log(req);  
    let data = await Users.updateOne({_id: _id}, { $set:req })
    // console.log(req);
    ctx.body = {
      status: '200',
      msg: '',
      result: {
        data
      }
    }
  })

  

  module.exports = router