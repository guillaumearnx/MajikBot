const {checkOwner} = require('../utils/functions')
const {CHANNELS} = require("../config.json")

module.exports = async (bot, interaction) => {
    if (interaction.isChatInputCommand()) {
        const interactionCommand = bot.interactions.get(interaction.commandName);
        const file = require(`../interactions/${interaction.commandName}`);
        if (!interactionCommand || !file) return;
        try {
            if ((file.config.specialPermissions.toLowerCase() === 'owner' && !await checkOwner(interaction.user.id)) || (file.config.specialPermissions.toLowerCase() === 'moderator' && !interaction.member.permissions.has('KICK_MEMBERS', true))) {
                return interaction.reply({content: 'You can\'t do that !', ephemeral: true});
            }
            if (!interaction.member.permissions.has('ADMINISTRATOR', true)) {
                if (file.config.specialPermissions.toLowerCase() === 'administrator') {
                    return interaction.reply({content: 'You can\'t do that !', ephemeral: true});
                }
                if (file.config.mandatoryChannel && ([CHANNELS["COMMANDS"], CHANNELS["PUBLIC_COMMANDS"]].indexOf(interaction.channel.id) < 0)) {
                    return interaction.reply({
                        content: `You can\'t do that here ! ${CHANNELS["COMMANDS"] ? `Try in <#${CHANNELS["COMMANDS"]}>` : CHANNELS["PUBLIC_COMMANDS"] ? `Try in <#${CHANNELS["BOT_PUBLIC_COMMANDS"]}>` : ''}`,
                        ephemeral: true
                    });
                }
            }
            await file.run(bot, interaction);
        } catch (error) {
            console.error(error)
            await interaction.reply({
                content: 'There was an error while executing this command!', ephemeral: true
            });
        }
    }

};