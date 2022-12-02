// Librairies
const fs = require("node:fs");
const { Client, GatewayIntentBits, InteractionType, ApplicationCommand } = require("discord.js");
const { refresh } = require("./slash");


// Configuration du bot
var config = JSON.parse(fs.readFileSync("./token.json"));

// Création du bot
const bot = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.DirectMessages
	]
})

// Connexion
bot.login(config.Token);

/**
 * Fichier principal gérant tous les sous-programmes du bot Discord
 * @author Roxnnis
 * @version 1.0
 */
bot.on("ready", () => {
	// Rafraîchissement des commandes
	refresh(bot, "./cmd");

	//config.ID_SERVER
	bot.guilds.cache.forEach(((v, k) => {
		updateServers(v.id);
	}))
	config = JSON.parse(fs.readFileSync("./token.json")); // Sécurité
	console.log("Le bot est fonctionnel !");
})

/**
 * Rafraîchir la liste des serveurs dans le JSON
 * @author Roxnnis
 * @version 1.0
 */
function updateServers(ID) {
	if (!config.ID_SERVER.includes(ID)) {
		config.ID_SERVER.push(ID);
		console.log("Le serveur " + v.name + " a été ajouté.");
		fs.writeFileSync("./token.json", JSON.stringify(config));
	}
}

/*
 * ========================
 * Listeners : Interactions
 * ========================
 */
bot.on("interactionCreate", async (i) => {
	if (i.type === InteractionType.ApplicationCommand) {
		const { commandName } = i;
		const command = bot.commands.get(commandName);

		if (!command) return;
		// Commande slash
		if (i.isCommand()) {
			try {
				/**
				 * Exécution de la commande choisie.
				 * @param {Interaction} i - L'interaction détectée par le bot
				 */
				await command.execute(i);
			} catch (err) {
				console.error(err);
			}
		}
	}
})

bot.on("guildCreate", (guild) => {
	updateServers(guild.id);
	config = JSON.parse(fs.readFileSync("./token.json")); // Sécurité
})