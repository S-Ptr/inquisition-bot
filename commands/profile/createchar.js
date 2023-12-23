const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder,  italic} = require('discord.js');
const  User  = require("../../model/user.js");
const  Character  = require("../../model/character.js");
const  Origin  = require("../../model/origin.js");
const charImages = require("../../charImages.js");
const mongoose = require('mongoose');

const prophecies = ["Mutation without, corruption within.","Trust in your fear.","Humans must die so that humanity can endure.", "The pain of the bullet is ecstasy compared to damnation.",
"Be a boon to your allies and the bane of your enemies.","The wise learn from the deaths of others.","Kill the alien before it can speak its lies.","Truth is subjective.",
"Thought begets heresy.","Heresy begets retribution.","A mind without purpose wanders in dark places.","If a job is worth doing, it is worth dying for.",
"Dark dreams lie upon the heart.","Violence solves everything.","Ignorance is a wisdom of its own.","Only the insane have strength enough to prosper.",
"A suspicious mind is a healthy mind.","Suffering is an unrelenting instructor.","The only true fear is dying without your duty done.","Only in death does duty end.",
"Innocence is an illusion.","To war is human.","There is no substitute for zeal.","Even one who has nothing can still offer his life.","Do not ask why you serve. Only ask how."];

const homeworlds = ["Feral World", "Hive World", "Forge World", "Shrine World", "Highborn", "Voidborn"];
const homeworldRecBgs = {
	"Feral World":["Adeptus Arbites", "Adeptus Astra Telepathica", "Imperial Guard", "Outcast"]
	, "Hive World":["Adeptus Arbites", "Adeptus Mechanicus", "Imperial Guard", "Outcast"]
	, "Forge World":["Adeptus Administratum", "Adeptus Arbites", "Adeptus Mechanicus", "Imperial Guard"]
	, "Shrine World":["Adeptus Administratum", "Adeptus Arbites", "Imperial Guard", "Adeptus Ministorum"]
	, "Highborn":["Adeptus Administratum", "Adeptus Arbites", "Adeptus Astra Telepathica", "Adeptus Ministorum"]
	, "Voidborn":["Adeptus Astra Telepathica", "Adeptus Ministorum", "Outcast", "Adeptus Mechanicus"]
};
const homeworld_aptitude = []

const backgrounds = ["Adeptus Administratum", "Adeptus Arbites", "Adeptus Astra Telepathica", "Adeptus Mechanicus", "Adeptus Ministorum", "Imperial Guard", "Outcast"];
const backgroundRecRoles = {
	"Adeptus Administratum":["Chirurgeon", "Hierophant", "Sage", "Seeker"]
	, "Adeptus Arbites":["Assassin", "Desperado", "Seeker", "Warrior"]
	, "Adeptus Astra Telepathica":["Chirurgeon", "Mystic", "Sage", "Seeker"]
	, "Adeptus Mechanicus":["Chirurgeon", "Hierophant", "Sage", "Seeker"]
	, "Adeptus Ministorum":["Chirurgeon", "Hierophant", "Seeker", "Warrior"]
	, "Imperial Guard":["Assassin", "Desperado", "Hierophant", "Warrior"]
	, "Outcast":["Assassin", "Desperado", "Seeker"]
}

const malenames_feral = ["Arz","Barik","Carm","Farn","Garak","Horst","Ihmk","Jart","Kulem","Larl","Mok","Narl","Oort","Pak","Ragaa","Salc","Tarl","Volc","Yarl","Zel"];
const malenames_low = ["Azariah","Canto","Darrial","Enoch","Festus","Gaius","Harlon","Jart","Irven","Jaspar","Killian","Lazarus","Mordicai","Nicodemus","Quinten","Rhaban",
						"Silvanto","Titus","Uriah","Zariel", "Xerxes"];
const malenames_high = ["Azararch","Baranoth","Cailien","Davrus","Erioch","Galliach","Harthos","Icharus","Karpath","Lothos","Marius","Noctine","Octavius","Partheos",
						"Quellus","Ramalies","Severan","Tyruss","Ventium","Zarath"];
