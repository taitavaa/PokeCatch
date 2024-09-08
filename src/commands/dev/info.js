const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const User = require('../../Schemas.js/userAccount');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get information about a user.'),

    async execute(interaction) {
        try {
            const sender = interaction.user;
            const user = await User.findOne({ userId: sender.id });
            if (!user) {
                return interaction.reply({ content: 'You don\'t have an account yet. Use the /start command to create one.', ephemeral: false });
            }

            const embed = new EmbedBuilder()
                .setTitle('User Information')
                .addFields(
                    { name: 'User ID', value: user.userId, inline: true },
                    { name: 'User Name', value: user.userName, inline: true },
                    { name: 'Balance', value: `${user.balance}`, inline: true },

                )
                .setTimestamp()
                .setFooter({ text: 'GYAAATTTTTTTTTTTTT' });
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.log(error);
            await interaction.reply("An error occurred while viewing your data");
        }
    }
}