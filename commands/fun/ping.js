const { SlashCommandBuilder } = require('discord.js');
const { JsonRpcProvider } = require('@ethersproject/providers');

// Replace this with your JSON-RPC URL

const JSON_PRC_URL = 'https://4fe7g-7iaaa-aaaak-aegcq-cai.raw.ic0.app';
const TOKEN_AMOUNT = '0x8ac7230489e80000';

// Create a JsonRpcProvider instance
const provider = new JsonRpcProvider(JSON_PRC_URL);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mint')
		.setDescription('Mints tokens!')
		.addStringOption((option) =>
			option
				.setName('address')
				.setDescription('Your Ethereum address')
				.setRequired(true),
		),
	async execute(interaction) {
		// Get the user's Ethereum address from the interaction
		const address = interaction.options.getString('address');

		// Define the amount of tokens to mint (replace this with the desired amount)
		const amount = TOKEN_AMOUNT;

		try {
			// Send the custom JSON-RPC method to mint tokens
			provider.send('ic_mintEVMToken', [address, amount]);

			// Reply with a success message
			await interaction.reply(`Minted ${amount} tokens for address: ${address}`);
		}
		catch (error) {
			// Handle any errors during the minting process
			console.error('Error minting tokens:', error);
			await interaction.reply('An error occurred while minting tokens. Please try again later.');
		}
	},
};
