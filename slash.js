const { REST } = require('@discordjs/rest');
const fs = require('node:fs');
const { Collection, Routes } = require("discord.js");

/* Configuration */
const {ID_BOT, ID_SERVER, Token} = require("./token.json");

/**
 * Enregistre les commandes créées dans le bot
 * @param dir - Chemin d'accès à un dossier sous forme de chaîne de caractères
 */
exports.refresh = function (bot, dir) {
	bot.commands = new Collection();
	const commands = [];
	const commandFiles = fs.readdirSync(dir).filter(file => file.endsWith('.js')); // Récupération des noms des fichiers

	for (const file of commandFiles) {
		const command = require(`${dir}/${file}`); // Require
		bot.commands.set(command.data.name, command);
		commands.push(command.data.toJSON());
		console.log("La commande \"" + command.data.name + "\" a été trouvée.");
	}
	console.log() //Espacement :D

	const rest = new REST({ version: '10' }).setToken(Token);

	(async () => {
		try {
			console.log('Rafraîchissement des commandes (/)...');
			ID_SERVER.forEach(async function (value) {
				await rest.put(
					Routes.applicationGuildCommands(bot.user.id, value),
					{ body: commands }
				);
			})
			console.log('Les commandes (/) ont été rafraîchies');
		} catch (error) {
			console.error("Erreur de rafraîchissement : ", error);
		}
	})();
}