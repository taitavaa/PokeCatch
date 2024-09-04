const { pokemonData } = require("../../data/pokemonData");
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ComponentType } = require('discord.js');

const User = require('../../Schemas.js/userAccount');

const rarityWeights = {
  "Common": 45,
  "Uncommon": 32,
  "Rare": 20,
  "Very Rare": 2.9981279296875,
  "Legendary": 0.0015,
  "Mythical": 0.00025,
  "Shiny": 0.0001220703125,
  "What The Fuck": 0, 
};

function getRandomWeightedPokemon(pokemonData, rarityWeights) {
  const totalWeight = Object.values(rarityWeights).reduce((sum, weight) => sum + weight, 0);
  const randomNum = Math.random() * totalWeight;
  let cumulativeWeight = 0;
  for (const rarity of Object.keys(rarityWeights)) {
    const weight = rarityWeights[rarity];
    cumulativeWeight += weight;
    if (randomNum <= cumulativeWeight) {
      const filteredPokemon = pokemonData.filter(p => p.rarity === rarity);
      const randomIndex = Math.floor(Math.random() * filteredPokemon.length);
      return filteredPokemon[randomIndex];
    }
  }
  // If something goes wrong, return a default Pokemon 
  return pokemonData[0]; // Or handle the error differently
}

