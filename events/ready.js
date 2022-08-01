const {deployInteractions, loadInteractions, removeIntegrations} = require("../utils/functions");

module.exports = async (bot) => {
    console.info(`\nLogged in as ${bot.user.tag}!`.blue);
    bot.interactions = await loadInteractions(bot);
    if (process.env.DEV)
        removeIntegrations().then(() => {
            deployInteractions(!process.env.DEV, bot.interactions)
        }).catch(e => console.error(e));
    else
        deployInteractions(!process.env.DEV, bot.interactions).catch(e => console.error(e));
}
