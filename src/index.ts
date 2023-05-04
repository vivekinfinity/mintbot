import * as dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import path from "path";
import {
  Client,
  Collection,
  CommandInteraction,
  Events,
  GatewayIntentBits,
} from "discord.js";
import { fileURLToPath } from "url";
const client: any = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const currentFilePath = fileURLToPath(import.meta.url);
const currentDirname = path.dirname(currentFilePath);
const foldersPath = path.join(currentDirname, "commands");

const commandFiles = fs
  .readdirSync(foldersPath)
  .filter((file) => file.endsWith(".ts"));
for (const file of commandFiles) {
  const filePath = path.join(foldersPath, file);
  const command = await import(filePath);
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

client.once(Events.ClientReady, () => {
  console.log("Client is ready!");
});

client.on(Events.InteractionCreate, async (interaction: CommandInteraction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.login(process.env.BOT_TOKEN);

export default client;
