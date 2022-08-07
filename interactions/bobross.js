const {Bobross} = require("discord-image-generation");
const {AttachmentBuilder} = require("discord.js");

module.exports = {
    config: {
        description: "We don't make mistakes just happy little accidents",
        category: 'Utils',
        specialPermissions: '', //you can choose between "administrator" or "moderator" or nothing
        name: __filename.slice(__dirname.length + 1, __filename.length - 3),
        inBotChannels: true, //if true, the command must be used in a channel specified in the config.json file
    },
    options: [
        //Optionnal fields
        {type: 11, name: 'image', description: 'Used image', required: true},
    ],
    run: async (client, interaction, options = []) => {
        //Main Instructions
        await interaction.deferReply();
        let attachment = options.find(o => o.name === 'image')?.attachment;
        if (!attachment) return interaction.editReply(':x: You need to provide an image');
        if (attachment.size > 8000000) return interaction.editReply(':warning: Image too big');
        //REGLER UASSI DANS PR DOC
        attachment = new AttachmentBuilder((await new Bobross().getImage(`${attachment.attachment}`)), {name: `bobross-${new Date().getDate()}.png`});
        return interaction.editReply({
            content: 'We don\'t make mistakes just happy little accidents',
            files: [attachment]
        });
    }
}