const malenames_arch = ["Alaric","Barbosa","Caradoc","Draco","Eizen","Ferris","Grendal","Harlocke","Jenquin","Karlos","Lemant","Magnus","Naveen","Oscarl","Perrin","Romulus",
						"Sabanth","Uriel","Wolfe","Zarkov"];
const malenames_inf = ["Able","Bones","Cutter","Dakka","Doc","Ergs","Fanz","Flair","Garrit","Hons","Ills","Jak","Lax","Meng","Nast","Reddin","Scab","Shiv","Tranq","Wurm"];

const femalenames_feral = ["Arda","Cil","Dara","Ela","Drakka","Garma","Halli","Ing","Julla","Kelle","Merra","Nimm","Nulla","Paz","Russa","Sulle","Thima","Vas","Yanne","Zanna"];
const femalenames_low = ["Acadia","Balida","Cassa","Darial","Frennine","Galatia","Hanette","Jinzia","Karroleen","Liri","Magdala","Narcia","Pennette","Quineel","Rhia","Sesselie",
						"Thesse","Uri","Xandra","Zadori"];
const femalenames_high = ["Araleen","Castella","Elleantra","Fausta","Flavia","Heras","Irissa","Jucinda","Lucindia","Mycandra","Novianna","Nuella","Palanza","Praenta",
						"Regia","Scythia","Temetria","Thallia","Venria","Ymisse"];
const femalenames_arch = ["Aenisse","Bianca","Drusilla","Eos","Florenza","Genevieve","Hannette","Jocasta","Katarina","Lethe","Miranda","Pollonia","Rosalind","Severine","Tessera","Tzarelle",
						"Urania","Verity","Wynnif","Yasta"];
const femalenames_inf = ["Alta","Blue","Echo","Fatal","Flame","Gamma","Grace","Jaine","Lho","Mini","Nerva","Newt","Pris","Red","Steel","Starr","Tanda","Trix","Xina","Zedda"];

