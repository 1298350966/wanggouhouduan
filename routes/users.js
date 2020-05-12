const router = require('koa-router')()
const User = require('../models/user');
router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})
router.post('/login',async function(ctx, next) {
  var param = {
    userName:ctx.request.body.userName,
    userPwd:ctx.request.body.userPwd
}
console.log(param);
await  User.findOne(param, function (err,doc) {
  if(err){ 
    ctx.body = {
          status:"0",
          msg:err.message
      }
  }else{
      if(doc){
        ctx.cookies.set("userId",doc.userId,{
              path:'/',
              maxAge:1000*60*60 
          });
          ctx.cookies.set("userName",doc.userName,{
            path:'/',
            maxAge:1000*60*60
          });
          //req.session.user = doc;
          ctx.body = {
              status:'0',
              msg:'',
              result:{
                  userName:doc.userName
              }
          }
      }
  }
});
});

router.post('/logout', function (ctx, next) {
  console.log(ctx.cookies);
  ctx.cookies.set("userId","",{
    path:"/",
    maxAge:0
  })
  ctx.body = {
    status:"0",
    msg:'',
    result:''
  }
})
router.get("/checkLogin", function (ctx,next) {
  if(ctx.cookies.get("userId")){
    ctx.body = {
        status:'0',
        msg:'',
        result:ctx.cookies.get("userName") || ''
      }
  }else{
    ctx.body = {
      status:'1',
      msg:'未登录',
      result:''
    }
  }
});

router.get("/getCartCount",async function (ctx,next) {
  if(ctx.cookies.get("userId")){
    console.log("userId:"+ctx.cookies.get("userId"));
    var userId = ctx.cookies.get("userId");
    await User.findOne({"userId":userId}, function (err,doc) {
      if(err){
        ctx.body = {
          status:"0",
          msg:err.message
        }
      }else{
        let cartList = doc.cartList;
        let cartCount = 0;
        cartList.map(function(item){
          cartCount += parseFloat(item.productNum);
        });
        ctx.body = {
          status:"0",
          msg:"",
          result:cartCount
        }
      }
    });
  }else{
    ctx.body = {
      status:"0",
      msg:"当前用户不存在"
    }
  }
});

//查询当前用户的购物车数据
router.get("/cartList",async function (ctx,next) {
  var userId = ctx.cookies.get("userId");
  console.log(userId);
  await User.findOne({userId:userId}, function (err,doc) {
      if(err){
        ctx.body = {
          status:'1',
          msg:err.message,
          result:''
        }
      }else{
          if(doc){
            ctx.body = {
              status:'0',
              msg:'',
              result:doc.cartList
            }
          }
      }
  });
});

//购物车删除
router.post("/cartDel",async function (ctx,next) {
  var userId = ctx.cookies.get("userId"),productId = ctx.request.body.productId;
  await User.update({
    userId:userId
  },{
    $pull:{
      'cartList':{
        'productId':productId
      }
    }
  }, function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      ctx.body = {
        status:'0',
        msg:'',
        result:'suc'
      } 
    }
  });
});

