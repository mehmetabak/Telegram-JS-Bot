# Telegram JS Bot

[![Netlify Status](https://api.netlify.com/api/v1/badges/eaa06625-995d-46b5-887d-b900919df71b/deploy-status)](https://app.netlify.com/sites/telegram-js/deploys)

This repository contains a Telegram bot implemented in JavaScript, deployed using Netlify and AWS Lambda Functions.

## Getting Started

### Prerequisites

- Node.js installed locally
- A Telegram bot token obtained from BotFather
- GitHub account for version control

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/telegram-bot.git
   cd telegram-bot
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configuration**

   - Rename `.env.example` to `.env` and replace `<your_bot_token>` with your Telegram bot token obtained from BotFather.

### Deployment with Netlify

1. **Create a new site on Netlify**

   - Login to Netlify and select "New site from Git".
   - Choose GitHub as your Git provider and select the repository where you pushed your bot code.

2. **Environment Variables Setup**

   - Navigate to your Netlify site dashboard.
   - Go to "Site settings" > "Build & deploy" > "Environment" > "Environment variables".
   - Add a new environment variable:
     - **Key**: BOT_TOKEN
     - **Value**: Your Telegram bot token obtained from BotFather.

3. **Deploy**

   - Click on "Deploy site" in the Netlify dashboard.
   - Verify deployment status (ensure it shows "Published").

### Setting Up Webhook

1. **Configure Telegram Webhook**

   - Replace `<your_bot_token>` and `<your_site_name>` in the following URL:
     ```
     https://api.telegram.org/bot<your_bot_token>/setWebhook?url=https://<your_site_name>.netlify.app/api/bot
     ```
     For example:
     ```
     https://api.telegram.org/bot5594307469:AAEx9aeF6KeOMaQeAGJ79xa-tAB5RkWOdlg/setWebhook?url=https://venerable-alfajores-c6f46a.netlify.app/api/bot
     ```

2. **Verification**

   - After navigating to the generated URL, you should receive a response:
     ```
     {"ok":true,"result":true,"description":"Webhook was set"}
     ```

### Testing

- Send `/start` command to your Telegram bot. It should reply with a message such as "Hi" indicating it's working correctly.

### Troubleshooting

- If deployment fails, check the deployment logs in Netlify for errors.
- Ensure environment variables are correctly set in Netlify and triggers a redeploy if updated.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Contact Me
Have questions, suggestions, or want to collaborate? Feel free to reach out to me at [mehmetnurabak0@gmail.com](mailto:mehmetnurabak0@gmail.com). We'd love to hear from you!

## License
This project is licensed under the [MIT License](LICENSE).