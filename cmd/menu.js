//requires
const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { AUTHORIZED_USERS } = require("../token.json");
const fs = require('node:fs')
const questions = JSON.parse(fs.readFileSync("../questions.json"));

module.exports = {

	data: new SlashCommandBuilder()
		.setName("quizz")
		.setDescription("Administre les questions")
		.setDescriptionLocalization("en-GB", "Show the administration menu of the site.")
		.addSubcommand(sc => sc
			.setName("afficher")
			.setDescription("Affiche une questions")
			.addIntegerOption(o => o
				.setName("id")
				.setDescription("Indexation de la question")
				.setMinValue(0)
				.setMaxValue(questions.values.length - 1)
				.setRequired(true)
			)
		)
		.addSubcommand(sc => sc
			.setName("ajouter")
			.setDescription("Ajouter une question")
			.setDescriptionLocalization("en-GB", "Add a question")
			.addStringOption(o => o
				.setName("theme")
				.setDescription("Le thème de la question")
				.setDescriptionLocalization("en-GB", "Question's theme")
				.setRequired(true)
			)
			.addIntegerOption(o => o
				.setName("difficulty")
				.setDescription("Difficulté de la question")
				.setDescriptionLocalization("en-GB", "Question's difficulty")
				.setMinValue(1)
				.setMaxValue(5)
				.setRequired(true)
			)
			.addStringOption(o => o
				.setName("question")
				.setDescription("La question")
				.setDescriptionLocalization("en-GB", "Question")
				.setRequired(true)
			)
			.addStringOption(o => o
				.setName("answer")
				.setDescription("La réponse à la question")
				.setDescriptionLocalization("en-GB", "Question's answer")
				.setRequired(true)
			)
			.addStringOption(o => o
				.setName("explication")
				.setDescription("L'explication de la réponse")
				.setDescriptionLocalization("en-GB", "Answer's explication")
				.setRequired(true)
			)
		)

	/**
	 * Traitement de la commande
	 * @param {Interaction} interaction - Les informations de la commande
	*/
	, async execute(interaction) {
		if (AUTHORIZED_USERS.includes(interaction.user.id)) {
			if (interaction.options.getSubcommand() === "ajouter") {
				var opts = interaction.options;
				var array = questions.values;
				array.push({
						"theme":opts.getString("theme"),
						"difficulty":opts.getInteger("difficulty"),
						"question":opts.getString("question"),
						"answer":opts.getString("answer"),
						"explication":opts.getString("explication")
					})
				questions.values = array;
				fs.writeFileSync("../questions.json",JSON.stringify(questions));
				await interaction.reply("Oui");
			} else if (interaction.options.getSubcommand() === "afficher") {
				var id = interaction.options.getInteger("id");
				var q = questions["values"][id];
				const embed = new EmbedBuilder()
					.setColor("#FFFF00")
					.setTitle(q["question"])
					.setDescription("Thème : " + q["theme"] + " | Difficulté : " + q["difficulty"])
					.addFields(
						{ name: "Réponse", value: q["answer"] },
						{ name: "Explications", value: q["explication"] }
					)
				await interaction.reply({ embeds: [embed] });
			}
		} else {
			await interaction.reply({ content: "Vous n'avez pas les droits de lancer cette commande, ou vous ne pouvez pas la faire d'ici.", ephemeral: true });
		}
	}
}
