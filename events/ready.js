const { deployInteractions, loadInteractions, removeIntegrations } = require("../utils/functions");

module.exports = async (bot) => {
	console.info(`\nLogged in as ${bot.user.tag}!`.blue);
	bot.interactions = await loadInteractions(bot);
	if (process.env.DEV) {
		try {
			await removeIntegrations();
			await deployInteractions(!process.env.DEV, bot.interactions);
		}
		catch (err) {
			console.error(err);
			process.exit(533);
		}
	}
	else {deployInteractions(!process.env.DEV, bot.interactions).catch(e => console.error(e));}
};
