import { Command } from "types/command"
import { CustomClient } from "../lib/client";
import { Message } from "discord.js";

const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export default async (client: CustomClient, message: Message) => {
    if(message.author.bot || !message.guild) return;
    const prefixRegex = new RegExp(
        `^(<@!?${client.user?.id}>|${escapeRegex(client.prefix)})\\s*`
    );
    if (!prefixRegex.test(message.content)) return;
    const match: RegExpMatchArray | null = message.content.match(prefixRegex);
    if(!match) return;

    const [, matchedPrefix] = match;


    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
    const cmd: string | undefined = args.shift()?.toLowerCase();
    if (!cmd || cmd.length === 0) return;

    if (cmd?.length === 0) return;

    let command: Command | undefined;
    // eslint-disable-next-line max-len
    if (client.commands.has(cmd)) command = client.commands.get(cmd);
    else command = client.commands.get(<string>client.aliases.get(cmd));

    if(command) {
        await command.exec(client, message, args);
    }
}
