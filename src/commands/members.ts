import { CommandInteraction, GuildMember, Role } from 'discord.js';
import dotenv from 'dotenv';

const client = require('../index');
dotenv.config();

module.exports = {
  data: {
    name: 'members',
    description: 'show member list',
  },
  async execute(interaction: CommandInteraction) {
    const guild = await client.guilds.fetch(process.env.SERVER_ID);
    const members = await guild.members.fetch();
    var members_with_roles: string[] = [];
    members.forEach((member: GuildMember, member_id: number) => {
      var member_with_roles: string[] = [];
      member_with_roles.push(member.user.username);
      member.roles.cache.forEach((role: Role, role_id: string) => {
        if (role.name !== '@everyone'){
          member_with_roles.push(role.name);
        }
      });
      members_with_roles.push(member_with_roles.join(', '));
    });
    await interaction.reply({content: members_with_roles.join('\n'), ephemeral: false});
  },
};
