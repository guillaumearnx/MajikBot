const { Routes, Collection, SlashCommandBuilder } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { CLIENT } = require("../config.json");
const { sep } = require("path");
const { promises } = require("fs");
require("colors");

const deployInteractions = async (global = false, interactions = false) => {
	console.info("\nDeploying interactions".blue + ` ${global ? "on all guilds".cyan : "on main guild".cyan}`);
	if (!interactions) {
		interactions = await loadInteractions();
	}
	if (interactions.size > 0) {
		// noinspection JSClosureCompilerSyntax,JSCheckFunctionSignatures
		const rest = new REST({ version: "10" }).setToken(CLIENT["TOKEN"]);
		if (global) {
			await rest.put(Routes.applicationCommands(CLIENT["ID"]), { body: interactions });
		}
		else {
			// noinspection JSUnresolvedFunction
			await rest.put(Routes.applicationGuildCommands(CLIENT["ID"], CLIENT["MAIN_GUILD_ID"]), { body: interactions });
		}
		console.log("\nIntegrations deployed".green);
	}
};

const loadInteractions = async () => {
	const interactions = new Collection();
	let nbInteractions = 0;
	try {
		const files = await promises.readdir("./interactions/");
		console.log(`\n(${files.length}) interactions`.yellow);
		files.forEach((file) => {
			if (!file.endsWith(".js") || file.substring(file.indexOf(sep) + 1).startsWith("-")) return;
			const interaction = require(`../interactions/${file}`);
			const name = interaction.config.name;
			const commandBuilder = new SlashCommandBuilder().setName(name).setDescription(interaction.config.description);
			console.log("\tLoading interaction : " + `/${name}`.red);
			interaction.options.map(op => {
				switch (op.type) {
				case 3:
					commandBuilder.addStringOption(option => buildOptionWithChoices(op, option));
					break;
				case 4:
					commandBuilder.addIntegerOption(option => buildOptionWithChoices(op, option));
					break;
				case 5:
					commandBuilder.addBooleanOption(option => option.setName(op.name.toLowerCase()).setDescription(op.description).setRequired(op.required ? op.required : false));
					break;
				case 6:
					commandBuilder.addUserOption(option => option.setName(op.name.toLowerCase()).setDescription(op.description).setRequired(op.required ? op.required : false));
					break;
				case 7:
					commandBuilder.addChannelOption(option => option.setName(op.name.toLowerCase()).setDescription(op.description).setRequired(op.required).setRequired(op.required ? op.required : false));
					break;
				case 8:
					commandBuilder.addRoleOption(option => option.setName(op.name.toLowerCase()).setDescription(op.description).setRequired(op.required ? op.required : false));
					break;
				case 10:
					commandBuilder.addNumberOption(option => buildOptionWithChoices(op, option));
					break;
				case 11:
					commandBuilder.addAttachmentOption(option => option.setName(op.name.toLowerCase()).setDescription(op.description).setRequired(op.required ? op.required : false));
					break;
				}
			});
			commandBuilder.config = interaction.config;
			interactions.set(name, commandBuilder);
			nbInteractions++;
		});
	}
	catch (err) {
		console.error(err);
		process.exit(533);
	}
	if (nbInteractions === 0) console.log("No interactions".yellow); else console.log(`\n${nbInteractions} interaction(s) loaded`.yellow);
	return interactions;
};

const removeIntegrations = async () => {
	// noinspection JSCheckFunctionSignatures,JSClosureCompilerSyntax
	const rest = new REST({ version: "10" }).setToken(CLIENT["TOKEN"]);
	await rest.put(Routes.applicationCommands(CLIENT["ID"]), { body: [] });
	// noinspection JSUnresolvedFunction
	await rest.put(Routes.applicationGuildCommands(CLIENT["ID"], CLIENT["MAIN_GUILD_ID"]), { body: [] });
	console.log("\nIntegrations removed".green);
};

const buildOptionWithChoices = (optionData, optionCreated) => {
	{
		optionCreated = optionCreated.setName(optionData.name.toLowerCase()).setDescription(optionData.description).setRequired(optionData.required).setRequired(optionData.required ? optionData.required : false);
		if (optionData.choices) {optionCreated = optionCreated.addChoices(...optionData.choices);}
		return optionCreated;
	}
};

module.exports = {
	deployInteractions, loadInteractions, removeIntegrations,
};