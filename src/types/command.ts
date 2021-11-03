import { CustomClient } from "../lib/client";
import { Message } from "discord.js";

interface Command {
    exec: (client: CustomClient, message: Message, args: string[]) => Promise<any>;
    name: string; 
    description: string;
    usage: string;
    aliases: string; 
    permissions: bigint | string | number; 
    cooldown: number; //helps with ratelimiting.
}