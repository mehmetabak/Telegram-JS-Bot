const { Telegraf } = require("telegraf");
const axios = require('axios');

const bot = new Telegraf(process.env.BOT_TOKEN);

const version = 'v0.11'

const htmlText = `
📌 <a href="https://m0s.vercel.app"><b>Personal Blog</b></a>

📄 <a href="https://cv-ma.vercel.app"><b>CV</b></a>

🚀 <a href="https://mehmetabak.is-a.dev"><b>Portfolio</b></a>

🏢 <a href="https://arastir.super.site"><b>Research Projects</b></a>

📂 <a href="https://github.com/memoli0"><b>GitHub Profile</b></a>

📝 <a href="https://medium.com/@mehmetnurAbak"><b>Medium Articles</b></a>

💻 <a href="https://dev.to/memoli0"><b>Dev.to Profile</b></a>

🌐 <a href="https://mehmetabak.hashnode.dev/"><b>Hashnode Blog</b></a>

 𝕏  <a href="https://twitter.com/Mehmetn45363159"><b>X Profile</b></a>

🔗 <a href="https://www.linkedin.com/in/mehmet-a-12a716226/"><b>LinkedIn Profile</b></a>
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
    ctx.reply('·Send /start to receive a greeting, \n \n·Send /getpdf to receive the pdfs, \n \n·Send /t3Check to check if the t3 site is working , \n \n·Send /v0 to get version of bot , \n \n·Send /sites to receive my all websites.');
});

bot.command('sites', async (ctx) => {
  await ctx.replyWithHTML(htmlText, { disable_web_page_preview: true });
});

bot.command('v0', async (ctx) => {
  await ctx.reply('Bot version is: ' + version);
});

//Experimental

bot.command('t3Check', async (ctx) => {
  try {
      const commandParams = ctx.message.text.split(' ').slice(1);
      const url = 'https://t3kys.com/';

      // Validate command parameters
      const durationInMinutes = parseInt(commandParams[0]);
      if (isNaN(durationInMinutes) || durationInMinutes <= 0) {
          return ctx.reply('Please provide a valid positive number for the duration in minutes.');
      }

      // Initialize variables
      let isWebsiteWorking = false;

      // Function to check website status asynchronously
      const checkWebsiteStatus = async () => {
          try {
              console.log('Checking website status...');
              const response = await axios.get(url);

              // Check for successful HTTP status codes
              if (response.status >= 200 && response.status < 300) {
                  isWebsiteWorking = true;
                  console.log('Website is working.');
                  ctx.reply('The website is working.'); // Send message to user
              } else {
                  // Send error message to user for non-successful status codes
                  console.log(`Failed to check website status. Status code: ${response.status}`);
                  ctx.reply(`Failed to check website status. Status code: ${response.status}`);
              }
          } catch (error) {
              // Send error message to user for network or other errors
              console.error(`Failed to check website status: ${error.message}`);
              ctx.reply(`Failed to check website status: ${error.message}`);
          }
      };

      // Function to recursively check website status every minute
      const checkWebsiteRecursive = async () => {
          try {
              await checkWebsiteStatus();
              if (!isWebsiteWorking) {
                  setTimeout(checkWebsiteRecursive, 60 * 1000); // Wait for 1 minute before next check
              }
          } catch (error) {
              console.error('Error during website check:', error.message);
          }
      };

      // Start checking website status
      checkWebsiteRecursive();

      // Stop checking website status after specified duration
      setTimeout(() => {
          if (!isWebsiteWorking) {
              console.log('Website is not working.');
              ctx.reply('The website is not working.');
          }
      }, durationInMinutes * 60 * 1000); // Convert minutes to milliseconds
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