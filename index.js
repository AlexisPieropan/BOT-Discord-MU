const { Client, Intents } = require('discord.js');
const tesseract = require('tesseract.js');
const screenshot = require('screenshot-desktop');
const fs = require('fs');

// Configuración del bot de Discord
const client = new Client({ intents:  });
const TOKEN = ''; // Reemplaza esto con tu token de bot de Discord
const CHANNEL_ID = ''; // Reemplaza esto con el ID del canal de Discord donde quieres que el bot envíe mensajes
const USER_ID = '';

// Cuando el bot esté listo
client.once('ready', async () => {
    console.log(`Bot iniciado como ${client.user.tag}`);

    try {
        // Intentar obtener el canal de forma directa
        const channel = await client.channels.fetch(CHANNEL_ID);
        if (!channel) {
            console.error("No se pudo encontrar el canal. Verifica que el CHANNEL_ID sea correcto.");
            return;
        }
        console.log(`Conectado al canal: ${channel.name}`);

         // Obtener el tag del usuario basado en el USER_ID usando fetch
         const user = await client.users.fetch(USER_ID)
         .catch(err => {
             console.error(`Error al obtener el usuario: ${err}`);
             return null; // Devolver null en caso de error
         });

        // Función que captura pantalla, analiza con OCR y notifica a Discord
        const checkForBossKill = async () => {
            try {
                await screenshot({ filename: 'screen.png' });

                // Aplicar OCR a la imagen capturada
                tesseract.recognize('screen.png', 'eng')
                    .then(({ data: { text } }) => {
                        // Verifica si en el texto extraído aparece "Jefe muerto"
                        if (text.includes("Jefe derrotado")) {
                            console.log("¡Jefe derrotado detectado!");

                            // Obtener el nombre del jefe del texto (esto es solo un ejemplo)
                            const jefeNombre = text.match(/Jefe derrotado\s*(\w+)/)?.[1] || 'desconocido';

            
                            //TOMA EL USER QUE VIENE DEL FETCH SINO DA EL MSJ DE "USU DESCO"
                            const userTag = user ? user.tag : 'Usuario desconocido';
                            

                            // Mensaje personalizado
                            const mensaje = `${userTag} derrotó al jefe ${jefeNombre} 🎉`;

                            // Envía el mensaje a Discord
                            channel.send(mensaje);

                            // Opcional: Cambia el estado del bot en Discord
                            client.user.setActivity(`Derrotó a ${jefeNombre} en MU`, { type: 'PLAYING' });
                        } else {
                            console.log("No se detectó jefe muerto en esta captura.");
                        }
                    })
                    .catch(err => console.error(`Error de OCR: ${err}`))
                    .finally(() => {
                        fs.unlink('screen.png', (err) => {
                            if (err) {
                                console.error(`Error al eliminar la imagen: ${err}`);
                            } else {
                                console.log("Imagen eliminada correctamente.");
                            }
                        });
                    });
            } catch (error) {
                console.error(`Error al capturar pantalla: ${error.message}`);
            }
        };

        setInterval(checkForBossKill, 10000); // 10000 ms = 10 segundos

    } catch (error) {
        console.error(`Error al conectarse al canal: ${error.message}`);
    }
});

client.login(TOKEN);