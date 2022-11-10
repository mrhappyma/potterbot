import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
  SlashCommandBuilder,
} from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Learn about potterbot"),
  async execute(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
      .setTitle("Potterbot")
      .setDescription(
        "An open-source Discord bot to get harry potter data from potterdb.com"
      );
    const buttonRow =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel("Invite")
          .setStyle(ButtonStyle.Link)
          .setURL(
            "https://discord.com/api/oauth2/authorize?client_id=1038817603516375040&scope=applications.commands"
          ),
        new ButtonBuilder()
          .setLabel("GitHub")
          .setStyle(ButtonStyle.Link)
          .setURL("https://github.com/mrhappyma/potterbot/"),

        new ButtonBuilder()
          .setLabel('"Support server"')
          .setStyle(ButtonStyle.Link)
          .setURL("https://discord.gg/a3rBjWpWuc")
      );
    return interaction.reply({ embeds: [embed], components: [buttonRow] });
  },
};
