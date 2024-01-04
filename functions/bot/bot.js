const { Telegraf } = require("telegraf")

const bot = new Telegraf(process.env.BOT_TOKEN)

const BASE_URL = "https://yeni.isleronline.com/uploads/assets/soruhavuzu_test/isleronline-{}.pdf"

bot.start(ctx => {
    console.log("Received /start command")
    try {
        return ctx.reply("Hi")
    } catch (e) {
        console.error("error in start action:", e)
        return ctx.reply("Error occured")
    }
})

bot.help((ctx) => {
    ctx.reply('Send /start to receive a greeting')
    ctx.reply('Send /keyboard to receive a message with a keyboard')
    ctx.reply('Send /quit to stop the bot')
})

  // Start the bot
bot.launch()

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