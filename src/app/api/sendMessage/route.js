const { Bot, InputFile } = require("grammy");

const bot = new Bot("");

export async function POST(req) {
    const {clients} = await req.json();

    const timer = ms => new Promise(res => setTimeout(res, ms));

    const msg = 
`‼️Дорогие друзья! Мы переезжаем в телеграм канал ‼️

@lovesmore_perfume — теперь это главный источник информации: ПРОМОКОДЫ на скидки, новинки, эксклюзивные акции, афиши маркетов и, конечно, общение друг с другом! 🌸

Присоединяйся - будет ароматно!

Ps: ПРОМОКОД на скидку при заказе на сайте -11% в честь 8 марта ищи там в закрепе! Действует до 10.08 включительно`;

    async function load () {
        for (var i = 0; i < clients.length; i++) {
            //bot.api.sendPhoto(clients[i].name, new InputFile("/Users/surgejackson/Desktop/IMG_5861.JPG"), {caption: msg});

            bot.api.sendMessage(clients[i].name, msg);
            console.log(`TEST ${clients[i].name} ${i}`, msg);
            await timer(3000);
        }
    }

    await load();

    console.log('SENT');
    return Response.json({});
}
