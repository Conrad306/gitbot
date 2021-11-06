import { Client, Collection } from "discord.js"
import { Command } from "./command"


declare module "discord.js" {
    export interface Client {
        prefix: string;
        category: string[];
        commands: Collection<string, Command>;
        aliases: Collection<string, string>;
        log(type: string, msg: any, title?:string): void;
        loadCommand(
            category: string,
            commandName: string,
            dontLog: boolean
        ): { err: string; res?: undefined } | { res: boolean; err?: undefined };
    }
    export interface Base {
        client: Client
    }
}