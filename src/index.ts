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
client.login(process.env.TOKEN);
