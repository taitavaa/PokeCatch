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

      const pokeballPrices = {
        'Pokeball': { price: 10, quantity: 0 },
        'Greatball': { price: 50, quantity: 0 },
        'Ultraball': { price: 100, quantity: 0 },
        'Masterball': { price: 500, quantity: 0 }
      };

      const shopEmbed = new EmbedBuilder()
        .setTitle('Pokéball Emporium')
        .setDescription("Welcome!  Stock up on Pokéballs!")
        .setColor('Blue');

      // Correct field structure
      const fields = []; 
      for (const ballType in pokeballPrices) {
        fields.push({
          name: ballType,
          value: `Price: ${pokeballPrices[ballType].price} Pokédollars`,
          inline: true // Make fields side-by-side
        });
      }

      shopEmbed.addFields(fields); // Add the fields array

      shopEmbed.setFooter({ text: `Your current balance: ${user.balance} Pokédollars` });

      const pokeballButton = new ButtonBuilder()
        .setCustomId('pokeball-buy')
        .setLabel('Buy Pokéballs')
        .setStyle('Primary');

      const greatballButton = new ButtonBuilder()
        .setCustomId('greatball-buy')
        .setLabel('Buy Greatballs')
        .setStyle('Primary');

      const ultraballButton = new ButtonBuilder()
        .setCustomId('ultraball-buy')
        .setLabel('Buy Ultraballs')
        .setStyle('Primary');

      const masterballButton = new ButtonBuilder()
        .setCustomId('masterball-buy')
        .setLabel('Buy Masterballs')
        .setStyle('Primary');

      const buttonRow = new ActionRowBuilder().addComponents(
        pokeballButton,
        greatballButton,
        ultraballButton,
        masterballButton
      );

      const reply = await interaction.reply({ content: `Use /buy plz, get free cash using /free-robux` });

    } catch (error) {
      console.log(error);
      await interaction.reply('An error occurred while accessing the Pokéball Shop.');
    }
  }
};