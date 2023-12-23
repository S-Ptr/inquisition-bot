const { SlashCommandBuilder} = require('discord.js');
const  User  = require('../../model/user.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dhregister')
		.setDescription('Become an inquisitor. Required first step to play the game.'),
	async execute(interaction) {
        const userid = interaction.user.id;
        const result = await User.findOne({"duid":userid}).exec();
        if(!result){
            var newUser = new User({duid:userid, trust:0, money:0, characters:[], rank:0});
            await newUser.save();
            await interaction.reply({content:"++ SUCCESS: You have successfully been added to the Inquisition. ++", ephemeral:true});
        }else{
            await interaction.reply({content:"++ ERROR: You are already a member of the Inquisition. ++", ephemeral:true});
        }
	},
};