//修改商品数量
router.post("/cartEdit",async function (ctx,next) {
  var userId = ctx.cookies.get("userId"),
      productId = ctx.request.body.productId,
      productNum = ctx.request.body.productNum,
      checked = ctx.request.body.checked;
  await  User.update({"userId":userId,"cartList.productId":productId},{
    "cartList.$.productNum":productNum,
    "cartList.$.checked":checked,
  }, function (err,doc) {
    if(err){
      ctx.body = {
        status:'1',
        msg:err.message,
        result:''
      }
    }else{
      ctx.body = {
        status:'0',
        msg:'',
        result:'suc'
      }
    }
  })
});
router.post("/editCheckAll",async function (ctx,next) {
  var userId = ctx.cookies.get("userId"),
      checkAll = ctx.request.body.checkAll?'1':'0';
  await User.findOne({userId:userId}, function (err,user) {
    if(err){
      ctx.body = {
        status:'1',
        msg:err.message,
        result:''
      }
    }else{
      if(user){
        user.cartList.forEach((item)=>{
          item.checked = checkAll;
        })
        user.save(function (err1,doc) {
            if(err1){
              ctx.body = {
                status:'1',
                msg:err1,message,
                result:''
              }
            }else{
              ctx.body = {
                status:'0',
                msg:'',
                result:'suc'
              }
            }
        })
      }
    }
  });
});
//查询用户地址接口
router.get("/addressList",async function (ctx,next) {
  var userId = ctx.cookies.get("userId");
  await User.findOne({userId:userId}, function (err,doc) {
    if(err){
      ctx.body = ({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      ctx.body = ({
        status:'0',
        msg:'',
        result:doc.addressList
      });
    }
  })
});
//设置默认地址接口
router.post("/setDefault",async function (ctx,next) {
  var userId = ctx.cookies.get("userId"),
      addressId = ctx.request.body.addressId;
  if(!addressId){
    ctx.body = {
      status:'1003',
      msg:'addressId is null',
      result:''
    } 
  }else{
  await  User.findOne({userId:userId}, function (err,doc) {
      if(err){
        ctx.body = {
          status:'1',
          msg:err.message,
          result:''
        }
      }else{
        var addressList = doc.addressList;
        addressList.forEach((item)=>{
          if(item.addressId ==addressId){
             item.isDefault = true;
          }else{
            item.isDefault = false;
          }
        });

        doc.save(function (err1,doc1) {
          if(err){
            ctx.body = {
              status:'1',
              msg:err.message,
              result:''
            }
          }else{
            ctx.body = {
                status:'0',
                msg:'',
                result:''
            }
          }
        })
      }
    });
  }
});

//删除地址接口
router.post("/delAddress",async function (ctx,next) {
  var userId = ctx.cookies.get("userId"),addressId = ctx.request.body.addressId;
  await User.update({
    userId:userId
  },{
    $pull:{
      'addressList':{
        'addressId':addressId
      }
    }
  }, function (err,doc) {
      if(err){
        ctx.body = {
            status:'1',
            msg:err.message,
            result:''
        }
      }else{
        ctx.body = {
          status:'0',
          msg:'',
          result:''
        }
      }
  });
});

router.post("/payMent",async function (ctx,next) {
  var userId = ctx.cookies.get("userId"),
    addressId = ctx.request.body.addressId,
    orderTotal = ctx.request.body.orderTotal;
  await User.findOne({userId:userId}, function (err,doc) {
     if(err){
      ctx.body = {
            status:"1",
            msg:err.message,
            result:''
        }
     }else{
       var address = '',goodsList = [];
       //获取当前用户的地址信息
       doc.addressList.forEach((item)=>{
          if(addressId==item.addressId){
            address = item;
          }
       })
       //获取用户购物车的购买商品
       doc.cartList.filter((item)=>{
         if(item.checked=='1'){
           goodsList.push(item);
         }
       });

       var platform = '622';
       var r1 = Math.floor(Math.random()*10);
       var r2 = Math.floor(Math.random()*10);

       var sysDate = new Date().Format('yyyyMMddhhmmss');
       var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
       var orderId = platform+r1+sysDate+r2;
       var order = {
          orderId:orderId,
          orderTotal:orderTotal,
          addressInfo:address,
          goodsList:goodsList,
          orderStatus:'1',
          createDate:createDate
       };

       doc.orderList.push(order);

       doc.save(function (err1,doc1) {
          if(err1){
            ctx.body = {
              status:"1",
              msg:err.message,
              result:''
            }
          }else{
            ctx.body = {
              status:"0",
              msg:'',
              result:{
                orderId:order.orderId,
                orderTotal:order.orderTotal
              }
            }
          }
       });
     }
  })
});
//根据订单Id查询订单信息
router.get("/orderDetail",async function (ctx,next) {
  var userId = ctx.cookies.get("userId"),orderId = ctx.query.orderId;
  await User.findOne({userId:userId}, function (err,userInfo) {
      if(err){
        ctx.body = {
             status:'1',
             msg:err.message,
             result:''
          }
      }else{
         var orderList = userInfo.orderList;
         if(orderList.length>0){
           var orderTotal = 0;
           orderList.forEach((item)=>{
              if(item.orderId == orderId){
                orderTotal = item.orderTotal;
              }
           });
           if(orderTotal>0){
            ctx.body = {
               status:'0',
               msg:'',
               result:{
                 orderId:orderId,
                 orderTotal:orderTotal
               }
             }
           }else{
            ctx.body = {
               status:'120002',
               msg:'无此订单',
               result:''
             }
           }
         }else{
          ctx.body = {
             status:'120001',
             msg:'当前用户未创建订单',
             result:''
           }
         }
      }
  })
});
module.exports = router
