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
import { allMovies } from "..";
import { potterDbMovieResponse } from "../request-types/movie";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("movie")
    .setDescription("Get info about a movie")
    .addStringOption(
      new SlashCommandStringOption()
        .setName("movie")
        .setDescription("movie to get info about")
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    try {
      var request: AxiosResponse<potterDbMovieResponse> = await axios.get(
        `https://api.potterdb.com/v1/movies/${interaction.options.getString(
          "movie",
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
      .setTitle(request.data.data.attributes.title)
      .setImage(request.data.data.attributes.poster)
      .setDescription(request.data.data.attributes.summary)
      .setAuthor({ name: request.data.data.attributes.directors.toString() });

    for (let point in request.data.data.attributes) {
      if (
        point == "title" ||
        point == "poster" ||
        point == "summary" ||
        point == "directors" ||
        point == "slug"
      )
        continue;
      if (!request.data.data.attributes[point]) continue;
      embed.addFields({
        name: point,
        value: request.data.data.attributes[point]?.toString() ?? "",
      });
    }

    return interaction.editReply({ embeds: [embed] });
  },
  async autocomplete(interaction: AutocompleteInteraction) {
    const allMoviesData = await allMovies;

    const allMoviesSearch = new Fuse(allMoviesData, {
      keys: ["title", "summary", "directors", "running_date"],
    });
    const results = allMoviesSearch.search(interaction.options.getFocused(), {
      limit: 25,
    });
    const response: ApplicationCommandOptionChoiceData<string>[] = [];
    for (let result of results) {
      response.push({
        name: result.item.title,
        value: result.item.slug,
      });
    }
    return interaction.respond(response);
  },
};
