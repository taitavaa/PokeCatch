const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ComponentType } = require('discord.js');
const User = require('../../Schemas.js/userAccount');

const { pokemonData } = require('../../data/pokemonData.js');
const { dexEntryData } = require('../../data/dexEntryData.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dex')
        .setDescription('Pokemons yes, yes')
        .addStringOption(option =>
            option.setName('pokemon')
              .setDescription('The name of the Pokémon you want to see the dex entry of.')
              .setRequired(true)
            ),

    async execute(interaction) {
        try {
            const sender = interaction.user;
            const user = await User.findOne({ userId: sender.id });

      if (!user) {
        return interaction.reply({ content: 'You don\'t have an account yet. Use the /start command to create one.', ephemeral: false });
      }

      const pokemonName = interaction.options.getString('pokemon');
      const randomPokemon = pokemonData.find(p => p.name.toLowerCase() === pokemonName.toLowerCase());

      const dexEntry = dexEntryData.find(p => p.name.toLowerCase() === pokemonName.toLowerCase());

      if (!randomPokemon) {
        return interaction.reply({ content: `Couldn't find a Pokémon named "${pokemonName}". Please check your spelling.`, ephemeral: false });
      } 

      const dexEmbed = new EmbedBuilder()
        .setTitle(`Dex Entry of ${randomPokemon.name}`)
        .setDescription(`${dexEntry.description}`)
        .setThumbnail(randomPokemon.image)

      await interaction.reply({ embeds: [dexEmbed], });

    } catch (error) {
        console.error(error);
        await interaction.reply('An error occurred while viewing a dex entry of a Pokemon.');
        }
    }
};