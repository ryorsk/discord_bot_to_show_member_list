import { CommandInteraction } from 'discord.js';

module.exports = {
  data: {
    name: 'ping',
    description: 'return pong',
  },
  async execute(interaction: CommandInteraction) {
    await interaction.reply({content: 'pong', ephemeral: true});
  },
};
