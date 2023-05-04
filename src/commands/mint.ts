import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { JsonRpcProvider } from "@ethersproject/providers";

const JSON_PRC_URL = "https://4fe7g-7iaaa-aaaak-aegcq-cai.raw.ic0.app";
const TOKEN_AMOUNT = "0x8ac7230489e80000";
const provider = new JsonRpcProvider(JSON_PRC_URL);

const data = new SlashCommandBuilder()
  .setName("mint")
  .setDescription("Mints tokens!")
  .addStringOption((option) =>
    option
      .setName("address")
      .setDescription("Your Ethereum address")
      .setRequired(true)
  );

function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
async function execute(interaction: CommandInteraction) {
  const address = interaction.options.get("address")?.value as string;

  console.log(`Minting tokens for address: ${address}`);

  if (!isValidAddress(address)) {
    await interaction.reply(
      "Invalid Ethereum address. Please provide a correct address."
    );
    return;
  }
  try {
    const amount = TOKEN_AMOUNT;
    provider.send("ic_mintEVMToken", [address, amount]);

    await interaction.reply(`Minted tokens for address: ${address}`);
  } catch (error) {
    console.error("Error minting tokens:", error);
    await interaction.reply(
      "An error occurred while minting tokens. Please try again later."
    );
  }
}

export { data, execute };
