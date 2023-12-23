const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder,  italic} = require('discord.js');
const  User  = require("../../model/user.js");
const  Character  = require("../../model/character.js");
const mongoose = require('mongoose');


const img_inquisitionpurge = 'https://static.wikia.nocookie.net/warhammer40k/images/d/df/Witchhunter_Executing_Heretic.jpg/revision/latest?cb=20120908002126'
const img_inquisitionlogo = 'https://styles.redditmedia.com/t5_4bq4g/styles/communityIcon_4sv6yr6idoh11.png';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dhterminate')
		.setDescription('Purge an acolyte from your ranks.'),
	async execute(interaction) {
        const userid = interaction.user.id;
        const result = await User.findOne({"duid":userid}).exec();
        if(!result){
            await interaction.reply({content:"++ ERROR: You are not an inquisitor. ++", ephemeral:true});
            return
        }
        const embed = new EmbedBuilder()
			.setTitle('Acolyte termination process')
			.setDescription('It is a necessity for inquisitors to terminate their agreements with acolytes who fall short of their expectations.')
			.setImage(img_inquisitionpurge)
			.setTimestamp()
			.setFooter({ text: '\u00A9 Warhammer Community', iconURL: img_inquisitionlogo });


        const select = new StringSelectMenuBuilder()
			.setCustomId('character')
			.setPlaceholder('Choose an Acolyte.');
        
        var i = 0
        for await (const char of Character.find({"userId":userid})){
            i++;
            select.addOptions(new StringSelectMenuOptionBuilder()
                        .setLabel(char.firstname + ' ' + char.lastname)
                        .setDescription(char.background +' - '+ char.origin)
                        .setValue(char._id.toString()));
        }
        if(i == 0){
            await interaction.reply({content:"++ ERROR: You command no acolytes at the moment. ++", ephemeral:true});
            return;
        }



        
        const row = new ActionRowBuilder()
			.addComponents(select);

		const response = await interaction.reply({
			components: [row], embeds:[embed]
		});

        const collectorFilter = i => i.user.id === interaction.user.id;

        var confirmation
        try {
	        confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
        } catch (e) {
	        await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
        }

        console.log(confirmation);
        const toDelete = confirmation.values[0];

        console.log(toDelete);

        Character.findOneAndDelete({ _id: new mongoose.Types.ObjectId(toDelete)}).then(()=>{
            confirmation.update({ content: 'Acolyte terminated.', components: [] });
        });



	},
};