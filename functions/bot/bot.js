const { Telegraf } = require("telegraf")
const Extra = require('telegraf/extra')
const session = require('telegraf/session')
const { reply, fork } = Telegraf

const bot = new Telegraf(process.env.BOT_TOKEN)
const randomPhoto = 'https://picsum.photos/200/300/?random'

bot.use(session())

// Register logger middleware
bot.use((ctx, next) => {
    const start = new Date()
    return next().then(() => {
      const ms = new Date() - start
      console.log('response time %sms', ms)
    })
  })

bot.start(ctx => {
  console.log("Received /start command")
  try {
    return ctx.reply("Hi")
  } catch (e) {
    console.error("error in start action:", e)
    return ctx.reply("Error occured")
  }
})

bot.command('cat', ({ replyWithPhoto }) => replyWithPhoto({ url: randomPhoto}))

// AWS event handler syntax (https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html)
exports.handler = async event => {
  try {
    await bot.handleUpdate(JSON.parse(event.body))
    return { statusCode: 200, body: "" }
  } catch (e) {
    console.error("error in handler:", e)
    return { statusCode: 400, body: "This endpoint is meant for bot and telegram communication" }
  }
}