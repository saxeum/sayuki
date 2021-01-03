module.exports = async (client, message) => {
	var prefixes = client.config.prefix;
	const mongoose = require("mongoose");
	if (message.author.bot) return;

  let messageArray = message.content.split(" ");

	var prefix = null;
	for (let thisPrefix of prefixes) {
		if (messageArray[0].startsWith(thisPrefix)) prefix = thisPrefix;
	}

	const UserSchema = require("../models/user.js");

	UserSchema.findOne({
    userID: message.author.id
  }, (err, user) => {
    if (err) {
      console.error(err);
		}
  	if (!user) {
    	const newUserSchema = new UserSchema({
				_id: mongoose.Types.ObjectId(),
        userID: message.author.id,
        lang: "lang_en",
      	dev: false
      });
    	return newUserSchema.save();
  	}
		var lang = require(`../langs/${user.lang}.json`);
		const storage = {
			lang: lang
		}

		client.storage = storage;

		if (!messageArray[0].startsWith(prefix)) return;
		
		let command = messageArray[1].toLowerCase();
		let args = messageArray.slice(2);

		let cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
		if (!cmd) return;

		cmd.execute(client, message, args);
		console.log(`[EXEC] "${command}" has been executed by ${message.author.tag}`);
	});
};