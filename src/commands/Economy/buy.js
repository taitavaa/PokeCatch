const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ComponentType } = require('discord.js');
const User = require('../../Schemas.js/userAccount.js');

const { pokemonData } = require('../../data/pokemonData.js');

const items = {
    "pokeball": 1,
    "greatball": 2,
    "ultraball": 3,
    "masterball": 4,

    "placeholder1": 5,
    "placeholder2": 6,
}

const price = {
    "pokeball": 10,
    "greatball": 20,
    "ultraball": 30,
    "masterball": 40,
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Buy an item.')
        .addStringOption(option =>
            option.setName('item')
                .setDescription('The Item you want to buy.')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount of item you want to buy.')
                .setRequired(true)
        ),

    async execute(interaction) {
        try {
            const sender = interaction.user;
            const user = await User.findOne({ userId: sender.id });

            if (!user) {
                return interaction.reply({ content: 'You don\'t have an account yet. Use the /start command to create one.', ephemeral: false });
            }

            const item = interaction.options.getString('item');
            const amount = interaction.options.getInteger('amount');

            if (!items[item]) {
                return interaction.reply({ content: `Couldn't find an item named "${item}". Please check your spelling.`, ephemeral: false });
            }

            if (user.balance < price[item] * amount) {
                return interaction.reply({ content: `You don't have enough money to buy ${amount} ${item}.`, ephemeral: false });
            }

            user.balance -= price[item] * amount;
            user[item] += amount;
            await user.save();
            await interaction.reply({ content: `You successfully bought ${amount} ${item}.`, ephemeral: false });
        } catch (error) {
            console.error(error);
            await interaction.reply('An error occurred while buying an item.');
        }
    }
}