const lastNames_tes = ["Abitius", "Abor", "Accius", "Acicius", "Acilius", "Aeresius", "Aerius", "Afranius", "Afronia", "Agrudilius", "Albarnian", "Albuttian", "Alfena", "Allectus", 
"Alleius", "Amatius", "Ambustus", "Amiulusus", "Ammianus", "Amnis", "Amphia", "Ancharia", "Ancrus", "Andronicus", "Andus", "Angius", "Annius", "Antabolis", "Antias", "Antonius", 
"Anzione", "Apinia", "Aquilarios", "Arcadia", "Aretino", "Arius", "Armina", "Arria", "Artellian", "Artoria", "Artorius", "Asina", "Ateia", "Atius", "Atrius", "Attius", "Aurelia", 
"Auria", "Aurrus", "Aurunceia", "Autrus", "Avenicci", "Avidius", "Axilla", "Axius", "Baenius", "Barbula", "Bellienus", "Benirus", "Berne", "Bincal", "Blackwell", "Blandia", 
"Blasio", "Blonia", "Bolar", "Bradus", "Broad", "Broder", "Brolus", "Bruiant", "Brussiner", "Buca", "Bursio", "Burtilius", "Buteo", "Cadiusus", "Caelia", "Caerellia", "Caerellius",
 "Caesennius", "Calidia", "Calidius", "Callidus", "Callonus", "Calus", "Calussa", "Campano", "Cantaber", "Caprenia", "Carbo", "Carius", "Caro", "Cartia", "Carvain", "Casca", 
 "Cassiana", "Castorius", "Catanius", "Catiotus", "Catius", "Catraso", "Catullus", "Caudinus", "Cecia", "Cedus", "Celata", "Ceno", "Censoria", "Cento", "Cerunia", "Chenius", 
 "Cheynoslin", "Cines", "Cinna", "Cipius", "Civello", "Claevius", "Clanler", "Closcius", "Clutumnus", "Cnisia", "Colollius", "Colus", "Conciatius", "Conician", "Cornelius", 
 "Corrium", "Cosades", "Cosma", "Crunus", "Cullian", "Curio", "Dannus", "Darelliun", "Decanius", "Decimius", "Delitian", "Denian", "Denter", "Dergius", "Desidenius", "Donton", "Dor",
  "Doran", "Douar", "Draconis", "Dralgoner", "Duilis", "Duronia", "Duronius", "Egnatius", "Endario", "Entius", "Esdrecus", "Essagan", "Eudoxius", "Evicus", "Facian", "Faleria", 
  "Falto", "Falvius", "Falvo", "Famalius", "Fauseius", "Faustus", "Favonius", "Felannus", "Flaccus", "Flaeus", "Flarugrius", "Flavonius", "Flavus", "Flonius", "Floria", "Florius",
   "Fralmoton", "Fulbenus", "Fulcinius", "Furotis", "Gabenagus", "Gabinia", "Galenus", "Gallenus", "Garrana", "Gavinius", "Gawey", "Gemullus", "Geonette", "Gestor", "Giordano", 
   "Gloriosus", "Goldwine", "Goneld", "Gratas", "Gratius", "Gratus", "Gravius", "Green", "Gregori", "Hadrianus", "Hanotepelus", "Hanus", "Harmevus", "Harsinia", "Hassildor", 
   "Hateria", "Hayn", "Herennia", "Herennius", "Herius", "Hers", "Hertarian", "Hiriel", "Hodge", "Hoff", "Horatius", "Hosidius", "Hosidus", "Idolus", "Imbrex", "Inian", "Invel", 
   "Inventius", "Iulus", "Jannus", "Jarol", "Jeranus", "Jirich", "Jucanis", "Jullalian", "Junius", "Jurus", "Krately", "Kvinchal", "Lachance", "Laecinnius", "Laenius", "Laevinus", 
   "Laftrius", "Lalelius", "Lannus", "Larich", "Leontiulonus", "Leotelli", "Lerus", "Lex", "Liore", "Logellus", "Lollia", "Longus", "Loran", "Loreius", "Lovidicus", "Lusius", 
   "Maborel", "Macatus", "Maccius", "Macer", "Macrina", "Macro", "Maenius", "Magia", "Magius", "Mallius", "Mantedius", "Maraennius", "Maria", "Marillin", "Marius", "Maro", "Matius", 
   "Maximus", "Mede", "Melissaeia", "Menanius", "Mercius", "Mero", "Mevureius", "Mico", "Mido", "Monrius", "Moslin", "Muco", "Munia", "Musilchiotus", "Muspidius", "Mussillius", 
   "Nanus", "Nasica", "Navale", "Nerevelus", "Nigilius", "Nirol", "Nonius", "Nuccius", "Nuccusius", "Nuncius", "Odiil", "Oholin", "Olcinius", "Olo", "Opsius", "Orania", "Oranius", 
   "Orius", "Ostorius", "Otiustiris", "Ottus", "Palenix", "Papius", "Papus", "Patneim", "Pelagia", "Pelelius", "Petilia", "Petilius", "Petreia", "Pevengius", "Philidus", "Phillida",
    "Pictor", "Pinder", "Plalocius", "Platorius", "Plebo", "Plinius", "Plotius", "Polus", "Ponius", "Pontanian", "Popillius", "Portius", "Posuceius", "Prelius", "Prentus", "Previa",
	 "Pullia", "Pundus", "Puruseius", "Quarra", "Quaspus", "Quintilius", "Quintin", "Raman", "Rato", "Reman", "Rian", "Richton", "Rienus", "Rilian", "Roscius", "Rosentia", "Rufus", 
	 "Rulician", "Rullus", "Runellius", "Rusonius", "Saccus", "Sallustius", "Salutio", "Salvarus", "Salvius", "Scaeva", "Scerius", "Scinia", "Scipio", "Scotti", "Scribonia", 
	 "Secundus", "Secunia", "Senarel", "Senyan", "Septim", "Sertorius", "Sestius", "Sextius", "Sialius", "Sibassius", "Signus", "Silver", "Sintav", "Siruliulus", "Sophus", 
	 "Sorenshield", "Sosia", "Spurius", "Statlilia", "Statlilius", "Strabo", "Talanian", "Tasus", "Terentius", "Tharn", "Tiragrius", "Tituleius", "Tragus", "Trebatius", "Tremellia",
	  "Truiand", "Truptor", "Tucca", "Tullius", "Tunifus", "Turrianus", "Umbranox", "Urgelian", "Urgusiso", "Uriel", "Urtius", "Uulentanus", "Valentia", "Valerius", "Valga", 
	  "Valius", "Valodius", "Valus", "Vandacia", "Vanin", "Vant", "Vantinius", "Varga", "Varian", "Varo", "Varrid", "Varro", "Vassinus", "Vedius", "Velvus", "Vendicci", "Verres", 
	  "Verus", "Vesnia", "Vesuius", "Vici", "Viciulus", "Viducia", "Vinicia", "Vinicius", "Vinipter", "Vinius", "Viria", "Vitellia", "Vitellius", "Vlindrel", "Vlinorman", "Vonius", 
	  "Voria", "Vulpin", "Vulso", "Vulstaed", "Vunnis", "Wavrick", "Whitestrake", "Wotrus"];


	
