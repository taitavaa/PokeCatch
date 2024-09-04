const { SlashCommandBuilder } = require("discord.js");

const User = require('../../Schemas.js/userAccount');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription("Check your balance."),

  async execute (interaction) {
    try {
      const existingUser = await User.findOne({ userId: interaction.user.id });

      if(existingUser) {
        const formattedBalls = existingUser.pokeball.toLocaleString();
        const formattedBalance = existingUser.balance.toLocaleString();
        await interaction.reply(`Your balance is: ${formattedBalance} GYAAATTTTTTTTTTTTTdollars and you have ${formattedBalls} Pokéballs.`);
        
      } else {
        await interaction.reply('You don\'t have an account yet. Use the /start command to create one.')
      }
        
    } catch (error) {
      console.log(error);
      await interaction.reply("An error occurred while checking your balance.");
    }
  }
}