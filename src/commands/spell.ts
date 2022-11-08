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
import { allSpells } from "..";
import {
  potterDbAllSpellsResponse,
  potterDbSpellResponse,
} from "../request-types/spell";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("spell")
    .setDescription("Get info about a spell")
    .addStringOption(
      new SlashCommandStringOption()
        .setName("spell")
        .setDescription("spell to get info about")
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    try {
      var request: AxiosResponse<potterDbSpellResponse> = await axios.get(
        `https://api.potterdb.com/v1/spells/${interaction.options.getString(
          "spell",
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
      .setImage(request.data.data.attributes.image)
      .setDescription(request.data.data.attributes.effect);
    if (request.data.data.attributes.creator)
      embed.setAuthor({ name: request.data.data.attributes.creator });

    for (let point in request.data.data.attributes) {
      if (
        point == "name" ||
        point == "effect" ||
        point == "creator" ||
        point == "image" ||
        point == "slug"
      )
        continue;
      if (!request.data.data.attributes[point]) continue;
      embed.addFields(
        { name: point, value: request.data.data.attributes[point] ?? "" }
        /*
          an empy string should never be returned
          since we are checking for it earlier
          but appariently continue doesnt count as checking
          not sure how to tell typescript that
          so thats why that is there
          i never comment my code why is this block here lol
        */
      );
    }

    return interaction.editReply({ embeds: [embed] });
  },
  async autocomplete(interaction: AutocompleteInteraction) {
    const allSpellsData = await allSpells;

    const allSpellsSearch = new Fuse(allSpellsData, {
      keys: ["name", "effect", "incantation"],
    });
    const results = allSpellsSearch.search(interaction.options.getFocused(), {
      limit: 25,
    });
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
