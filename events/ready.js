const {REST} = require('@discordjs/rest');
const {CLIENT} = require("../config.json");

// noinspection JSCheckFunctionSignatures,JSClosureCompilerSyntax
const rest = new REST({version: '10'}).setToken(CLIENT['TOKEN']);
const {Routes} = require('discord.js');

module.exports = async (bot) => {
    console.info(`\nLogged in as ${bot.user.tag}!`.blue);
    const interactions = Array.from(bot.interactions.values());
    if (interactions.length > 0) try {
        await rest.put(Routes.applicationGuildCommands(CLIENT['ID'], CLIENT['MAIN_GUILD_ID']), {body: interactions})
    } catch (err) {
        console.error(err);
        process.exit(-2);
    }
    console.log((`A total of ${bot.interactions.size} (/) commands were loaded.`).green);
}
