const { Telegraf } = require("telegraf");
const axios = require('axios');

const bot = new Telegraf(process.env.BOT_TOKEN);

const version = 'v0.2.1'

// 📄 <a href="https://cv-ma.vercel.app"><b>CV</b></a>

const htmlText = `
📌 <a href="https://m0s.space"><b>Personal Blog</b></a>

🚀 <a href="https://mehmetabak.is-a.dev"><b>Portfolio</b></a>

🏢 <a href="https://arastir.super.site"><b>Research Projects</b></a>

📂 <a href="https://github.com/mehmetabak"><b>GitHub Profile</b></a>

📝 <a href="https://abakmehmet.medium.com/"><b>Medium Articles</b></a>

💻 <a href="https://dev.to/mehmetabak"><b>Dev.to Profile</b></a>

🌐 <a href="https://mehmetabak.hashnode.dev/"><b>Hashnode Blog</b></a>

 𝕏  <a href="https://x.com/mehmet_m0s"><b>X Profile</b></a>

🔗 <a href="https://www.linkedin.com/in/mehmet-abak"><b>LinkedIn Profile</b></a>
`;

const BASE_URL = "https://yeni.isleronline.com/uploads/assets/soruhavuzu_test/isleronline-{}.pdf";

bot.start(async (ctx) => {
    console.log("Received /start command");
    try {
        await ctx.reply("Hi " + ctx.from.first_name + ", you can get all commands with /help command");
    } catch (e) {
        console.error("error in start action:", e);
        await ctx.reply("Error occured");
    }
})

bot.help(async (ctx) => {
  ctx.replyWithHTML(`<b>COMMANDS v1.0</b>\n\n<b>• Send /who to know who I am,</b>\n\n<b>• Send /posts to get all my telegra.ph posts,</b>\n\n<b>• Send /v0 to get the version of the bot,</b>\n\n<b>• Send /sites to receive all my websites,</b>\n\n<b>COMMANDS v2.0 (beta) </b>\n\n<b>• Send /getpdf to receive the PDFs,</b>\n\n<b>• Send /t3Check to check if the t3 site is working.</b>`);
});

bot.command('sites', async (ctx) => {
  await ctx.replyWithHTML(htmlText, { disable_web_page_preview: true });
});

bot.command('who', async (ctx) => {
  await ctx.replyWithHTML('Who am I?');
});

bot.command('v0', async (ctx) => {
  await ctx.reply('Bot version is: ' + version);
});

bot.command('posts', async (ctx) => {
  try {
      const response = await axios.get(`https://api.telegra.ph/getPageList?access_token=${process.env.BOT_T}`);
    
      console.error('Data: ' + response.data.result)

      const posts = response.data.result.pages.map(page => {
          return {
              title: page.title,
              url: `https://telegra.ph/${page.path}`
          };
      });
      
      let message = 'Here are my posts:\n\n';
      posts.forEach(post => {
          message += `<a href="${post.url}">•${post.title}</a>\n\n`;
      });
      
      ctx.replyWithHTML(message);
  } catch (error) {
      console.error('Error retrieving posts:', error.message);
      ctx.reply('An error occurred while retrieving your posts.');
  }
});

//Experimental

//This stuppid code isn't working!
bot.command('t3Check', async (ctx) => {
    try {
        const url = 'https://t3kys.com/';

        // Function to check website status asynchronously
        const checkWebsiteStatus = async () => {
            try {
                const response = await axios.get(url);

                // Check for successful HTTP status codes
                if (response.status >= 200 && response.status < 300) {
                    ctx.reply('The website is working.'); // Send message to user
                    return true; // Website is working
                } else {
                    // Send error message to user for non-successful status codes
                    ctx.reply(`Failed to check website status. Status code: ${response.status}`);
                }
            } catch (error) {
                // Send error message to user for network or other errors
                ctx.reply(`Failed to check website status: ${error.message}`);
            }

            return false; // Website is not working
        };

        // Function to recursively check website status with exponential backoff
        const checkWebsiteRecursive = async (retryDelay = 1000, maxRetryDelay = 30000) => {
            try {
                const isWorking = await checkWebsiteStatus();
                if (!isWorking) {
                    const nextRetryDelay = Math.min(retryDelay * 2, maxRetryDelay);
                    setTimeout(() => checkWebsiteRecursive(nextRetryDelay), nextRetryDelay);
                }
            } catch (error) {
                console.error('Error during website check:', error.message);
            }
        };

        // Start checking website status
        checkWebsiteRecursive();
    } catch (error) {
        console.error('An error occurred:', error.message);
        ctx.reply('An error occurred while checking the website status.');
    }
});

// Handle /getpdf command
bot.command('getpdf', async (ctx) => {
  try {
    const commandParams = ctx.message.text.split(' ').slice(1);
    let [startValue, endValue] = commandParams.map(Number);

    if (isNaN(startValue) || isNaN(endValue) || commandParams.length !== 2) {
      startValue = 1621844600;
      endValue = 1621844700;
      await ctx.reply('Please provide two numeric values after the /getpdf command If you want something other than the normal sources.');
    
      // Simulate sending URLs for checking concurrently
      await ctx.reply('Search is starting...');
      const promises = [];
      for (let value = startValue; value < endValue; value++) {
        promises.push(checkAndNotify(ctx, value, endValue - value));
      }
      await Promise.all(promises);
    }else {
      // Simulate sending URLs for checking concurrently
      await ctx.reply('Search is starting...');
      const promises = [];
      for (let value = startValue; value < endValue; value++) {
        promises.push(checkAndNotify(ctx, value, endValue - value));
      }
      await Promise.all(promises);
    }
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
});
  
// Function to fetch URL and send message with inline keyboard
async function checkAndNotify(ctx, value, step) {
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

      if(step == 1){
        await ctx.reply('Search is finished.');
      }
    }
  } catch (error) {
    console.error(`Error accessing ${url}: ${error.message}`);
    if(step == 1){
      await ctx.reply('Search is finished. URL`s are sending');
    }
  }
}
  
// Handle inline keyboard button clicks
bot.action(/(approve|reject)_\d+/, (ctx) => {
  const [action, value] = ctx.match[0].split('_');
  const url = BASE_URL.replace('{}', value);
  // Implement your logic here based on the user's choice
  if(`approve` == action){
    ctx.reply(`You chose to ${action} URL: ${url}`);
  }else {
    ctx.reply(`You chose to ${action} :( `);
  }
});

// If Command isn't valid
bot.on('text', (ctx) => {
  ctx.reply("Sorry, that command is not valid. Send /help to see available commands.");
});

//AWS

// AWS event handler syntax (https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html)
exports.handler = async event => {
  try {
    await bot.handleUpdate(JSON.parse(event.body));
    return { statusCode: 200, body: "" };
  } catch (e) {
    console.error("error in handler:", e);
    return { statusCode: 400, body: "This endpoint is meant for bot and telegram communication" };
  }
}
