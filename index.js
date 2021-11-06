require("dotenv").config();

const { readdirSync } = require('fs')
const { Client, Collection } = require('discord.js')
const client = new Client({
    intents: [
        'GUILDS', 
        'GUILD_MESSAGES'
    ]
});


require('./util/functions')(client);
require("./util/handler")(client);
client.prefix = "gh!";
client.commands = new Collection();
client.aliases = new Collection();
client.categories = readdirSync("./src/commands/");


client.login(process.env.token)