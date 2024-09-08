const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ComponentType } = require('discord.js');
const User = require('../../Schemas.js/userAccount'); // Adjust the path if necessary

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('Browse the shop for Pokéballs!'),
  async execute(interaction) {
    try {
      const user = await User.findOne({ userId: interaction.user.id });

      if (!user) {
        return interaction.reply({ content: 'You don\'t have an account yet. Use the /start command to create one.', ephemeral: false });
      }

      const shopEmbed = new EmbedBuilder()
        .setTitle('PokéMarket')
        .setDescription(
          
          `**===How to Buy===**\n\`/buy (item name or id) (amount)\` \n for example:\n\`/buy pokeball 69\`\n\`/buy 1 69\`\n\n**===Currencies===**\n<:Coin:1281622719745757204>Coins: ${user.balance}  \n\n**===Pokéballs===**\n<:Reply_Cont:1282003687828623400> \`1\`<:Pokeball:1281616987889340568>Pokéballs: 100\n<:Reply_Cont:1282003687828623400> \`2\`<:Greatball:1281616969103179877>Greatballs: 100\n<:Reply_Cont:1282003687828623400> \`3\`<:Ultraball:1281616793915359303>Ultraballs: 100\n<:Reply_Cont:1282003687828623400> \`4\`<:Masterball:1281613764428304475>Masterballs: 100`
        
        )
        .setColor('Blue')
      shopEmbed.setFooter({ text: `Your current balance: ${user.balance} ` });

      await interaction.reply({ embeds: [shopEmbed] });


    } catch (error) {
      console.log(error);
      await interaction.reply('An error occurred while accessing the Market.');
    }
  }
};