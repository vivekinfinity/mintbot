import * as dotenv from "dotenv";
dotenv.config();
import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const commands = [];

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
    commands.push(command.data.toJSON());
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

const rest = new REST().setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const data = await rest.put(
      Routes.applicationGuildCommands(
        process.env.BOT_CLIENT_ID,
        process.env.BOT_GUILD_ID
      ),
      {
        body: commands,
      }
    );

    console.log(
      `Successfully reloaded ${(data as any).length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
})();
