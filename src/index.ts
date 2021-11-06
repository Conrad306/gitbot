
import { Collection, Intents } from "discord.js";
import path, { join } from "path";

import { Command } from "types/command";
import { CustomClient } from "./lib/client";
import dotenv from "dotenv";
import klaw from "klaw";

dotenv.config();

// if (process.env.mongodb_connection_url) {
//     mongoose.connect(process.env.mongodb_connection_url, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useFindAndModify: false,
//         useCreateIndex: true,
//     });
// }

const client = new CustomClient({
    partials: ["MESSAGE", "CHANNEL", "REACTION", "USER", "GUILD_MEMBER"],
    intents: [
        Intents.FLAGS.GUILDS |
        Intents.FLAGS.GUILD_MESSAGES |
        Intents.FLAGS.GUILD_MEMBERS |
        Intents.FLAGS.GUILD_INTEGRATIONS |
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    ],
    allowedMentions: {
        repliedUser: false,
    },
});
client.prefix = "gh!";

client.commands = new Collection();
client.aliases = new Collection();
const run = async () => {
    klaw(join(__dirname, "commands")).on("data", (item) => {
        const cmdFile = path.parse(item.path);
        const category = item.path.match(/\w+(?=[\\/][\w\-\.]+$)/)[0];

        if (!cmdFile.ext || ![".js", ".ts"].includes(cmdFile.ext)) return;
        if (category === "commands") {
            client.log(
                "Load",
                `Did not load command ${cmdFile.name.red} because it has no category`
            );
        } else {
            const { err } = client.loadCommand(
                category,
                `${cmdFile.name}${cmdFile.ext}`,
                false
            );

            if (err) {
                console.log(err);
            }
        }
    });
    klaw(join(__dirname, "events")).on("data", (item) => {
        const evtFile = path.parse(item.path);

        if (!evtFile.ext || (evtFile.ext !== ".ts" && evtFile.ext !== ".js")) return;

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { default: event } = require(join(
            __dirname,
            "events",
            `${evtFile.name}${evtFile.ext}`
        ));
        client.on(evtFile.name, event.bind(null, client));
        client.log("EVENT LOAD", `Binding ${evtFile.name}...`);
    });
    await client.login(process.env.token);
};

export default run();