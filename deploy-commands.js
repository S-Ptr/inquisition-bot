const {REST, Routes} = require("discord.js");
const {clientId, guildId, token} = require("./config.json");
const fs = require("node:fs");
const path = require("node:path");


const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const cmdFolders = fs.readdirSync(foldersPath);
for(const folder of cmdFolders){
    const cmdPath = path.join(foldersPath, folder);
    const cmdFiles = fs.readdirSync(cmdPath);
    for(const file of cmdFiles){
        const filePath = path.join(cmdPath,file);
        const command = require(filePath);
        if('data' in command && 'execute' in command){
            commands.push(command.data.toJSON());
        }else{
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

const rest = new REST().setToken(token);

(async () =>{
    try{
        console.log(`Started refreshing ${commands.length} slash commands.`);

        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),{body:commands}
        );

        console.log(`Reloading ${data.length} commands was a success.`);
    }catch(err){
        console.log(err);
    }
})();