# Interaction Example

```js
module.exports = {
    config: {
        description: "description",
        category: 'Utils',
        specialPermissions: '', //you can choose between "administrator" or "moderator" or nothing
        name: __filename.slice(__dirname.length + 1, __filename.length - 3),
        inBotChannels: false, //if true, the command must be used in a channel specified in the config.json file
    },
    options: [
        //Optionnal fields
        {type: 7, name: 'user', description: 'Mention user.', required: false},
        {type: 8, name: 'channel', description: 'Mention channel.', required: true},
        {
            type: 4, name: 'mode', description: 'Application mode.', required: false,
            choices: [
                {name: "Fast Mode", value: 1},
                {name: "Full Mode", value: 2}
            ]
        }
    ],
    run: async (client, interaction, options = []) => {
        //Main Instructions
        console.log(options);
    }
}
```

# Options :

| Number |    Type     | Choices |
|:------:|:-----------:|:-------:|
|   3    |   String    |   ✔️    |
|   4    |   Integer   |   ✔️    |
|   5    |   Boolean   |    ❌    |
|   6    |    User     |    ❌    |
|   7    |   Channel   |    ❌    |
|   8    |    Role     |    ❌    |
|   9    | Mentionable |    ❌    |
|   10   |   Number    |   ✔️    |
|   11   | Attachment  |    ❌    |