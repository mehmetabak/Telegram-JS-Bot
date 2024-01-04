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

// Handle /getpdf command
bot.command('getpdf', (ctx) => {
    // Simulate sending URLs for checking
    for (let value = 1621844600; value < 1621844700; value++) {
      checkAndNotify(ctx, value);
    }
  });
  
  // Function to fetch URL and send message with inline keyboard
  async function checkAndNotify(ctx, value) {
    const url = BASE_URL.replace('{}', value);
  
    try {
      const response = await fetch(url);
  
      // Check if the response status is OK
      if (!response.ok) {
        console.error(`Error accessing ${url}: ${response.statusText}`);
        return;
      }
  
      const content = await response.text();
  
      // Check if the content is not empty and does not contain "Not Found"
      if (content && !content.includes("Not Found")) {
        console.log(`Valid URL: ${url}\nText Content Length: ${content.length}`);
  
        // Send a message to the user with inline keyboard
        const keyboard = Markup.inlineKeyboard([
          Markup.button.callback('Approve', `approve_${value}`),
          Markup.button.callback('Reject', `reject_${value}`)
        ]);
  
        const message = `Valid URL: ${url}\nText Content Length: ${content.length}\n\nWhat do you want to do?`;
        await ctx.reply(message, keyboard);
      }
    } catch (error) {
      console.error(`Error accessing ${url}: ${error.message}`);
    }
  }
  
  // Handle inline keyboard button clicks
  bot.action(/(approve|reject)_\d+/, (ctx) => {
    const [action, value] = ctx.match[0].split('_');
  
    // Implement your logic here based on the user's choice
    ctx.reply(`You chose to ${action} URL ${value}`);
  });

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