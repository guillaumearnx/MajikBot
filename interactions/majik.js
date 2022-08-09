const fetch = require('node-fetch');
const {AttachmentBuilder} = require("discord.js");

module.exports = {
    config: {
        description: "Magik an image",
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
        const majik = await (await fetch(`https://nekobot.xyz/api/imagegen?type=magik&image=${attachment.attachment}&intensity=${Math.floor(Math.random() * 2) + 1}`)).json();
        attachment = new AttachmentBuilder(`${majik.message}`, {name: `majik-${new Date().getDate()}.png`});
        return interaction.editReply({content: '', files: [attachment]});
    }
}
