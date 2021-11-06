
const klaw = require('klaw');
const path = require('path');
const {promisify} = require("util");
const readdir = promisify(require('fs').readdir);
module.exports = async (client) => {
    client.log('Load', 'Loading commands')
    klaw('./src/commands').on("data", (item) => {
        let category = item.path.match(/\w+(?=[\\/][\w\-.]+$)/)[0]
        const cmdFile = path.parse(item.path);
        if (!cmdFile.ext || cmdFile.ext !== ".js") return;
        if (category === 'commands') client.log('Load', `Did not load command ${cmdFile.name.red} because it has no category`)
        else {
            let { err } = client.loadCommand(category, `${cmdFile.name}${cmdFile.ext}`, false);
            if (err) console.log(err);
        }
    });

    const evtFiles = await readdir('./src/events')
    client.log('Load', `Loading a total of ${evtFiles.length} events`)
    klaw('./src/events').on("data", (item) => {
        const evtFile = path.parse(item.path);
        if (!evtFile.ext || evtFile.ext !== ".js") return;
        const event = require(`../src/events/${evtFile.name}${evtFile.ext}`);
        client.on(evtFile.name, event.bind(null, client));
        client.log('EVENT BIND', `Event ${evtFile.name.green.bgBlack} was linked to file ${(evtFile.name + evtFile.ext).green.bgBlack}`)
    });
}