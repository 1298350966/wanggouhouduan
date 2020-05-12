const router = require('koa-router')()
const mongoose = require('mongoose');
const Goods = require('../models/goods');

router.prefix('/goods')
mongoose.connect('mongodb://127.0.0.1:27017/admin');

mongoose.connection.on("connected", function () {
  console.log("MongoDB connected success.")
});

mongoose.connection.on("error", function () {
  console.log("MongoDB connected fail.")
});

mongoose.connection.on("disconnected", function () {
  console.log("MongoDB connected disconnected.")
});

//商品列表模块实现
router.get('/list', async (ctx, next) => {
  console.log(parseInt(ctx.query.page))

  console.log(parseInt(ctx.query.pageSize))
  console.log(ctx.query.priceLevel)
  console.log(ctx.query.sort)

  let page = parseInt(ctx.query.page);
  let pageSize = parseInt(ctx.query.pageSize);
  let priceLevel = ctx.query.priceLevel;
  let sort = ctx.query.sort;
  let skip = (page - 1) * pageSize;
  var priceGt = '', priceLte = '';
  let params = {};
  if (priceLevel != 'all') {
    switch (priceLevel) {
      case '0': priceGt = 0; priceLte = 100; break;
      case '1': priceGt = 100; priceLte = 500; break;
      case '2': priceGt = 500; priceLte = 1000; break;
      case '3': priceGt = 1000; priceLte = 5000; break;
    }
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    }
  }

  let goodsModel = await Goods.find(params).skip(skip).limit(pageSize).sort({ 'salePrice': sort })

  ctx.body = {
    status: '0',
    msg: '',
    result: {
      count: goodsModel.length,
      list: goodsModel
    }
  }

})

router.post("/addCart", async (ctx) => {
  var userId = '100000077', productId = ctx.request.body.productId;
  console.log(productId);
  var User = require('../models/user');
  await User.findOne({ userId: userId }, async (err, userDoc) => {
    if (err) {
      ctx.body = {
        status: "1",
        msg: err.message
      }
    } else {
      console.log("userDoc:" + userDoc);
      if (userDoc) {
        var goodsItem = '';
        userDoc.cartList.forEach((item) => {
          if (item.productId == productId) {
            goodsItem = item;
            item.productNum++;
          }
        });
        if (goodsItem) {
          await userDoc.save((err2, doc2) => {
            if (err2) {
              ctx.body = {
                status: "1",
                msg: err2.message
              }
            } else {
              ctx.body = {
                status: '0',
                msg: '',
                result: 'suc'
              }
            }
          })
          ctx.body = {
            status: '0',
            msg: '',
            result: 'suc'
          }
        } else {
          await Goods.findOne({ productId: productId },async (err1, doc) => {
            if (err1) {
              ctx.body = {
                status: "1",
                msg: err1.message
              }
            } else {
              if (doc) {
                doc.productNum = 1;
                doc.checked = 1;
                userDoc.cartList.push(doc);
                await userDoc.save((err2, doc2) => {
                  if (err2) {
                    return ctx.body = {
                      status: "1",
                      msg: err2.message
                    }
                  } else {
                    return ctx.body = {
                      status: '0',
                      msg: '',
                      result: 'suc'
                    }
                  }
                })
                ctx.body = {
                  status: '0',
                  msg: '',
                  result: 'suc'
                }
              }
            }
            
          });
          
        }
      }
    }
  })
});



router.get('/', async (ctx, next) => {
  // let _id = 2
  // if(!_id){
  //   ctx.body = {
  //     a:1
  //   }
  // }else{
  let b = "1";
  if (true) {
    if (b) {
      await Goods.find({}, async (err, doc) => {
        if (err) {
          ctx.body = {
            status: '1',
            msg: err.message,
            result: ''
          }
        } 
        else {
          if (true) {
             if (!true) {
              await Goods.find({}, (err, doc) => {
                if (doc) {
                  ctx.body = {
                    status: '0',
                    msg: '',
                    result: 1
                  }
                }
              })
            } else {
              await Goods.findOne({}, (err, doc) => {
                if (doc) {
                  ctx.body = {
                    status: '0',
                    msg: '',
                    result: doc
                  }
                }
              })
            }
          }
           
          }
        })

    }

  }

})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router