export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
import { Bot, webhookCallback } from 'grammy';

function getFullName(from) {
	return from.last_name
		? `${from.first_name} ${from.last_name}`
		: from.first_name;
}

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) throw new Error('TELEGRAM_BOT_TOKEN environment variable not found.');

const bot = new Bot(token);

bot.command("start", async (ctx) => {
    await ctx.reply("Welcome! Up and running.");
  })

// about user
bot.command("me", async (ctx) => {
    const msg = `Hi ${getFullName(ctx.from)}.
    
    Here's a little info about yourself on telegram:
    
    Your name: ${getFullName(ctx.from)}
    Your Telegram user ID: ${ctx.from.id}
    Your Telegram username: ${ctx.from.username ? ctx.from.username : "N/A"}
    
  
    ------------------------------------
  
    Bye Bye 👋
    
    `;
  
    await ctx.reply(msg);
  });


bot.on('message:text', async (ctx) => {
  await ctx.reply(ctx.message.text);
})

export const POST = webhookCallback(bot, 'std/http');
