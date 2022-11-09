import axios, { AxiosResponse } from "axios";
import {
  ApplicationCommandOptionChoiceData,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "discord.js";
import Fuse from "fuse.js";
import { allCharacters } from "..";
import { potterDbCharacterResponse } from "../request-types/character";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("character")
    .setDescription("Get info about a character")
    .addStringOption(
      new SlashCommandStringOption()
        .setName("character")
        .setDescription("character to get info about")
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    try {
      var request: AxiosResponse<potterDbCharacterResponse> = await axios.get(
        `https://api.potterdb.com/v1/characters/${interaction.options.getString(
          "character",
          true
        )}`,
        {}
      );
    } catch (error) {
      return await interaction.editReply({
        content: `Error go brrr. ${error}`,
      });
    }

    const embed = new EmbedBuilder()
      .setTitle(request.data.data.attributes.name)
      .setImage(request.data.data.attributes.image);

    for (let point in request.data.data.attributes) {
      if (point == "name" || point == "image" || point == "slug") continue;
      if (!request.data.data.attributes[point]) continue;
      if (
        (request.data.data.attributes[point]?.toString().length ?? 1) > 1024
      ) {
        await interaction.followUp({
          content: `${point} - ${request.data.data.attributes[
            point
          ]?.toString()}`,
        });
        continue;
      }
      embed.addFields({
        name: point,
        value: request.data.data.attributes[point]?.toString() ?? "",
      });
    }

    return interaction.editReply({ embeds: [embed] });
  },
  async autocomplete(interaction: AutocompleteInteraction) {
    const allCharactersData = await allCharacters;

    const allCharactersSearch = new Fuse(allCharactersData, {
      keys: ["name"],
    });
    const results = allCharactersSearch.search(
      interaction.options.getFocused(),
      {
        limit: 25,
      }
    );
    const response: ApplicationCommandOptionChoiceData<string>[] = [];
    for (let result of results) {
      response.push({
        name: result.item.name,
        value: result.item.slug,
      });
    }
    return interaction.respond(response);
  },
};
