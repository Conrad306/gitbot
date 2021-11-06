import { Client, Message, MessageEmbed } from "discord.js";
import { Command } from "types/command";
import axios from "axios";

const getUser: Command = {
    name: "getuser",
    aliases: ['user'],
    usage: "gh!user <user>",
    category: "users",
    description: "Fetch a user from github",
    exec: async(client: Client, message: Message, args: string[]) => {
        if(args.length == 0)
            return message.reply({embeds: [new MessageEmbed({title: "Lacking Arguments", description: "Missing requested argument `user`", color: "RED"})]})

        const { data } = await axios.get(`https://api.github.com/users/${args[0]}`).catch(() => {
            message.channel.send("Whoops! Seems like something went wrong. Maybe the data you provided doesn't exist?")
        })

        const embed = new MessageEmbed()
            .setTitle(`Info on User: ${data.name ?? data.login}`)
            .addFields(   {
                    name: "Repositories",
                    value: `${data.public_repos}`,
                    inline: true
                },
                {
                    name: "Type",
                    value: `${data.type === "Organization" ? ":factory: Organization" : ":mechanic: User"}`
                },
                {
                    name: ":map: Location",
                    value: `${data.location ?? "None"}`,
                    inline: true
                },
                {
                    name: ":notepad_spiral: Bio",
                    value: `${data.bio ?? : "No Bio"}`,
                    inline: true
                },
                {
                    name: "Followers",
                    value: `${data.followers}`,
                    inline: true
                },
                {
                    name: "Following",
                    value: `${data.following}`,
                    inline: true
                } ,
                {
                    name: ":calendar_spiral: Created at",
                    value: new Date(data.created_at).toLocaleDateString(),
                    inline: true
                }
            )
            .setURL(data.html_url)
            .setThumbnail(data.avatar_url)
            .setColor("GREEN")

        message.reply({embeds: [embed]})
    }
}

export default getUser;
