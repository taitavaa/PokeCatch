const { SlashCommandBuilder } = require("discord.js");

const User = require('../../Schemas.js/userAccount');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('free-robux')
    .setDescription('Give money to another player')
    .addUserOption(option => option.setName('recipent').setDescription('The player you want to give money to').setRequired(true))
    .addIntegerOption(option => option.setName('amount').setDescription('The amount of money you want to give').setRequired(true)),

  async execute (interaction) {
    try {

      const sender = interaction.user;
      const recipent = interaction.options.getUser('recipent');
      const amount = interaction.options.getInteger('amount');

      const senderData = await User.findOne({ userId: sender.id });
      if (!senderData) {
        return interaction.reply({ content: 'You don\'t have an account yet. Use the /start command to create one.', ephemeral: false });
      }

      const recipentData = await User.findOne({ userId: recipent.id });
      if (!recipentData) {
        return interaction.reply({ content: 'The person you\'re trying to send coins to, doesn\'t have an account yet.', ephemeral: false });
      }

      if (amount < 1 ) {
        return await interaction.reply({ content: 'Stop avoiding taxes and gib me moni', ephemeral: false });
      } else {recipentData.balance += amount;
      await senderData.save();
      await recipentData.save(); 
    }

      await interaction.reply('You have successfully given ' + amount + ' GYAAATTTTTTTTTTTTTdollars to ' + recipent.username + '.')
    } catch (error) {
      console.log(error);
      await interaction.reply("An error occurred while giving money.");
    }
  }
}