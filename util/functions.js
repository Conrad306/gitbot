const { MessageEmbed, Message, Client} = require('discord.js');
const moment = require('moment');
require('colors');
const {Collector} = require("discord.js");
module.exports = (client) => {

    
    client.log = (type, msg, title) => {
    if (!title) title = "Log";
    else title = title.magenta.bold
    if (!type) type = 'Null'
    if (['err', 'error'].includes(type.toLowerCase())) type = type.bgRed.white.bold

    console.log(`[${moment().format('D/M/Y HH:mm:ss.SSS').bold.blue}] [${type.green}] [${title.yellow}] ${msg}`);
    };


    let lastCategoryLoaded;
    client.loadCommand = (category, commandName, dontLog) => {
      try {
        const props = require(`${process.cwd()}/src/commands/${category}/${commandName}`);
        if(lastCategoryLoaded !== category){
          client.log("Load", `Starting to load all commands from the category ${category}`);
          lastCategoryLoaded = category;
        }
        if (!dontLog) {
          client.log("Load", `  ${"=>".blue} ${"Loading Command:".white} ${props.name.green}.`);
        }
        if (props.init) {
          props.init(client);
        }
        if (category) props.category = category
        client.commands.set(props.name, props);
        props.aliases.forEach(alias => {
          client.aliases.set(alias, props.name);
        });
        return {
          res: true
        };
      } catch (e) {
        console.log(e)
        return {
          err: `Unable to load command ${commandName} in ${category}: ${e}`
        };
      }
    };
}