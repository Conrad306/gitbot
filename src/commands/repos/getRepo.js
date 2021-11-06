const { MessageEmbed } = require('discord.js')
const axios = require('axios')
module.exports = {
    name: "getrepository", 
    aliases: ["getrepo", "repo"], 
    description: "Get a github repository", 
    usage: "gh!getrepository <user> <repository name>", 
    exec: async(client, message, args) => {
        if(args.length == 0 || args.length == 1) 
            return message.reply({embeds: [new MessageEmbed({
                title: "Lacking Arguments", 
                description: "Missing requested argument `user` and/or requested argument `repository name`", 
                color: "RED"
                })
            ]
        })
        
        axios.get(`https://api.github.com/repos/${args[0]}/${args[1]}`).then((value) => {

            const returnedData = new MessageEmbed()
                .setTitle(`Information on repository: ${value.data.name}`)
                .addFields(
                    {
                        name: "Repository Name",
                        value: `${value.data.full_name}`,
                        inline: true
                    },
                    {
                        name: "Forks",
                        value: `${value.data.forks_count}`,
                        inline: true
                    },
                    {
                        name: ":star: Stars",
                        value: `${value.data.stargazers_count}`,
                        inline: true
                    },
                    {
                        name: "Owner",
                        inline: true,
                        value: `${value.data.owner.name ? value.data.owner.name : value.data.owner.login}`
                    },
                    {
                        name: "Created At",
                        value: new Date(value.data.created_at).toLocaleDateString(),
                        inline: true
                    },
                    {
                        name: "Watchers",
                        value: `${value.data.watchers}`,
                        inline: true
                    }
                )
                .setURL(value.data.html_url)
                .setDescription(value.data.description)
                .setThumbnail(value.data.owner.avatar_url)
                .setColor("GREEN")
            message.reply({ embeds: [returnedData ]})
        }).catch((e) => {
            console.log(e)
            message.reply(`Whoops! It seems this request failed. Are you sure this repository is public or that you provided the correct information?`)
        })
    }
}