const router = require('koa-router')()


router.get('/string', async (ctx, next) => {
  ctx.body = '1111'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: '11111n'
  }
})

module.exports = router
