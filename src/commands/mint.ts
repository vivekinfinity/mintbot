import { SlashCommandBuilder, CommandInteraction } from "discord.js";

const data = new SlashCommandBuilder()
  .setName("mint")
  .setDescription("Mints tokens!")
  .addStringOption((option) =>
    option
      .setName("address")
      .setDescription("Your Ethereum address")
      .setRequired(true)
  );
const SERVER_URL = "https://mintapp-vivekinfinity.vercel.app/api";
// const SERVER_URL = "http://localhost:3000/api";
async function mintTokens(address: string) {
  const response = await fetch(`${SERVER_URL}/mint`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address }),
  });

  if (response.ok) {
    return response.json();
  } else {
    throw new Error("Error minting tokens");
  }
}

async function execute(interaction: CommandInteraction) {
  const address = interaction.options.get("address")?.value as string;

  console.log(`Minting tokens for address: ${address}`);

  try {
    mintTokens(address);

    await interaction.reply(`Minted tokens for address: ${address}`);
  } catch (error) {
    console.error("Error minting tokens:", error);
    await interaction.reply(
      "An error occurred while minting tokens. Please try again later."
    );
  }
}

export { data, execute };
