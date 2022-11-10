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
import { allPotions } from "..";
import { potterDbPotionResponse } from "../request-types/potion";

export const data = new SlashCommandBuilder()
  .setName("potion")
  .setDescription("Get info about a potion")
  .addStringOption(
    new SlashCommandStringOption()
      .setName("potion")
      .setDescription("potion to get info about")
      .setRequired(true)
      .setAutocomplete(true)
  );
export const execute = async function (
  interaction: ChatInputCommandInteraction
) {
  await interaction.deferReply();

  try {
    var request: AxiosResponse<potterDbPotionResponse> = await axios.get(
      `https://api.potterdb.com/v1/potions/${interaction.options.getString(
        "potion",
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
  if (request.data.data.attributes.inventors)
    embed.setAuthor({ name: request.data.data.attributes.inventors });

  for (let point in request.data.data.attributes) {
    if (
      point == "name" ||
      point == "effect" ||
      point == "inventors" ||
      point == "image" ||
      point == "slug"
    )
      continue;
    if (!request.data.data.attributes[point]) continue;
    embed.addFields({
      name: point,
      value: request.data.data.attributes[point] ?? "",
    });
  }

  return interaction.editReply({ embeds: [embed] });
};
export const autocomplete = async function (
  interaction: AutocompleteInteraction
) {
  const allPotionsData = await allPotions;

  const allPotionsSearch = new Fuse(allPotionsData, {
    keys: ["name", "effect", "ingredients", "inventors", "manufacturers"],
  });
  const results = allPotionsSearch.search(interaction.options.getFocused(), {
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
};
