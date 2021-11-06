import { Client, ClientOptions} from "discord.js";
import { Command } from "types/command";
import colors from "colors";
import { join } from "path";
import { promisify } from "util";
import moment from "moment";
import table from "table"

export class CustomClient extends Client {
    wait = promisify(setTimeout);

    constructor(options: ClientOptions) {
        super(options);

        // `await client.wait(1000);` to "pause" for 1 second.

        // These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
        process.on("uncaughtException", (err) => {
            if (err.stack) {
                const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
                console.error("Uncaught Exception: ", errorMsg);
            }

            // Always best practice to let the code crash on uncaught exceptions.
            // Because you should be catching them anyway.
            process.exit(1);
        });

        process.on("unhandledRejection", (err) => {
            console.error("Uncaught Promise Error: ", err);
        });
    }

    log(type: string, msg: string | null, title?: string): void {
        if (!title) {
            title = "Log";
        } else {
            title = colors.magenta.bold(title);
        }

        if (!type) {
            type = "Null";
        }

        if (["err", "error"].includes(type.toLowerCase())) {
            type = colors.bgRed.white.bold(type);
        }

        console.log(
            `[${colors.blue.bold(moment().format("D/M/Y HH:mm:ss.SSS"))}] [${type.green}] [${
                title.yellow
            }] ${msg}`
        );
    }
    loadCommand(
        category: string,
        commandName: string,
        dontLog: boolean
    ): { err: string; res?: undefined } | { res: boolean; err?: undefined } {
        let lastCategoryLoaded;
        try {
            const req = require(join(
                __dirname,
                "..",
                "commands",
                category,
                commandName
            ));
            const props: Command = req.default;
            if (lastCategoryLoaded !== category) {
                this.log(
                    "MESSAGE CATEGORY",
                    `Starting to load all commands from the category ${category}`
                );
                lastCategoryLoaded = category;
            }
            if (!dontLog) {
                try {
                    this.log(
                        "MESSAGE",
                        `  ${"=>".blue} ${"Loading Command:".white} ${props.name.green}.`
                    );
                } catch (e) {
                    console.log(
                        table([
                            [
                                `${"COMMAND FAIL".red}`,
                                `${`commands/${category}/${commandName}`} failed to load.`,
                            ],
                        ])
                    );
                }
            }
            if (props.init) {
                props.init(this);
            }
            if (category) props.category = category;
            this.commands.set(props.name, props);
            props.aliases.forEach((alias: any) => {
                this.aliases.set(alias, props.name);
            });
            return {
                res: true,
            };
        } catch (e) {
            console.log(e);
            return {
                err: `Unable to load command ${commandName} in ${category}: ${e}`,
            };
        }
    }
}