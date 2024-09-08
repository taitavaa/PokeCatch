const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ComponentType } = require('discord.js');
const User = require('../../Schemas.js/userAccount');

const { pokemonData } = require('../../data/pokemonData.js');
const Pokemon = require('../../Schemas.js/pokemonQuantity');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('devspawn')
    .setDescription('Spawn a specific Pokémon for development.')
    .addStringOption(option =>
      option.setName('pokemon')
        .setDescription('The name of the Pokémon you want to spawn.')
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

      if (!randomPokemon) {
        return interaction.reply({ content: `Couldn't find a Pokémon named "${pokemonName}". Please check your spelling.`, ephemeral: true });
      }

      // Create the embed and buttons:
      const embed = new EmbedBuilder()
        .setTitle(`A wild ${randomPokemon.rarity} ${randomPokemon.name} appeared!`)
        .setImage(randomPokemon.image)
        .setFooter({
          text: `Pokeballs: ${user.pokeball}\nGreatBalls: ${user.greatball}\nUltraBalls: ${user.ultraball}\nMasterBalls: ${user.masterball}`
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
      }

      const buttonRow = new ActionRowBuilder().addComponents(
        pokeballButton,
        greatballButton,
        sexballButton,
      );

      const pokemon = randomPokemon;
      if (!pokemon) {
        const newPokemon = new Pokemon({ name: pokemonName, ingame: 0 });
        await newPokemon.save();
      }      

      // Send the initial message:
      const reply = await interaction.reply({ embeds: [embed], components: [buttonRow] });

       const filter = (i) => i.user.id === interaction.user.id;
        const collector = reply.createMessageComponentCollector({
          componentType: ComponentType.Button,
          filter,
          time: 10_000, // 10 seconds
          max: 1,
        });

        const chosenRarity = randomPokemon.rarity;
        const chosenName = randomPokemon.name;

        collector.on('collect', async (interaction) => {
          if (interaction.customId === 'pokeball-button') {



            user.pokeball -= 1;

            // Save the updated array instead of overwriting it entirely
            await user.save();

            let catchChance = 999;

            if (chosenRarity === 'Common') {
              catchChance += 0.2; 
            } else if (chosenRarity === 'Uncommon') {
              catchChance += 0.1;
            } else if (chosenRarity === 'Very Rare') {
              catchChance -= 0.1;
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


            if (catchSuccess) {

              const user = await User.findOne({ userId: interaction.user.id });
              const existingPokemonIndex = user.caughtPokemon.findIndex(
                (pokemon) => pokemon.name === randomPokemon.name
              );

              const pokemon = await Pokemon.findOne({ name: randomPokemon.name });
              if (!pokemon) {
               const newPokemon = new Pokemon({ name: randomPokemon.name, ingame: 0 });
               await newPokemon.save();
             }

              async function increasePokemonCount() {
                  try {
                    const updatedPokemon = await Pokemon.findOneAndUpdate({ name: randomPokemon.name }, { $inc: { ingame: 1 } }, { new: true });
                    console.log(`${randomPokemon.name}'s ingame value increased to ${updatedPokemon.ingame}`);
                    return updatedPokemon;
                  } catch (err) {
                    console.error(err);
                  }
                }

              const updatedPokemon = await increasePokemonCount();

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


                await interaction.reply(`You caught a ${chosenName} with a Pokeball!`);
              } else {
                await interaction.reply(`The ${chosenName} broke free!`);
              }
              collector.stop();


          } else if (interaction.customId === 'greatball-button') {
            
            let catchChance = 0.60;

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


                await interaction.reply(`You caught a ${chosenName} with a Greatball!`);
              } else {
                await interaction.reply(`The ${chosenName} broke free!`);
              }
              collector.stop();
          } else if (interaction.customId === 'ultraball-button') {
            let catchChance = 9999;

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
          }
        });

        collector.on('end', async () => {

          const user = await User.findOne({ userId: interaction.user.id });
          const existingPokemonIndex = user.seenPokemon.findIndex(
            (pokemon) => pokemon.name === randomPokemon.name
          );
          if (existingPokemonIndex !== -1) {
            // Pokemon already exists, increase quantity
            await User.updateOne(
              { userId: interaction.user.id, "seenPokemon.name": randomPokemon.name },
              { $inc: { "seenPokemon.$.seen": 1 } }
            );
          } else {
            // Add new Pokemon with quantity 1
            await User.updateOne(
              { userId: interaction.user.id },
              { $push: { seenPokemon: { name: randomPokemon.name, seen: 1 } } }
            );
          }

          pokeballButton.setDisabled(true);
          greatballButton.setDisabled(true);
          sexballButton.setDisabled(true);

          await interaction.editReply({
            embeds: [embed], 
            components: [buttonRow],
            //content: globalDevMessage,
          });
        }); 

    } catch (error) {
      console.error(error);
      await interaction.reply('An error occurred while encountering a Pokémon.');
    }
  }
};