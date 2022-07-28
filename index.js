//Dependencies
const {Client, Collection} = require('discord.js');
const {SlashCommandBuilder} = require('@discordjs/builders');
const {run} = require('npm-check-updates');
const fs = require('fs');
const path = require('path')
const {CLIENT} = require('./config.json');
require('colors');

//Config check
(() => {
    if (!fs.existsSync('./config.json')) {
        console.error("Please create a config.json");
        process.exit(-1)
    }
    const empty = ["", " ", null, undefined]
    if (empty.indexOf(CLIENT['TOKEN']) > -1) {
        console.error("Please set a bot token !");
        process.exit(0);
    }
    if (empty.indexOf(CLIENT['MAIN_GUILD_ID']) > -1) {
        console.error("Please set your main guild id !");
        process.exit(0);
    }
})()

//Env
let nbEvents = 0, nbInteractions = 0;

//Client
const bot = new Client({
    intents: 32767
});

bot.aliases = new Collection();
bot.interactions = new Collection();

console.log(("Lancement du bot ...").red);

//Packages
(async () => {
    const r = await run({
        packageFile: 'package.json'
    });
    if (Object.keys(r).length > 0) {
        console.log('Some updates are availables'.yellow)
        for (const [key, value] of Object.entries(r)) {
            console.log(`${key} -> ${value}`.magenta)
        }
    } else console.log('All packages are up-to-date'.magenta)
})();

//Events
fs.readdir('./events/', (err, files) => {
    if (err) return console.error(err)
    console.log(`\n(${files.length}) events`.yellow);
    files.forEach(file => {
        if (!file.endsWith('.js') || file.substring(file.indexOf(path.sep) + 1).startsWith('-')) return;
        nbEvents++
        const event = require(`./events/${file}`);
        let eventName = file.split('.')[0];
        bot.on(eventName, event.bind(null, bot))
        console.log(`\tLoading event : ` + `${eventName}`.blue);
    })
    if (nbEvents === 0) console.log("No active events".yellow)
});

//Interactions
fs.readdir('./interactions/', (err, files) => {
    if (err) return console.error(err);
    console.log(`\n(${files.length}) interactions`.yellow);
    files.forEach((file) => {
        if (!file.endsWith('.js') || file.substring(file.indexOf(path.sep) + 1).startsWith('-')) return
        const interaction = require(`./interactions/${file}`);
        const name = interaction.config.name;
        const commandBuilder = new SlashCommandBuilder().setName(name).setDescription(interaction.config.description)
        console.log(`\tLoading interaction : ` + `/${name}`.red);
        interaction.options.map(op => {
            const {type} = op;
            switch (type) {
                case 1:
                    commandBuilder.addUserOption(option => option.setName(op.name.toLowerCase()).setDescription(op.description).setRequired(op.required ? op.required : false));
                    break;
                case 2:
                    commandBuilder.addRoleOption(option => option.setName(op.name.toLowerCase()).setDescription(op.description).setRequired(op.required ? op.required : false));
                    break;
                case 3:
                    commandBuilder.addChannelOption(option => option.setName(op.name.toLowerCase()).setDescription(op.description).setRequired(op.required).setRequired(op.required ? op.required : false));
                    break;
                case 4:
                    commandBuilder.addStringOption(option => option.setName(op.name.toLowerCase()).setDescription(op.description).setRequired(op.required).setRequired(op.required ? op.required : false));
                    break;
                case 5:
                    commandBuilder.addIntegerOption(option => option.setName(op.name.toLowerCase()).setDescription(op.description).setRequired(op.required ? op.required : false).addChoices(op.choices ? op.choices : []));
                    break;
                case 6:
                    commandBuilder.addBooleanOption(option => option.setName(op.name.toLowerCase()).setDescription(op.description).setRequired(op.required ? op.required : false));
                    break;
                case 7:
                    commandBuilder.addMentionableOption(option => option.setName(op.name.toLowerCase()).setDescription(op.description).setRequired(op.required ? op.required : false))
                    break;
            }
        })
        bot.interactions.set(name, commandBuilder);
        nbInteractions++;
    })
    if (nbInteractions === 0) console.log("No interactions".yellow)
});

//Login to API
bot.login(CLIENT['TOKEN']).catch(() => {
    console.log("Can't connect ...");
    process.exit(0);
});

//Debug
bot.on("warn", (e) => console.warn(e));
process.on('unhandledRejection', async (error) => {
    console.error(error)
    process.exit(-1)
}).on('uncaughtException', async (error) => {
    console.error(error)
    process.exit(-1)
})

//Export
module.exports = {
    bot
}
