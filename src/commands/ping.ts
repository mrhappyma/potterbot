import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription(
      'Pong! (hopefully)'
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const sent = await interaction.reply({
      content: `ping\nwebsocket heartbeat: ${interaction.client.ws.ping}`,
      fetchReply: true,
    });
    return await interaction.editReply({
      content: `pong\nWebsocket heartbeat: ${
        interaction.client.ws.ping
      }ms\nRoundtrip latency: ${
        sent.createdTimestamp - interaction.createdTimestamp
      }ms`,
    });
  },
};
