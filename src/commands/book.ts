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
import { allBooks } from "..";
import { potterDbBookResponse } from "../request-types/book";

export const data = new SlashCommandBuilder()
  .setName("book")
  .setDescription("Get info about a book")
  .addStringOption(
    new SlashCommandStringOption()
      .setName("book")
      .setDescription("book to get info about")
      .setRequired(true)
      .setAutocomplete(true)
  );
export const execute = async function (
  interaction: ChatInputCommandInteraction
) {
  await interaction.deferReply();

  try {
    var request: AxiosResponse<potterDbBookResponse> = await axios.get(
      `https://api.potterdb.com/v1/books/${interaction.options.getString(
        "book",
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
    .setImage(request.data.data.attributes.cover)
    .setDescription(request.data.data.attributes.summary)
    .setAuthor({ name: request.data.data.attributes.author.toString() });

  for (let point in request.data.data.attributes) {
    if (
      point == "title" ||
      point == "cover" ||
      point == "summary" ||
      point == "author" ||
      point == "slug"
    )
      continue;
    const v = request.data.data.attributes[point]?.toString() ?? "";
    if (v == "") continue;
    embed.addFields({
      name: point,
      value: v,
    });
  }

  return interaction.editReply({ embeds: [embed] });
};
export const autocomplete = async function (
  interaction: AutocompleteInteraction
) {
  const allMoviesData = await allBooks;

  const allMoviesSearch = new Fuse(allMoviesData, {
    keys: ["title", "summary"],
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
};
