const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("server").setDescription("Returns server information"),
    async execute(interaction){
        await interaction.reply(`This interaction has been started in the ${interaction.guild.name} server, which has ${interaction.guild.memberCount} members`)
    }
}