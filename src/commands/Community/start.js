const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ComponentType } = require('discord.js');

const User = require('../../Schemas.js/userAccount'); // Adjust the path if necessary

module.exports = {
  data: new SlashCommandBuilder()
    .setName('start')
    .setDescription('Start your journey in the world of Pokémon! (and drugs!!!!)'),
  async execute(interaction) {
    try {
      const existingUser = await User.findOne({ userId: interaction.user.id });

      if (existingUser) {
        await interaction.reply('You already have an account!');
        return;
      }

      const startEmbed = new EmbedBuilder()
        .setTitle('Welcome to the world of Pokémon!')
        .setDescription(
          "Hello, my name is Professor White. I am the Pokémon Professor. Right now I would give you a starter Pokémon to start your journey, but I'm too lazy.. So instead take these Pokéballs, some cash and catch them all to start your journey. Good luck!" +
            "\n\n" +
            "**Pokéballs: 100 **" +
            "\n" +
            "**Pokédollars: 10,000**" +
            "\n",
        );

      const startButton = new ButtonBuilder()
        .setCustomId('create-account')
        .setLabel('Start Journey')
        .setStyle('Primary');

      const startrow = new ActionRowBuilder().addComponents(startButton);
      const startMessage = await interaction.reply({
        embeds: [startEmbed],
        components: [startrow],
      });

      const filter = (i) => i.customId === 'create-account' && i.user.id === interaction.user.id;

      const collector = startMessage.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter,
        time: 15_000,
      });

      collector.on('collect', async (interaction) => {
        if (interaction.user.id !== interaction.user.id) {
          await interaction.reply('This is not your interaction.');
          return;
        }

        await interaction.update({
          embeds: [startEmbed],
          components: [],
        });

        const newUser = new User({
          userId: interaction.user.id,
          userName: interaction.user.username,
          balance: 10000,
          pokeball: 1000000000000,
        });

        await newUser.save();

        const successMessage = 'You\'re all set! You have been given 10,000 Pokédollars to start your journey. Good luck';

        await interaction.editReply({ content: successMessage, components: [], embeds: [] });
        collector.stop();
      });

      collector.on('end', (collected) => {
        if (collected.size === 0) {
          interaction.editReply({ embeds: [startEmbed], components: [], content: 'You took too long to respond.' });
        } else {
          console.log('Button clicked');
        }
      });

    } catch (error) {
      console.log(error);
      await interaction.reply('An error occurred while starting your journey.');
    }
  },
};