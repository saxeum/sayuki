module.exports = {
	name: "userinfo",
	aliases: ["user", "info"],
	execute: async (client,message,args) => {
		const Discord = require("discord.js");
		const storage = client.storage.lang;
		const mongoose = require("mongoose");
		const UserSchema = require("../models/user.js");

		let target =
			message.mentions.members.first() ||
			message.guild.members.cache.find(u => u.id === args[0]) ||
			message.guild.members.cache.find(u => u.user.username === args[0]) || message.guild.members.cache.find(u => u.nickname === args[0]) || client.users.cache.find(u => u.id === args[0]) || message.member;

		function timeConverter(UNIX_timestamp){
			var a = new Date(UNIX_timestamp);
			var day = a.getDate();
			if (day < 10) day = "0" + a.getDay();
			var month = a.getMonth();
			if (month < 10) month = `0${a.getMonth()+1}`;
			var result = `${day}/${month}/${a.getFullYear()}`
			return result;
		}

		var isStaff = "No.";

		UserSchema.findOne({
				userID: target.user.id
			}, async (err, user) => {
				if (user.dev) {
					isStaff = storage.yes;
				}
		
				let userEmbed = {
					thumbnail: { 
						url: target.user.displayAvatarURL(),
						width: 512,
						height: 512
					},
					title: storage.commands.user.title.replace("{user}", target.user.tag, "gi"),
					description: 
						`:id:: \`${target.user.id}\`.\n` + `:page_facing_up: ${storage.commands.user.nickname}: **${target.nickname ? target.nickname : storage.none}.**\n` + 
						`:robot: Bot: **${target.user.bot ? storage.yes : "No."}**\n` + 
						`:calendar: ${storage.commands.user.joindate}: **${timeConverter(target.guild.joinedTimestamp)}**.\n` + `:calendar: ${storage.commands.user.discorddate}: **${timeConverter(target.user.createdTimestamp)}**.\n` + `*️⃣ Status: ${storage.commands.user.status[target.user.presence.status]}\n` + 
						`:computer: Sayuki Team: **${isStaff}**\n \n` + 
						`:rocket: Roles: **${target.roles.cache.size-1 ? target.roles.cache.size-1 + " - " : storage.none}**${target.roles.cache.filter(r => r.id !== message.guild.id).map(roles => `\`${roles.name}\``).join(", ") + "." || `.`}`,
					color: "RANDOM",
					footer: { text: storage.commands.user.footer }
				}

				if (target.roles.cache.size-1 > 15) userEmbed.description = `:id:: \`${target.user.id}\`.\n` + `:page_facing_up: ${storage.commands.user.nickname}: **${target.nickname ? target.nickname : storage.none}.**\n` + 
						`:robot: Bot: **${target.user.bot ? storage.yes : "No."}**\n` + 
						`:calendar: ${storage.commands.user.joindate}: **${timeConverter(target.guild.joinedTimestamp)}**.\n` + `:calendar: ${storage.commands.user.discorddate}: **${timeConverter(target.user.createdTimestamp)}**.\n` + `*️⃣ Status: ${storage.commands.user.status[target.user.presence.status]}\n` + 
						`:computer: Sayuki Team: **${isStaff}**\n \n`;

				message.channel.send({ embed: userEmbed });
		});
	}
}