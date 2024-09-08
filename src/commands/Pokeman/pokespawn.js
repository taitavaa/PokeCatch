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
  "What The Fuck": 0, // What the Fuck is, like a Rarity for some unknown reason
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
      
        // I made the color of the embed a function, so you can call it wherever you want instead of copypasting the same logic everywhere.
        function getRarityColor(rarity) {
          switch (rarity) {
            case "Common":
              return "#33B3FF"; // Blue
            case "Uncommon":
              return "#6CF15A"; // Green
            case "Rare":
              return "#FF9F33"; // Orange
            case "Very Rare":
              return "#C80EE0"; // Purple
            case "Legendary":
              return "#F6DFF9"; // Legendary : Clash Royale
            case "Mythical":
              return "#948B5C"; // Champion : Clash Royale
            case "Shiny":
              return "#BAFEFF"; // Gold
            case "What The Fuck":
              return "#e3256b"; // Razzmatazz
            default:
              return "#FFFFFF"; // White (default if rarity is unknown)
          }
        }

        embed.setColor(getRarityColor(randomPokemon.rarity));

      

        const buttonRow = new ActionRowBuilder();

      
      let pokeballButton;
      if (user.pokeball > 0) {

        pokeballButton = new ButtonBuilder()
          .setEmoji("<:Pokeball:1281616987889340568>")
          .setStyle("Secondary")
          .setCustomId("pokeball-button");

        buttonRow.addComponents(pokeballButton);

      }

      let greatballButton;
      if (user.greatball > 0) {

        greatballButton = new ButtonBuilder()
        .setEmoji("<:Greatball:1281616969103179877>")
        .setStyle("Secondary")
        .setCustomId("greatball-button");
        buttonRow.addComponents(greatballButton);

      } 
      
      let sexballButton;
      if (user.ultraball > 0) {

        sexballButton = new ButtonBuilder()
        .setEmoji("<:Ultraball:1281616793915359303>")
        .setStyle("Secondary")
        .setCustomId("ultraball-button");
        buttonRow.addComponents(sexballButton);
      
      }

      let masterballButton;
      if (user.masterball > 0){

        masterballButton = new ButtonBuilder()
        .setEmoji("<:Masterball:1281613764428304475>")
        .setStyle("Secondary")
        .setCustomId("masterball-button");
        buttonRow.addComponents(masterballButton);
      }

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

          catchSuccess = randoms <= catchChance;

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
              .setTitle(`✅ | ${user.userName} Caught ${randomPokemon.name} with a Pokéball`)
              .setImage(randomPokemon.image)
              .setFooter({
                text: `Catch Chance: ${parseInt(catchChance)}\nRoll: ${parseInt(randoms)}\n=======================\nPokeballs: ${user.pokeball}\nGreatBalls: ${greatballs}\nUltraBalls: ${ultraballs}\nMasterBalls: ${masterballs}`
            })

            newembed.setColor(getRarityColor(randomPokemon.rarity));

              await interaction.update({ components: [], embeds: [newembed]});

            } else {

            const failembed = new EmbedBuilder()
              .setTitle(`❌ | The ${randomPokemon.name} broke free!`)
              .setImage(randomPokemon.image)
              .setFooter({
                text: `Catch Chance: ${parseInt(catchChance)}\nRoll: ${parseInt(randoms)}\n=======================\nPokeballs: ${user.pokeball}\nGreatBalls: ${greatballs}\nUltraBalls: ${ultraballs}\nMasterBalls: ${masterballs}`
            })

            failembed.setColor(getRarityColor(randomPokemon.rarity));

              await interaction.update({ components: [], embeds: [failembed]});
            
           
            } 

            collector.stop();


        } else if (interaction.customId === 'greatball-button') {
          let catchChance = 60;

          user.greatball -= 1;

          await user.save()

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

          catchSuccess = randoms <= catchChance;
          
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
              .setTitle(`✅ | ${user.userName} Caught ${randomPokemon.name} with a Greatball!`)
              .setImage(randomPokemon.image)
              .setFooter({
                text: `Catch Chance: ${parseInt(catchChance)}\nRoll: ${parseInt(randoms)}\n=======================\nPokeballs: ${user.pokeball}\nGreatBalls: ${user.greatball}\nUltraBalls: ${ultraballs}\nMasterBalls: ${masterballs}`
            })

            newembed.setColor(getRarityColor(randomPokemon.rarity));

              await interaction.update({ components: [], embeds: [newembed]});
            } else {

            const failembed = new EmbedBuilder()
              .setTitle(`❌ | The ${randomPokemon.name} broke free!`)
              .setImage(randomPokemon.image)
              .setFooter({
                text: `Catch Chance: ${parseInt(catchChance)}\nRoll: ${parseInt(randoms)}\n=======================\nPokeballs: ${user.pokeball}\nGreatBalls: ${user.greatball}\nUltraBalls: ${ultraballs}\nMasterBalls: ${masterballs}`
            })

            failembed.setColor(getRarityColor(randomPokemon.rarity));

              await interaction.update({ components: [], embeds: [failembed]});
              outcome = "escaped";
            }

            collector.stop();

        } else if (interaction.customId === 'ultraball-button') {
          let catchChance = 70;

          user.ultraball -= 1;

          await user.save()

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

          catchSuccess = randoms <= catchChance;

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
              .setTitle(`✅ | ${user.userName} Caught ${randomPokemon.name} with a Ultraball!`)
              .setImage(randomPokemon.image)
              .setFooter({
                text: `Catch Chance: ${parseInt(catchChance)}\nRoll: ${parseInt(randoms)}\n=======================\nPokeballs: ${pokeballs}\nGreatBalls: ${greatballs}\nUltraBalls: ${user.ultraball}\nMasterBalls: ${masterballs}`
            })

            newembed.setColor(getRarityColor(randomPokemon.rarity));

              await interaction.update({ components: [], embeds: [newembed]});
            } else {

            const failembed = new EmbedBuilder()
              .setTitle(`❌ | The ${randomPokemon.name} broke free!`)
              .setImage(randomPokemon.image)
              .setFooter({
                text: `Catch Chance: ${parseInt(catchChance)}\nRoll: ${parseInt(randoms)}\n=======================\nPokeballs: ${pokeballs}\nGreatBalls: ${greatballs}\nUltraBalls: ${user.ultraball}\nMasterBalls: ${masterballs}`
            })

            failembed.setColor(getRarityColor(randomPokemon.rarity));

              await interaction.update({ components: [], embeds: [failembed]});
              outcome = "escaped";
            }

            collector.stop();

        } else if (interaction.customId === 'masterball-button') {
          let catchChance = 100;

          user.masterball -= 1;

          await user.save()

          const randoms = Math.floor(Math.random() * 101);

          catchSuccess = randoms <= catchChance;

          if (catchSuccess) {

            outcome = "Success!";

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
              .setTitle(`✅ | ${user.userName} Caught ${randomPokemon.name} with a Masterball!`)
              .setImage(randomPokemon.image)
              .setFooter({
                text: `Catch Chance: ${parseInt(catchChance)}\nRoll: ${parseInt(randoms)}\n=======================\nPokeballs: ${user.pokeball}\nGreatBalls: ${user.greatball}\nUltraBalls: ${ultraballs}\nMasterBalls: ${user.masterball}`
            })

            newembed.setColor(getRarityColor(randomPokemon.rarity));

              await interaction.update({ components: [], embeds: [newembed]});
            } else if (!catchSuccess) {

            const failembed = new EmbedBuilder()
              .setTitle(`❌ | The ${randomPokemon.name} broke free!`)
              .setImage(randomPokemon.image)
              .setFooter({
                text: `Catch Chance: ${parseInt(catchChance)}\nRoll: ${parseInt(randoms)}\n=======================\nPokeballs: ${user.pokeball}\nGreatBalls: ${user.greatball}\nUltraBalls: ${ultraballs}\nMasterBalls: ${masterballs}`
            })

            failembed.setColor(getRarityColor(randomPokemon.rarity));

              await interaction.update({ components: [], embeds: [failembed]});
              outcome = "escaped";
            } 

            collector.stop();
        }
      });

      // Collector on end
      collector.on('end', async (collected) => {
        

        if (collected.size === 0) {
          // Pokémon fled
          const escapeembed = new EmbedBuilder()
            .setTitle(`💨 The ${randomPokemon.name} fled!`)
            .setImage(randomPokemon.image)
            .setFooter({
              text: `Pokeballs: ${user.pokeball}\nGreatBalls: ${user.greatball}\nUltraBalls: ${user.ultraball}\nMasterBalls: ${user.masterball}`
            });
      
          escapeembed.setColor(getRarityColor(randomPokemon.rarity));
          await interaction.editReply({ embeds: [escapeembed], components: [] });
        }

      }); 
    } catch (error) {
      console.error(error);
      await interaction.reply('An error occurred while encountering a Pokémon.');
    }
  }
};