module.exports = {
	data: new SlashCommandBuilder()
		.setName('dhcreatechar')
		.setDescription('Vets an acolyte according to your needs.'),
	async execute(interaction) {

		const userid = interaction.user.id;
        const result = await User.findOne({"duid":userid}).exec();
		if(!result){
            await interaction.reply({content:"++ ERROR: Unauthorized access. Please register with the Inquisition. ++", ephemeral:true});
			return;
        }
		
		const img_scribe = 'https://64.media.tumblr.com/1e8ea378e7cbceb9293778e7d13b2e1c/tumblr_pb56l2vsiH1vjjcaco1_1280.jpg';
		const img_people = 'https://64.media.tumblr.com/cd404e6fff9e07b5cae9d5aee39f495b/6cf48f044eff3c05-3e/s1280x1920/071e63f7816110c72143ac0ffdb82d99ba22a399.jpg';
		const img_gang = 'https://64.media.tumblr.com/be656973c041cccde6dcc2fd03a1b713/248968e4b62b5a0e-34/s1280x1920/3e606bff0ef471dfd141d1a1eee07ae720cbf253.jpg';
		const img_inquisitionlogo = 'https://styles.redditmedia.com/t5_4bq4g/styles/communityIcon_4sv6yr6idoh11.png';

		var home;
		var background;
		var role;

		var newChar = new Character();

		

		//HOMEWORLD

		const image = new EmbedBuilder()
			.setTitle('Candidate selection process for an Inquisitorial Acolyte')
			.setDescription('Select a homeworld from which to recruit your Acolyte')
			.setImage(img_scribe)
			.setTimestamp()
			.setFooter({ text: '\u00A9 by vladodinvodin', iconURL: 'https://styles.redditmedia.com/t5_4bq4g/styles/communityIcon_4sv6yr6idoh11.png' });
		//const defaultorigins = await Origin.find({race_limit:"hu"}).exec();
		const feral = new ButtonBuilder()
			.setCustomId('0')
			.setLabel('Feral World')
			.setStyle(ButtonStyle.Primary);
		const hive = new ButtonBuilder()
			.setCustomId('1')
			.setLabel('Hive World')
			.setStyle(ButtonStyle.Primary);
		const forge = new ButtonBuilder()
			.setCustomId('2')
			.setLabel('Forge World')
			.setStyle(ButtonStyle.Primary);
		const shrine = new ButtonBuilder()
			.setCustomId('3')
			.setLabel('Shrine World')
			.setStyle(ButtonStyle.Primary);
		const highborn = new ButtonBuilder()
			.setCustomId('4')
			.setLabel('Highborn')
			.setStyle(ButtonStyle.Primary);
		const voidborn = new ButtonBuilder()
			.setCustomId('5')
			.setLabel('Voidborn')
			.setStyle(ButtonStyle.Primary);
		const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Secondary);
		const hw_row1 = new ActionRowBuilder()
			.addComponents(feral)
			.addComponents(hive)
			.addComponents(forge)
			.addComponents(shrine);
		const hw_row2 = new ActionRowBuilder()
			.addComponents(highborn)
			.addComponents(voidborn)
			.addComponents(cancel);
		
		const worldresponse = await interaction.reply({content:'Choose a preferred homeworld.', embeds:[image] ,components:[hw_row1,hw_row2], ephemeral:false});

		const collectorFilter = i => i.user.id === interaction.user.id;
		var confirmation;

		try {
			confirmation = await worldresponse.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
		} catch (e) {
			await interaction.editReply({ content: 'Selection not received within 1 minute, cancelling', components: [], embeds:[]});
			return;
		}
		if(confirmation.customId == 'cancel'){
			await interaction.editReply({ content: 'Candidate selection process cancelled.', components: [], embeds:[] });
			return;
		}else{
			home = homeworlds[confirmation.customId];
		}

		//BACKGROUND

		const embed2 = new EmbedBuilder()
			.setTitle('Candidate selection process for an Inquisitorial Acolyte')
			.setDescription('Select a preferred candidate background')
			.setImage(img_people)
			.setTimestamp()
			.setFooter({ text: '\u00A9 Warhammer Community', iconURL: img_inquisitionlogo });


		const administratum = new ButtonBuilder()
			.setCustomId('0')
			.setLabel('Adeptus Administratum')
			.setStyle((homeworldRecBgs[home].includes("Adeptus Administratum"))?ButtonStyle.Success:ButtonStyle.Primary);
		const arbites = new ButtonBuilder()
			.setCustomId('1')
			.setLabel('Adeptus Arbites')
			.setStyle((homeworldRecBgs[home].includes("Adeptus Arbites"))?ButtonStyle.Success:ButtonStyle.Primary);
		const psyker = new ButtonBuilder()
			.setCustomId('2')
			.setLabel('Adeptus Astra Telepathica')
			.setStyle((homeworldRecBgs[home].includes("Adeptus Astra Telepathica"))?ButtonStyle.Success:ButtonStyle.Primary);
		const mechanicus = new ButtonBuilder()
			.setCustomId('3')
			.setLabel('Adeptus Mechanicus')
			.setStyle((homeworldRecBgs[home].includes("Adeptus Mechanicus"))?ButtonStyle.Success:ButtonStyle.Primary);
		const ministorum = new ButtonBuilder()
			.setCustomId('4')
			.setLabel('Adeptus Ministorum')
			.setStyle((homeworldRecBgs[home].includes("Adeptus Ministorum"))?ButtonStyle.Success:ButtonStyle.Primary);
		const imperialguard = new ButtonBuilder()
			.setCustomId('5')
			.setLabel('Imperial Guard')
			.setStyle((homeworldRecBgs[home].includes("Imperial Guard"))?ButtonStyle.Success:ButtonStyle.Primary);
		const outcast = new ButtonBuilder()
			.setCustomId('6')
			.setLabel('Outcast')
			.setStyle((homeworldRecBgs[home].includes("Outcast"))?ButtonStyle.Success:ButtonStyle.Primary);
		
		
		const bg_row1 = new ActionRowBuilder()
			.addComponents(administratum)
			.addComponents(arbites)
			.addComponents(psyker)
			.addComponents(mechanicus);
		const bg_row2 = new ActionRowBuilder()
			.addComponents(ministorum)
			.addComponents(imperialguard)
			.addComponents(outcast)
			.addComponents(cancel);

		const response2 = await interaction.followUp({ embeds:[embed2],components: [bg_row1,bg_row2] });

		var confirmation2;

		try {
			confirmation2 = await response2.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
		} catch (e) {
			await interaction.editReply({ content: 'Selection not received within 1 minute, cancelling', components: [], embeds:[] });
			return;
		}
		if(confirmation2.customId == 'cancel'){
			await interaction.editReply({ content: 'Candidate selection process cancelled.', components: [], embeds:[] });
			return;
		}else{
			background = backgrounds[confirmation2.customId];
		}

		//ROLE

		const embed3 = new EmbedBuilder()
			.setTitle('Candidate selection process for an Inquisitorial Acolyte')
			.setDescription('Select a role for your Acolyte. Recommended roles are highlighted in green.')
			.setImage(img_gang)
			.setTimestamp()
			.setFooter({ text: '\u00A9 Warhammer Community', iconURL: 'https://styles.redditmedia.com/t5_4bq4g/styles/communityIcon_4sv6yr6idoh11.png' });


		const assassin = new ButtonBuilder()
			.setCustomId('Assassin')
			.setLabel('Assassin')
			.setStyle((backgroundRecRoles[background].includes("Assassin"))?ButtonStyle.Success:ButtonStyle.Primary);
		const chirurgeon = new ButtonBuilder()
			.setCustomId('Chirurgeon')
			.setLabel('Chirurgeon')
			.setStyle((backgroundRecRoles[background].includes("Chirurgeon"))?ButtonStyle.Success:ButtonStyle.Primary);
		const desperado = new ButtonBuilder()
			.setCustomId('Desperado')
			.setLabel('Desperado')
			.setStyle((backgroundRecRoles[background].includes("Desperado"))?ButtonStyle.Success:ButtonStyle.Primary);
		const hierophant = new ButtonBuilder()
			.setCustomId('Hierophant')
			.setLabel('Hierophant')
			.setStyle((backgroundRecRoles[background].includes("Hierophant"))?ButtonStyle.Success:ButtonStyle.Primary);
		const mystic = new ButtonBuilder()
			.setCustomId('Mystic')
			.setLabel('Mystic')
			.setStyle((backgroundRecRoles[background].includes("Mystic"))?ButtonStyle.Success:ButtonStyle.Primary);
		const sage = new ButtonBuilder()
			.setCustomId('Sage')
			.setLabel('Sage')
			.setStyle((backgroundRecRoles[background].includes("Sage"))?ButtonStyle.Success:ButtonStyle.Primary);
		const seeker = new ButtonBuilder()
			.setCustomId('Seeker')
			.setLabel('Seeker')
			.setStyle((backgroundRecRoles[background].includes("Seeker"))?ButtonStyle.Success:ButtonStyle.Primary);
		const warrior = new ButtonBuilder()
			.setCustomId('Warrior')
			.setLabel('Warrior')
			.setStyle((backgroundRecRoles[background].includes("Warrior"))?ButtonStyle.Success:ButtonStyle.Primary);
		
		
		const role_row1 = new ActionRowBuilder()
			.addComponents(assassin)
			.addComponents(chirurgeon)
			.addComponents(desperado)
			.addComponents(hierophant);
		const role_row2 = new ActionRowBuilder()
			.addComponents(mystic)
			.addComponents(sage)
			.addComponents(seeker)
			.addComponents(warrior);
		const role_row3 = new ActionRowBuilder()
			.addComponents(cancel);

		const response3 = await interaction.followUp({ embeds:[embed3],components: [role_row1,role_row2, role_row3] });

		var confirmation3;

		try {
			confirmation3 = await response3.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
		} catch (e) {
			await interaction.editReply({ content: 'Selection not received within 1 minute, cancelling', components: [], embeds:[] });
			return;
		}
		if(confirmation3.customId == 'cancel'){
			await interaction.editReply({ content: 'Candidate selection process cancelled.', components: [], embeds:[] });
			return;
		}else{
			role = confirmation3.customId;
		}

		const lastname = lastNames_tes[Math.floor(Math.random() * lastNames_tes.length)]
		var firstname;
		const gender = (Math.random() > 0.5)?"Male":"Female";

		if(gender == "Male"){
			switch (home) {
				case "Feral World":
					firstname = malenames_feral[Math.floor(Math.random() * malenames_feral.length)];
					break;
				case "Hive World":
					firstname =(Math.random() > 0.5)?malenames_low[Math.floor(Math.random() * malenames_low.length)]:malenames_inf[Math.floor(Math.random() * malenames_inf.length)];
					break;
				case "Highborn":
					firstname =(Math.random() > 0.5)?malenames_high[Math.floor(Math.random() * malenames_high.length)]:malenames_arch[Math.floor(Math.random() * malenames_arch.length)];
					break;
				case "Shrine World":
					firstname =(Math.random() > 0.5)?malenames_low[Math.floor(Math.random() * malenames_low.length)]:malenames_arch[Math.floor(Math.random() * malenames_arch.length)];
					break;
				default:
					firstname =(Math.random() > 0.5)?malenames_low[Math.floor(Math.random() * malenames_low.length)]:malenames_high[Math.floor(Math.random() * malenames_high.length)];
					break;
			}
		}
		else{
			switch (home) {
				case "Feral World":
					firstname = femalenames_feral[Math.floor(Math.random() * femalenames_feral.length)];
					break;
				case "Hive World":
					firstname =(Math.random() > 0.5)?femalenames_low[Math.floor(Math.random() * femalenames_low.length)]:femalenames_inf[Math.floor(Math.random() * femalenames_inf.length)];
					break;
				case "Highborn":
					firstname =(Math.random() > 0.5)?femalenames_high[Math.floor(Math.random() * femalenames_high.length)]:femalenames_arch[Math.floor(Math.random() * femalenames_arch.length)];
					break;
				case "Shrine World":
					firstname =(Math.random() > 0.5)?femalenames_low[Math.floor(Math.random() * femalenames_low.length)]:femalenames_arch[Math.floor(Math.random() * femalenames_arch.length)];
					break;
				default:
					firstname =(Math.random() > 0.5)?femalenames_low[Math.floor(Math.random() * femalenames_low.length)]:femalenames_high[Math.floor(Math.random() * femalenames_high.length)];
					break;
			}
		}

		const divination = prophecies[Math.floor(Math.random() * prophecies.length)]
	
		newChar._id = new mongoose.Types.ObjectId();
		newChar.firstname=firstname
		newChar.lastname=lastname
		newChar.gender=gender
		newChar.origin=home
		newChar.role=role
		newChar.background=background
		newChar.divination=divination
		newChar.equipment = [];
		newChar.aptitudes = [];
		newChar.userId = userid

		//Characteristics
		const goodroll = ()=>{
			var max1,max2
			var d10roll1 = Math.floor(Math.random()*10) + 1
			var d10roll2 = Math.floor(Math.random()*10) + 1
			var d10roll3 = Math.floor(Math.random()*10) + 1
			max1 = Math.max(d10roll1,d10roll2);
			max2 = (max1==d10roll1)?Math.max(d10roll2,d10roll3):Math.max(d10roll1,d10roll3);
			return 20+max1+max2;
		}

		const badroll = ()=>{
			var min1,min2
			var d10roll1 = Math.floor(Math.random()*10) + 1;
			var d10roll2 = Math.floor(Math.random()*10) + 1;
			var d10roll3 = Math.floor(Math.random()*10) + 1;
			min1 = Math.min(d10roll1,d10roll2);
			min2 = (min1==d10roll1)?Math.min(d10roll2,d10roll3):Math.min(d10roll1,d10roll3);
			return 20+min1+min2;
		}

		newChar.ws = 20+Math.floor(Math.random()*10) + 1 + Math.floor(Math.random()*10) + 1;
		newChar.bs = 20+Math.floor(Math.random()*10) + 1 + Math.floor(Math.random()*10) + 1;

		
		//STRENGTH
		if(["Feral World"].includes(newChar.origin)){
			newChar.str = goodroll();
		}
		else if(["Voidborn"].includes(newChar.origin)){
			newChar.str = badroll()
		}
		else{
			newChar.str = 20+Math.floor(Math.random()*10) + 1 + Math.floor(Math.random()*10) + 1;
		}

		//TOUGHNESS
		if(["Feral World", "Forge World"].includes(newChar.origin)){
			newChar.tough = goodroll();
		}
		else if(["Highborn"].includes(newChar.origin)){
			newChar.tough = badroll()
		}
		else{
			newChar.tough = 20+Math.floor(Math.random()*10) + 1 + Math.floor(Math.random()*10) + 1;
		}

		//AGILITY
		if(["Hive World"].includes(newChar.origin)){
			newChar.agi = goodroll();
		}
		else if([].includes(newChar.origin)){
			newChar.agi = badroll()
		}
		else{
			newChar.agi = 20+Math.floor(Math.random()*10) + 1 + Math.floor(Math.random()*10) + 1;
		}

		//INTELLIGENCE
		if(["Forge World", "Voidborn"].includes(newChar.origin)){
			newChar.int = goodroll();
		}
		else if([].includes(newChar.origin)){
			newChar.int = badroll()
		}
		else{
			newChar.int = 20+Math.floor(Math.random()*10) + 1 + Math.floor(Math.random()*10) + 1;
		}

		//PERCEPTION
		if(["Hive World"].includes(newChar.origin)){
			newChar.per = goodroll();
		}
		else if(["Shrine World"].includes(newChar.origin)){
			newChar.per = badroll()
		}
		else{
			newChar.per = 20+Math.floor(Math.random()*10) + 1 + Math.floor(Math.random()*10) + 1;
		}

		//WILLPOWER
		if(["Shrine World", "Voidborn"].includes(newChar.origin)){
			newChar.wp = goodroll();
		}
		else if(["Hive World"].includes(newChar.origin)){
			newChar.wp = badroll()
		}
		else{
			newChar.wp = 20+Math.floor(Math.random()*10) + 1 + Math.floor(Math.random()*10) + 1;
		}

		//FELLOWSHIP
		if(["Highborn", "Shrine World"].includes(newChar.home)){
			newChar.fel = goodroll();
		}
		else if(["Forge World"].includes(newChar.origin)){
			newChar.fel = badroll()
		}
		else{
			newChar.fel = 20+Math.floor(Math.random()*10) + 1 + Math.floor(Math.random()*10) + 1;
		}

		//INFLUENCE
		if(["Highborn"].includes(newChar.origin)){
			newChar.ifl = goodroll();
		}
		else if(["Feral World"].includes(newChar.origin)){
			newChar.ifl = badroll()
		}
		else{
			newChar.ifl = 20+Math.floor(Math.random()*10) + 1 + Math.floor(Math.random()*10) + 1;
		}

		//WOUNDS, FATE,...
		switch (newChar.origin) {
			case "Feral World":
				newChar.wounds = 9+Math.floor(Math.random()*5) + 1;
				newChar.fate_t = 2;
				newChar.fate_te = 3;
				break;
		
			case "Hive World":
				newChar.wounds = 8+Math.floor(Math.random()*5) + 1;
				newChar.fate_t = 2;
				newChar.fate_te = 6;
				break;
			case "Forge World":
				newChar.wounds = 8+Math.floor(Math.random()*5) + 1;
				newChar.fate_t = 3;
				newChar.fate_te = 8;
				break;
			case "Shrine World":
				newChar.wounds = 7+Math.floor(Math.random()*5) + 1;
				newChar.fate_t = 3;
				newChar.fate_te = 6;
				break;
			case "Highborn":
				newChar.wounds = 9+Math.floor(Math.random()*5) + 1;
				newChar.fate_t = 4;
				newChar.fate_te = 10;
				break;
			case "Voidborn":
				newChar.wounds = 7+Math.floor(Math.random()*5) + 1;
				newChar.fate_t = 3;
				newChar.fate_te = 5;
				break;
		}

		const charImage = charImages[gender][background];
		if(charImage == null){
			charImage = img_inquisitionlogo;
		}


		
		const exampleEmbed = new EmbedBuilder()
			.setColor(0x990000)
			.setTitle(firstname + " " + lastname)
			.setAuthor({ name: 'Acolyte successfully recruited', iconURL: img_inquisitionlogo })
			.setDescription(italic('"'+divination+'"'))
			.addFields(
				{ name: 'Gender', value: gender },
				{ name: 'Homeworld', value: home },
				{ name: 'Background', value: background },
				{ name: 'Role', value: role },
				{ name: 'Wounds', value: newChar.wounds.toString() },
				{ name: '\u200b', value: '\u200b' },
				{ name: 'Weapon Skill', value: newChar.ws.toString(), inline:true},
				{ name: 'Ballistic Skill', value: newChar.bs.toString(), inline:true},
				{ name: 'Strength', value: newChar.str.toString(), inline:true},
				{ name: 'Toughness', value: newChar.tough.toString(), inline:true},
				{ name: 'Agility', value: newChar.agi.toString(), inline:true},
				{ name: 'Intelligence', value: newChar.int.toString(), inline:true},
				{ name: 'Perception', value: newChar.per.toString(), inline:true},
				{ name: 'Willpower', value: newChar.wp.toString(), inline:true},
				{ name: 'Fellowship', value: newChar.fel.toString(), inline:true},
				

			)
			.setImage(charImage)
			.setTimestamp()

			const dbResponse = await newChar.save();

			const dbResponse2 = await User.findOneAndUpdate({"duid":userid}, {$push:{"characters":dbResponse._id}});
			

			await interaction.followUp({ embeds: [exampleEmbed] });
		
	},
};
