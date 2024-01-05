import dotenv from 'dotenv';
import { CommandInteraction } from 'discord.js';

const {
  Client,
  GatewayIntentBits: {
      Guilds,
      GuildMembers,
      GuildPresences,
      GuildMessages,
      MessageContent
  }
} = require("discord.js");

const fs = require('fs');

dotenv.config();

const options = {
  intents: [Guilds, GuildMembers, GuildPresences, GuildMessages, MessageContent],
};
const client = new Client(options);

module.exports = client;

let commands: { [key: string]: any } = {};
const commandFiles = fs.readdirSync('./src/commands/').filter((file: string) => file.endsWith('.ts'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  console.log(command);
  commands[command.data.name] = command;
}

client.once('ready', async () => {
  const data: string [] = [];
  for (const commandName in commands) {
    if (commands.hasOwnProperty(commandName)) {
      data.push(commands[commandName].data);
    }
  }
  await client.application.commands.set(data, process.env.SERVER_ID);
  console.log('Bot running');
  console.log(client.user?.tag);
});

client.on('interactionCreate', async (interaction: CommandInteraction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const command = commands[interaction.commandName];
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: `Error! Try again or contact <@${process.env.BOT_ADMIN_ID}>`,
      ephemeral: true,
    });
  }
});

client.login(process.env.BOT_TOKEN);
