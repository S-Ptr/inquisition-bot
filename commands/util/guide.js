const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dhguide')
		.setDescription("Inquisitor's handbook"),
	async execute(interaction) {
		await interaction.reply({content:"WIP", ephemeral:true});
	},
};