import {
  Client,
  Collection,
  GatewayIntentBits,
  Interaction,
  Partials,
  REST,
  Routes,
} from "discord.js";
import path from "node:path";
import fs from "node:fs";
import dotenv from "dotenv";
import {
  potterDbAllSpellsResponse,
  potterDbSpellAtributes,
} from "./request-types/spell";
import axios, { AxiosResponse } from "axios";
import {
  potterDbAllPotionsResponse,
  potterDbPotionAtributes,
} from "./request-types/potion";
dotenv.config();

if (!process.env.TOKEN) throw new Error("no token");

class botClient extends Client {
  commands: any;
}

export const client = new botClient({
  intents: [GatewayIntentBits.Guilds],
  partials: [Partials.Channel],
});
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

client.commands = new Collection();
const commands: any[] = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file: any) => file.endsWith(".js"));
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  commands.push(command.data.toJSON());
  client.commands.set(command.data.name, command);
}

client.once("ready", async () => {
  console.log("Client is ready!");
  try {
    console.log("Started refreshing application (/) commands.");
    if (client.user) {
      await rest.put(Routes.applicationCommands(client.user.id), {
        body: commands,
      });
    } else throw console.error("error fetching client id!");

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
});

client.on("interactionCreate", async (interaction: Interaction) => {
  //TODO: make this nicer
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (command) {
      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
      }
    }
  } else if (interaction.isAutocomplete()) {
    const command = client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.autocomplete(interaction);
    } catch (error) {
      console.error(error);
    }
  }
});

// this should really be cleaned up
// and turned into a function that can be reused for other data types
async function getSpellsData(): Promise<potterDbSpellAtributes[]> {
  let allSpells: potterDbSpellAtributes[] = [];
  let spellUrls = [
    "https://api.potterdb.com/v1/spells?page[number]=1",
    "https://api.potterdb.com/v1/spells?page[number]=2",
    "https://api.potterdb.com/v1/spells?page[number]=3",
    "https://api.potterdb.com/v1/spells?page[number]=4",
  ];
  for (let url of spellUrls) {
    let response: AxiosResponse<potterDbAllSpellsResponse> = await axios.get(
      url
    );
    for (let spell of response.data.data) {
      allSpells.push(spell.attributes);
    }
  }
  return allSpells;
}
export const allSpells = getSpellsData();

async function getPotionsData(): Promise<potterDbPotionAtributes[]> {
  let allPotions: potterDbPotionAtributes[] = [];
  let potionUrls = [
    "https://api.potterdb.com/v1/potions?page[number]=1",
    "https://api.potterdb.com/v1/potions?page[number]=2",
  ];
  for (let url of potionUrls) {
    let response: AxiosResponse<potterDbAllPotionsResponse> = await axios.get(
      url
    );
    for (let potion of response.data.data) {
      allPotions.push(potion.attributes);
    }
  }
  return allPotions;
}
export const allPotions = getPotionsData();

client.login(process.env.TOKEN);
