//CODIGO INICIAL
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: 53608447 });

//--------------------------------------------------
//require('dotenv').config();

//const token = process.env.TOKEN;

//console.log('Token:', token);

//-------------------------------------------------


const TOKEN = ''; // Reemplaza esto con el token de tu bot



client.once('ready', () => {
    console.log(`Bot iniciado como ${client.user.tag}`);
});

client.on('messageCreate', message => {
    // Comando para notificar la muerte de un jefe
    if (message.content.startsWith('!jefeMu')) {
        // Extraer el nombre del jefe del mensaje
        const bossName = message.content.split(' ')[1]; 

        if (bossName) {
            message.channel.send(`¡He derrotado a ${bossName}! 🎉`);
            
            // Opcional: cambiar el estado del bot en Discord
            client.user.setActivity(`Mató a ${bossName} en MU`, { type: 'PLAYING' });
        } else {
            message.channel.send('Por favor, indica el nombre del jefe. Ejemplo: !jefeMu Kundun');
        }
    }
});

client.login(TOKEN);