module.exports = {
  data: new SlashCommandBuilder().setName('spawn').setDescription('Encounter a random Pokémon.'),

  async execute(interaction) {
    try {

      const sender = interaction.user;

      const user = await User.findOne({ userId: sender.id });
      if (!user) {
        return interaction.reply({ content: 'You don\'t have an account yet. Use the /start command to create one.', ephemeral: false });
      }

      const pokeballs = user.pokeball;
      const greatballs = user.greatball;
      const ultraballs = user.ultraball;
      const masterballs = user.masterball;

      // 1. Get a random Pokémon:
      const randomPokemon = getRandomWeightedPokemon(pokemonData, rarityWeights);


      // 2. Create the embed and buttons:
      const embed = new EmbedBuilder()
        .setTitle(`A wild ${randomPokemon.rarity} ${randomPokemon.name} appeared!`)
        .setImage(randomPokemon.image)
        .setFooter({
          text: `Pokeballs: ${pokeballs}\nGreatBalls: ${greatballs}\nUltraBalls: ${ultraballs}\nMasterBalls: ${masterballs}`
        })
      
      switch (randomPokemon.rarity) {
        case "Common":
          embed.setColor("#33B3FF"); // Blue
          break;
        case "Uncommon":
          embed.setColor("#6CF15A"); // Green
          break;
        case "Rare":
          embed.setColor("#FF9F33"); // Orange
          break;
        case "Very Rare":
          embed.setColor("#C80EE0"); // Purple
          break;
        case "Legendary":
          embed.setColor("#F6DFF9"); // Legendary : Clash Royale
          break;
        case "Mythical":
          embed.setColor("#948B5C"); // Champion : Clash Royale
          break;
        case "Shiny":
          embed.setColor("#BAFEFF"); // Gold
          break;
        case "What The Fuck":
          embed.setColor("#e3256b"); // Razzmatazz
          break;
        default:
          embed.setColor("#FFFFFF"); // White (default if rarity is unknown)
          break;
      }

      const pokeballButton = new ButtonBuilder()
        .setLabel("Pokeball")
        .setStyle("Primary")
        .setCustomId("pokeball-button");

      const greatballButton = new ButtonBuilder()
        .setLabel("Greatball")
        .setStyle("Primary")
        .setCustomId("greatball-button");

      const sexballButton = new ButtonBuilder()
        .setLabel("Ultraball")
        .setStyle("Danger")
        .setCustomId("ultraball-button");

      const masterballButton = new ButtonBuilder()
        .setLabel("Masterball")
        .setStyle("Danger")
        .setCustomId("masterball-button");

      if (user.pokeball > 0) {
        pokeballButton.setDisabled(false);
      } else {
        pokeballButton.setDisabled(true);
      } if (user.greatball > 0) {
        greatballButton.setDisabled(false);
      } else {
        greatballButton.setDisabled(true);
      } if (user.ultraball > 0) {
        sexballButton.setDisabled(false);
      } else {
        sexballButton.setDisabled(true);
      } if (user.masterball > 0){
        masterballButton.setDisabled(false);
      } else {
        masterballButton.setDisabled(true);
      }

      const buttonRow = new ActionRowBuilder().addComponents(
        pokeballButton,
        greatballButton,
        sexballButton,
        masterballButton,
      );

      // 3. Send the initial message:
      const reply = await interaction.reply({ embeds: [embed], components: [buttonRow] });

      // 4. Set up the button collector:
      const filter = (i) => i.user.id === interaction.user.id;
      const collector = reply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter,
        time: 10_000, // 10 seconds
        max: 1,
      });

      const chosenRarity = randomPokemon.rarity;
      const chosenName = randomPokemon.name;

      let catchSuccess = false; // Flag to track if a catch was successful
      collector.on('collect', async (interaction) => {
        if (interaction.customId === 'pokeball-button') {

          let catchChance = 40;

          user.pokeball -= 1;
          
          // Save the updated array instead of overwriting it entirely
          await user.save();

          if (chosenRarity === 'Common') {
            catchChance += 20; 
          } else if (chosenRarity === 'Uncommon') {
            catchChance += 10;
          } else if (chosenRarity === 'Very Rare') {
            catchChance -= 10;
          } else if (chosenRarity === 'Legendary') {
            catchChance -= 20;
          } else if (chosenRarity === 'Mythical') {
            catchChance -= 30;
          } else if (chosenRarity === 'Shiny') {
            catchChance -= 25;
          } 

          const randoms = Math.floor(Math.random() * 101);

          catchSuccess = randoms < catchChance;

          const chanceMessage = `catch chance ${catchChance} roll ${randoms} and success ${catchSuccess}`



          if (catchSuccess) {

            const user = await User.findOne({ userId: interaction.user.id });
            const existingPokemonIndex = user.caughtPokemon.findIndex(
              (pokemon) => pokemon.name === randomPokemon.name
            );
            if (existingPokemonIndex !== -1) {

              // Pokemon already exists, increase quantity
              user.caughtPokemon[existingPokemonIndex].quantity++; 
            } else {

              // Add new Pokemon with quantity 1
              user.caughtPokemon.push({
                name: randomPokemon.name,
                rarity: randomPokemon.rarity,
                image: randomPokemon.image,
                dexnum: randomPokemon.dexnum,
                quantity: 1 
              });
            }

            // Save the updated array instead of overwriting it entirely
            await user.save();


            const newembed = new EmbedBuilder()
              .setTitle(`A wild ${randomPokemon.rarity} ${randomPokemon.name} appeared!`)
              .setImage(randomPokemon.image)
              .setFooter({
                text: `Catch Chance: ${parseInt(catchChance)}\nRoll: ${parseInt(randoms)}\n\nPokeballs: ${pokeballs}\nGreatBalls: ${greatballs}\nUltraBalls: ${ultraballs}\nMasterBalls: ${masterballs}`
            })


              await interaction.update({ content: `You caught a ${chosenName} with a Pokeball! ${chanceMessage}`, components: [], embeds: [newembed]});
            } else {
              await interaction.reply(`The ${chosenName} broke free!`);
            }

            collector.stop();


        } else if (interaction.customId === 'greatball-button') {
          let catchChance = 0.60;

          user.greatball -= 1;

          await user.save()

          if (chosenRarity === 'Common') {
            catchChance += 0.2; 
          } else if (chosenRarity === 'Uncommon') {
            catchChance += 0.1;
          } else if (chosenRarity === 'Very Rare') {
            catchChance -= 0.2;
          } else if (chosenRarity === 'Legendary') {
            catchChance -= 0.2;
          } else if (chosenRarity === 'Mythical') {
            catchChance -= 0.3;
          } else if (chosenRarity === 'Shiny') {
            catchChance -= 0.25;
          } 

          const random = Math.random();

          catchSuccess = random < catchChance;

          const chanceMessage = `catch chance ${catchChance} roll ${random} and success ${catchSuccess}`

          //if (catchChance != 0) {
            //globalDevMessage = chanceMessage;
          //}
          
          if (catchSuccess) {

            const user = await User.findOne({ userId: interaction.user.id });
            const existingPokemonIndex = user.caughtPokemon.findIndex(
              (pokemon) => pokemon.name === randomPokemon.name
            );
            if (existingPokemonIndex !== -1) {

              // Pokemon already exists, increase quantity
              user.caughtPokemon[existingPokemonIndex].quantity++; 
            } else {

              // Add new Pokemon with quantity 1
              user.caughtPokemon.push({
                name: randomPokemon.name,
                rarity: randomPokemon.rarity,
                image: randomPokemon.image,
                dexnum: randomPokemon.dexnum,
                quantity: 1 
              });
            }

            // Save the updated array instead of overwriting it entirely
            await user.save();


              await interaction.update({ content: `You caught a ${chosenName} with a Greatball!`, components: []});
            } else {
              await interaction.reply(`The ${chosenName} broke free!`);
            }
            collector.stop();
        } else if (interaction.customId === 'ultraball-button') {
          let catchChance = 0.70;

          user.ultraball -= 1;

          await user.save()

          if (chosenRarity === 'Common') {
            catchChance += 0.2; 
          } else if (chosenRarity === 'Uncommon') {
            catchChance += 0.1;
          } else if (chosenRarity === 'Very Rare') {
            catchChance -= 0.2;
          } else if (chosenRarity === 'Legendary') {
            catchChance -= 0.2;
          } else if (chosenRarity === 'Mythical') {
            catchChance -= 0.3;
          } else if (chosenRarity === 'Shiny') {
            catchChance -= 0.25;
          } 

          const random = Math.random();

          catchSuccess = random < catchChance;

          const chanceMessage = `catch chance ${catchChance} roll ${random} and success ${catchSuccess}`

          //if (catchChance != 0) {
            //globalDevMessage = chanceMessage;
          //}

          if (catchSuccess) {

            const user = await User.findOne({ userId: interaction.user.id });
            const existingPokemonIndex = user.caughtPokemon.findIndex(
              (pokemon) => pokemon.name === randomPokemon.name
            );
            if (existingPokemonIndex !== -1) {

              // Pokemon already exists, increase quantity
              user.caughtPokemon[existingPokemonIndex].quantity++; 
            } else {

              // Add new Pokemon with quantity 1
              user.caughtPokemon.push({
                name: randomPokemon.name,
                rarity: randomPokemon.rarity,
                image: randomPokemon.image,
                dexnum: randomPokemon.dexnum,
                quantity: 1 
              });
            }

            // Save the updated array instead of overwriting it entirely
            await user.save();


              await interaction.reply(`You caught a ${chosenName} with a Ultraball!`);
            } else {
              await interaction.reply(`The ${chosenName} broke free!`);
            }
            collector.stop();
        } else if (interaction.customId === 'masterball-button') {
          let catchChance = 999999999999999;

          user.masterball -= 1;

          await user.save()

          if (chosenRarity === 'Common') {
            catchChance += 999; 
          } else if (chosenRarity === 'Uncommon') {
            catchChance += 999;
          } else if (chosenRarity === 'Very Rare') {
            catchChance -= 999;
          } else if (chosenRarity === 'Legendary') {
            catchChance -= 999;
          } else if (chosenRarity === 'Mythical') {
            catchChance -= 999;
          } else if (chosenRarity === 'Shiny') {
            catchChance -= 999;
          } 

          const random = Math.random();

          catchSuccess = random < catchChance;

          const chanceMessage = `catch chance ${catchChance} roll ${random} and success ${catchSuccess}`

          //if (catchChance != 0) {
            //globalDevMessage = chanceMessage;
          //}

          if (catchSuccess) {

            const user = await User.findOne({ userId: interaction.user.id });
            const existingPokemonIndex = user.caughtPokemon.findIndex(
              (pokemon) => pokemon.name === randomPokemon.name
            );
            if (existingPokemonIndex !== -1) {

              // Pokemon already exists, increase quantity
              user.caughtPokemon[existingPokemonIndex].quantity++; 
            } else {

              // Add new Pokemon with quantity 1
              user.caughtPokemon.push({
                name: randomPokemon.name,
                rarity: randomPokemon.rarity,
                image: randomPokemon.image,
                dexnum: randomPokemon.dexnum,
                quantity: 1 
              });
            }

            // Save the updated array instead of overwriting it entirely
            await user.save();


              await interaction.update({ content: `You caught a ${chosenName} with a Masterball!`, components: [] });
            } else {
              await interaction.reply(`The ${chosenName} broke free!`);
            }
            collector.stop();
        }
      });

      // Collector on end
      collector.on('end', async () => {

        pokeballButton.setDisabled(true);
        greatballButton.setDisabled(true);
        sexballButton.setDisabled(true);

        await interaction.editReply({
          embeds: [embed],
          components: [buttonRow],
          content: `${catchSuccess}`,
        });
      }); 
    } catch (error) {
      console.error(error);
      await interaction.reply('An error occurred while encountering a Pokémon.');
    }
  }
};