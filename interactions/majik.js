const fetch = require('node-fetch');

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
        const magik = await (await fetch(`https://nekobot.xyz/api/imagegen?type=magik&image=${attachment.attachment}&intensity=${Math.floor(Math.random() * 4) + 1}`)).json();
        return interaction.editReply(magik.message);
    }
}
