const { pokemonData } = require("../../data/pokemonData");
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ComponentType } = require('discord.js');

const User = require('../../Schemas.js/userAccount');
const Pokemon = require('../../Schemas.js/pokemonQuantity');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ingametest')
    .setDescription('!')
    .addStringOption(option =>
      option.setName('pokemon')
        .setDescription('The Pokémon you want to test')
        .setRequired(true)),

  async execute(interaction) {
    const sender = interaction.user;
    const user = await User.findOne({ userId: sender.id });
    if (!user) {
      return interaction.reply({ content: 'You don\'t have an account yet. Use the /start command to create one.', ephemeral: false });
    }

    const pokemonName = interaction.options.getString('pokemon').toLowerCase();
    const pokemon = await Pokemon.findOne({ name: pokemonName });
    if (!pokemon) {
      const newPokemon = new Pokemon({ name: pokemonName, ingame: 0 });
      await newPokemon.save();
    }  

    function increasePokemonCount() {
      Pokemon.findOneAndUpdate({ name: pokemonName }, { $inc: { ingame: 1 } }, { new: true }, (err, pokemon) => {
        if (err) console.error(err);
        console.log(`${pokemonName}'s ingame value increased to ${pokemon.ingame}`);
      });
    }

    async function increasePokemonCount() {
        try {
          const updatedPokemon = await Pokemon.findOneAndUpdate({ name: pokemonName }, { $inc: { ingame: 1 } }, { new: true });
          console.log(`${pokemonName}'s ingame value increased to ${updatedPokemon.ingame}`);
          return updatedPokemon;
        } catch (err) {
          console.error(err);
        }
      }

      const randomPokemon = pokemonData.find(p => p.name.toLowerCase() === pokemonName.toLowerCase());

      const seenPokemon = user.seenPokemon.find((pokemon) => pokemon.name === randomPokemon.name);

            const existsssShitNIIIIIIIIGGG = user.seenPokemon.findIndex(
              (pokemon) => pokemon.name === randomPokemon.name
            );
            if (!seenPokemon) {
                
              // Add new Pokemon with quantity 1
              user.seenPokemon.push({
                name: randomPokemon.name,
                seen: 1,
              });

              await user.save();
            } else {

              // Increment the quantity of the existing Pokemon
              user.seenPokemon[existsssShitNIIIIIIIIGGG].seen++;
              await user.save();
            }

        console.log(seenPokemon);

    const updatedPokemon = await increasePokemonCount();


    const ingameembed = new EmbedBuilder()
    .setTitle('Pokeballs')
    .setDescription(`${user.seenPokemon[existsssShitNIIIIIIIIGGG].seen}`)

    await interaction.reply({ embeds: [ingameembed] });

    console.log(updatedPokemon.ingame); // Output: should be the updated value
  }
}