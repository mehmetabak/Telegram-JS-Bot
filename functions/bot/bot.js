const { Telegraf } = require("telegraf")
const axios = require('axios');

const bot = new Telegraf(process.env.BOT_TOKEN)

const BASE_URL = "https://yeni.isleronline.com/uploads/assets/soruhavuzu_test/isleronline-{}.pdf"

bot.start(ctx => {
    console.log("Received /start command")
    try {
        return ctx.reply("Hi " + ctx.from.first_name + " ,you can get all commands with /help command")
    } catch (e) {
        console.error("error in start action:", e)
        return ctx.reply("Error occured")
    }
})

bot.help((ctx) => {
    ctx.reply('·Send /start to receive a greeting, \n·Send /getpdf to receive the pdfs.')
  });

//Experimental

// Handle /getpdf command
bot.command('getpdf', async (ctx) => {
    try {
        // Simulate sending URLs for checking concurrently
        const promises = [];
        for (let value = 1621844600; value < 1621844700; value++) {
          promises.push(checkAndNotify(ctx, value));
        }
        await Promise.all(promises);
      } catch (error) {
        console.error('An error occurred:', error.message);
      }
  });
  
  // Function to fetch URL and send message with inline keyboard
  async function checkAndNotify(ctx, value) {
    const url = BASE_URL.replace('{}', value);
  
    try {
      const response = await axios.get(url);
      const content = response.data;
  
      // Check if the content is not empty and does not contain "Not Found"
      if (content && !content.includes("Not Found")) {
        console.log(`Valid URL: ${url}\nText Content Length: ${content.length}`);
  
        // Send a message to the user with inline keyboard
        const keyboard = {
          inline_keyboard: [
            [{ text: 'Approve', callback_data: `approve_${value}` }],
            [{ text: 'Reject', callback_data: `reject_${value}` }]
          ]
        };
  
        const message = `Valid URL: ${url}\nText Content Length: ${content.length}\n\nWhat do you want to do?`;
        await ctx.reply(message, { reply_markup: JSON.stringify(keyboard) });
      }
    } catch (error) {
      console.error(`Error accessing ${url}: ${error.message}`);
    }
  }
  
  // Handle inline keyboard button clicks
  bot.action(/(approve|reject)_\d+/, (ctx) => {
    const [action, value] = ctx.match[0].split('_');
    const url = BASE_URL.replace('{}', value);
    // Implement your logic here based on the user's choice
    ctx.reply(`You chose to ${action} URL ${url}`);
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