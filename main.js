// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const { token } = require('./config.json');

//filesystem 
const fs = require("node:fs");
const path = require("node:path");

//database
const {mongoose} = require("mongoose");

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/inquisitorgame-db');
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('db connection ok')
})

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const cmdFolder = fs.readdirSync(foldersPath);

for(const folder of cmdFolder){
    const cmdPath = path.join(foldersPath, folder);
    const cmdFiles = fs.readdirSync(cmdPath).filter(file=> file.endsWith('.js'));
    for(const file of cmdFiles){
        const filePath = path.join(cmdPath, file);
        const command = require(filePath);
        if('data' in command && 'execute' in command){
            client.commands.set(command.data.name,command);
        }else{
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }

}

client.on(Events.InteractionCreate, async interaction =>{
    if(interaction.isChatInputCommand()){
        const command = interaction.client.commands.get(interaction.commandName);

        if(!command){
            console.error(`No command named ${interaction.commandName} found.`)
        }

        try{
            await command.execute(interaction);
        }catch(err){
            console.error(err);
            if(interaction.replied || interaction.deferred){
                await interaction.followUp({content: "Error executing this command", ephemeral:true});
            }else{
                await interaction.reply({content:"Error executing this command", ephemeral:true});
            }
        }
    }
})

global.img_femaleArbites = 'https://64.media.tumblr.com/97dc4637a71154aa85653a71b78b7829/tumblr_p3h615pC951vjjcaco1_1280.jpg';
global.img_maleArbites = 'https://64.media.tumblr.com/e5cbef1f8343f1062ec7437153649265/tumblr_om7xsvbuYs1vjjcaco1_1280.jpg';
global.img_femaleMinistorum = "https://64.media.tumblr.com/8dc97a35edacf089de9d27312c41d60d/a0825a001cb9d3e3-6c/s1280x1920/1dfc7e53a94551f88ec189db69164659ff1720a9.jpg";


// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);
