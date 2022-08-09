const {Delete} = require("discord-image-generation");
const {AttachmentBuilder} = require("discord.js");

module.exports = {
    config: {
        description: "Delete trash",
        category: 'Utils',
        specialPermissions: '',
        name: __filename.slice(__dirname.length + 1, __filename.length - 3),
        inBotChannels: true,
    },
    options: [
        {type: 11, name: 'image', description: 'Used image', required: true},
    ],
    run: async (client, interaction, options = []) => {
        await interaction.deferReply();
        let attachment = options.find(o => o.name === 'image')?.attachment;
        if (!attachment) return interaction.editReply(':x: You need to provide an image');
        if (attachment.size > 8000000) return interaction.editReply(':warning: Image too big');
        attachment = new AttachmentBuilder((await new Delete().getImage(`${attachment.attachment}`)), {name: `delete-${new Date().getDate()}.png`});
        return interaction.editReply(attachment);
    }
}
