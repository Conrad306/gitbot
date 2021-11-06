
import { Message, Client } from "discord.js";

export interface Command {
    exec: (client: Client, message: Message, args: string[]) => Promise<any>;
    name: string; 
    description: string;
    usage: string;
    category: string;
    init?: (client: Client) => never;
    aliases: string[];
}