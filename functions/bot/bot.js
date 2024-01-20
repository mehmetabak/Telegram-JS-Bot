const { Telegraf } = require("telegraf");
const axios = require('axios');

const bot = new Telegraf(process.env.BOT_TOKEN);

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
    ctx.reply('·Send /start to receive a greeting, \n \n·Send /getpdf to receive the pdfs, \n \n·Send /sites to receive my all websites.');
});

bot.command('sites', async (ctx) => {
  const htmlText = `
📌 <a href="https://m0s.vercel.app"><b>Personal Blog</b></a>
  - [Blog Icon](https://img.samsungapps.com/productNew/000006342365/IconImage_20220606075816050_NEW_WAP_ICON_512_512.png)

📄 <a href="https://cv-ma.vercel.app"><b>CV</b></a>
  - [File Icon](https://www.svgrepo.com/show/112988/cv-file-interface-symbol.svg)

🚀 <a href="https://mehmetabak.is-a.dev"><b>Portfolio</b></a>
  - [Code Branch Icon](https://img.samsungapps.com/productNew/000006342365/IconImage_20220606075816050_NEW_WAP_ICON_512_512.png)

🏢 <a href="https://arastir.super.site"><b>Research Projects</b></a>
  - [Building Icon](https://img.samsungapps.com/productNew/000006342365/IconImage_20220606075816050_NEW_WAP_ICON_512_512.png)

📂 <a href="https://github.com/memoli0"><b>GitHub Profile</b></a>
  - [GitHub Icon](https://www.svgrepo.com/show/512317/github-142.svg)

📝 <a href="https://medium.com/@mehmetnurAbak"><b>Medium Articles</b></a>
  - [Medium Icon](https://www.svgrepo.com/show/521749/medium.svg)

💻 <a href="https://dev.to/memoli0"><b>Dev.to Profile</b></a>
  - [Dev.to Icon](https://www.svgrepo.com/show/349334/dev-to.svg)

🌐 <a href="https://mehmetabak.hashnode.dev/"><b>Hashnode Blog</b></a>
  - [Hashnode Icon](https://www.svgrepo.com/show/330611/hashnode.svg)

🐦 <a href="https://twitter.com/Mehmetn45363159"><b>Twitter Profile</b></a>
  - [Twitter Icon](https://www.svgrepo.com/show/513008/twitter-154.svg)

🔗 <a href="https://www.linkedin.com/in/mehmet-a-12a716226/"><b>LinkedIn Profile</b></a>
  - [LinkedIn Icon](https://www.svgrepo.com/show/521725/linkedin.svg)
`;

  await ctx.replyWithHTML(htmlText, { disable_web_page_preview: true });
});


//Experimental

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