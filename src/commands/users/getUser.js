const { MessageEmbed } = require('discord.js')
const axios = require('axios')
module.exports = {
    name: "getuser", 
    aliases: ["user"], 
    description: "Get a github user", 
    usage: "gh!getuser <user>", 
    exec: async (client, message, args) => {
        if(args.length == 0) 
            return message.reply({embeds: [new MessageEmbed({title: "Lacking Arguments", description: "Missing requested argument `user`", color: "RED"})]})
        
        axios.get(`https://api.github.com/users/${args[0]}`).then(async (value) => {
            const returnedData = new MessageEmbed()
                .setTitle(`Info On User: ${value.data.name ?? value.data.login}`)
                .addFields(
                {
                        name: "Repositories",
                        value: `${value.data.public_repos}`,
                        inline: true
                    },
                    {
                        name: "Type",
                        value: `${value.data.type === "Organization" ? ":factory: Organization" : ":mechanic: User"}`
                    },
                    {
                    name: ":map: Location",
                    value: `${value.data.location}`,
                    inline: true
                    },
                    {
                        name: ":notepad_spiral: Bio",
                        value: `${value.data.bio}`,
                        inline: true
                    },
                    {
                        name: "Followers",
                        value: `${value.data.followers}`,
                        inline: true
                    },
                    {
                        name: "Following",
                        value: `${value.data.following}`,
                        inline: true
                    } ,
                    {
                        name: ":calendar_spiral: Created at",
                        value: new Date(value.data.created_at).toLocaleDateString(),
                        inline: true
                    }
                )
                .setURL(value.data.html_url)
                .setThumbnail(value.data.avatar_url)
                .setColor("GREEN")
            await message.channel.send({embeds: [returnedData]})
        }).catch((e) => {
            console.log(e);
            message.channel.send("Whoops! Seems like something went wrong. Maybe the data you provided doesn't exist?")
        })

    }
}
