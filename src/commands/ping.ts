import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Pong! (hopefully)");
export const execute = async function (
  interaction: ChatInputCommandInteraction
) {
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
};
