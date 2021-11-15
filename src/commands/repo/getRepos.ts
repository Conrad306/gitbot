import { Command } from "types/command";
import { Client, Message, MessageEmbed } from "discord.js"
import axios from "axios"
const getRepository: Command = {
    name: "getrepository",
    usage: "gh!getrepo <user> <repository name>",
    aliases: ["getrepo", "repo"],
    description: "f",
    category: "repo",
    exec: async (client: Client, message: Message, args: string[]) => {
        if(args.length == 0 || args.length == 1)
            return message.reply({embeds: [new MessageEmbed({
                    title: "Lacking Arguments",
                    description: "Missing requested argument `user` and/or requested argument `repository name`",
                    color: "RED"
                })
                ]
            })
        const {data: {
            created_at,
            description,
            forks_count,
            full_name,
            html_url,
            name,
            owner,
            stargazers_count,
            watchers
        }} = await axios.get(`https://api.github.com/repos/${args[0]}/${args[1]}`).catch(() => {
            message.channel.send("Whoops! It seems this request failed. Are you sure this repository is public or that you provided the correct information?")
        });
        const returnedData = new MessageEmbed()
            .setTitle(`Information on Repository: ${name}`)
            .setDescription(description ?? "")
            .addFields(
                {
                    name: "Repository Name",
                    value: `${full_name}`,
                    inline: true
                },
                {
                    name: "Forks",
                    value: `${forks_count}`,
                    inline: true
                },
                {
                    name: ":star: Stars",
                    value: `${stargazers_count}`,
                    inline: true
                },
                {
                    name: "Owner",
                    inline: true,
                    value: `${owner.name ?? owner.login}`
                },
                {
                    name: "Created At",
                    value: new Date(created_at).toLocaleDateString(),
                    inline: true
                },
                {
                    name: "Watchers",
                    value: `${watchers}`,
                    inline: true
                }
            )
            .setColor("GREEN")
            .setURL(html_url)
            .setThumbnail(owner.avatar_url)
        message.reply({embeds: [returnedData]})
    },

}
export default getRepository;
