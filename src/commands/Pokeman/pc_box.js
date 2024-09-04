const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ComponentType } = require('discord.js');
const User = require('../../Schemas.js/userAccount');

// Define the rarity order (highest to lowest)
const rarityOrder = [
  'What The Fuck',
  'Mythical',
  'Legendary',
  'Very Rare',
  'Rare',
  'Uncommon',
  'Common',
  'Shiny', // Shiny is the highest rarity (I really need to make a better rarity system)
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pc')
    .setDescription('View your caught Pokémon!'),
  async execute(interaction) {
    try {
      const user = await User.findOne({ userId: interaction.user.id });
      if (!user) {
        await interaction.reply('You don\'t have any caught Pokémon yet!');
        return;
      }

      // Calculate total pages
      const totalPages = Math.ceil(user.caughtPokemon.length / 10);
      let currentPage = 1;

      // Sort Pokwqwrfegsvdgsrhngffbsgrethnbsewrehdfmon by rarity (descending) once at the beginning
      user.caughtPokemon.sort((a, b) => {

        // rarity order or sum
        const rarityIndexA = rarityOrder.indexOf(a.rarity);
        const rarityIndexB = rarityOrder.indexOf(b.rarity);

        // Compare the rarity weights or something lol. Higher index means lower rarity.
        if (rarityIndexA < rarityIndexB) {

          return -1; // a comes before b
        } else if (rarityIndexA > rarityIndexB) {

          return 1; // b comes before a
        } else {

          // If rarities are equal, compare dex numbers, looks better.
          return b.dexnum - a.dexnum;
        }
      });

      // Create the initial embed
      const dexEmbed = createDexEmbed(user, currentPage);

      // Create pagination buttons
      const prevButton = new ButtonBuilder()
        .setLabel("Previous")
        .setStyle("Secondary")
        .setCustomId("prev-page");

      const nextButton = new ButtonBuilder()
        .setLabel("Next")
        .setStyle("Secondary")
        .setCustomId("next-page");

      const buttonRow = new ActionRowBuilder().addComponents(prevButton, nextButton);

      // Send the initial message with the embed and buttons
      const reply = await interaction.reply({ embeds: [dexEmbed], components: [buttonRow] });

      // Collect button interactions
      const filter = (i) => i.user.id === interaction.user.id;
      const collector = reply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter,
        time: 10_000, // 10 seconds
      });

      // Handle button interactions
      collector.on('collect', async (interaction) => {
        if (interaction.customId === 'prev-page') {
          currentPage--;
          if (currentPage < 1) {
            currentPage = totalPages;
          }
          await interaction.update({ embeds: [createDexEmbed(user, currentPage)], components: [buttonRow] });
        } else if (interaction.customId === 'next-page') {
          currentPage++;
          if (currentPage > totalPages) {
            currentPage = 1;
          }
          await interaction.update({ embeds: [createDexEmbed(user, currentPage)], components: [buttonRow] });
        }
      });

    } catch (error) {
      console.error(error);
      await interaction.reply('An error occurred while displaying your Pokédex.');
    }
  },
};

function createDexEmbed(user, page) {

  // Calculate starting and ending for each page
  const startIndex = (page - 1) * 10;
  const endIndex = Math.min(startIndex + 10, user.caughtPokemon.length);

  // Get the Pokemans for the current page
  let pokemonToDisplay = user.caughtPokemon.slice(startIndex, endIndex);

  // Build the embed's desc or sum
  const description = pokemonToDisplay.reduce((desc, pokemon) => {
    return desc + `\n${pokemon.quantity}x ${pokemon.name} (Rarity: ${pokemon.rarity}) #${pokemon.dexnum}`;
  }, 'Your Caught Pokémon:');

  // Create the embed
  const dexEmbed = new EmbedBuilder()
    .setTitle(`${user.userName}'s PC - Page ${page}`)
    .setDescription(description);

  return dexEmbed;
}