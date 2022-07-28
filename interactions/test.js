module.exports = {
    config: {
        description: "description",
        category: 'Utils',
        specialPermissions: '', //choose between "administrator" or "moderator" or nothing
        name: __filename.slice(__dirname.length + 1, __filename.length - 3),
        inBotChannel: false, //Si true, commande uniquement faisable dans un channel bot
    },
    options: [
    ],
    run: async (client, interaction) => {
        return interaction.reply({content: 'This command is not yet implemented !', ephemeral: true});
    }
}
