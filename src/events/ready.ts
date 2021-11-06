import {Client} from "discord.js";


export default async (client: Client) => {
    console.log(`Logged in as ${client.user?.username}`);
}