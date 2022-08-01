const {deployInteractions, loadInteractions} = require("../utils/functions");

module.exports = async (bot) => {
    console.info(`\nLogged in as ${bot.user.tag}!`.blue);
    bot.interactions = await loadInteractions(bot);
    deployInteractions(true, bot.interactions).catch(e => console.error(e));
}
