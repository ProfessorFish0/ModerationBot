const Discord = require("discord.js");
const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"]
});
const settings = require("./serverSettings.json");
const modmails = require("./modmails.json");
const disbut = require("discord-buttons");
const discaudio = require("discaudio");
const disbutpages = require("discord-embeds-pages-buttons");
const reactionRoles = require("./reactionRoles.json");
disbut(client);
const fetch = require("node-fetch");
const fs = require("fs");
var prefix = settings.prefix;
const colour = "RANDOM";
client.on("ready", () => {
  client.user.setActivity(`DM for modmail | ${prefix}help`, {
    type: "WATCHING"
  });
  console.log(`Logged in as ${client.user.tag}!`);
});

//normal commands
client.on("message", async (message) => {
  var prefix = settings.prefix;
  const args = message.content.toLowerCase().split(" ");
  if (!args[1] && message.mentions.users.first() == client.user) {
    const embed = new Discord.MessageEmbed()
      .setColor(colour)
      .setAuthor(client.user.tag, client.user.avatarURL({ dynamic: true }))
      .setThumbnail(
        `https://cdn.discordapp.com/icons/${message.guild.id}/${message.guild.icon}`
      )
      .setDescription("Hello!\nMy prefix is **" + prefix + "**");
    message.channel.send(embed);
  }
  if (
    message.author.bot ||
    message.channel.type == "dm" ||
    args[0][0] != settings.prefix
  )
    return;
  discaudio.music(message, client, prefix, {});
  if (["help", "h"].find((k) => prefix + k == args[0])) {
    const menu = new Discord.MessageEmbed()
      .setColor(colour)
      .setAuthor(
        message.author.tag,
        message.author.avatarURL({ dynamic: true })
      )
      .setThumbnail(client.user.avatarURL({ dynamic: true }))
      .setTitle(message.guild.name)
      .setFooter("<> = required, [] = optional || DM for modmail")
      .setDescription(
        `**Page 1:** Admin Commands\n**Page 2:** Fun Commands\n**Page 3:** Music Commands\n**Page 4:** Miscellaneous`
      );
    const embed1 = new Discord.MessageEmbed()
      .setColor(colour)
      .setFooter("<> = required, [] = optional || DM for modmail")
      .addField(
        `:hammer_pick: Admin Commands :hammer_pick:`,
        `**${prefix}prefix <newPrefix>: Changes the prefix to the new prefix provided** \n**${prefix}kick <@member> [reason]:** Kicks the mentioned member\n**${prefix}ban <@member> [reason]:** Bans the mentioned member\n**${prefix}reactionrole <messageID> <emoji> <@role> <#channel>:** Initiates a reaction role on the target message\n**${prefix}modmail close:** Closes the modmail in the current modmail channel`
      )
      .setAuthor(
        message.author.tag,
        message.author.avatarURL({ dynamic: true })
      )
      .setThumbnail(client.user.avatarURL({ dynamic: true }));

    const embed2 = new Discord.MessageEmbed()
      .setColor(colour)
      .setAuthor(
        message.author.tag,
        message.author.avatarURL({ dynamic: true })
      )
      .setThumbnail(client.user.avatarURL({ dynamic: true }))
      .setFooter("<> = required, [] = optional || DM for modmail")
      .addField(
        ":video_game: Fun Commands :video_game:",
        `**${prefix}animal [animal]:** Displays a picture of the animal and a fact about them\n**${prefix}meme:** Gets a random meme from reddit\n**${prefix}pokemon <pokemon>:** Gets information about the provided pokemon\n**${prefix}fact:** Sends a random fact\n**${prefix}riddle:** Sends a random riddle\n**${prefix}joke:** Sends a random joke\n**${prefix}effect [effect]:** Sends an edited version of your profile picture with either the provided effect or a random effect`
      );
    const embed3 = new Discord.MessageEmbed()
      .setColor(colour)
      .setFooter("<> = required, [] = optional || DM for modmail")
      .addField(
        ":musical_note: Music Commands :musical_note:",
        `**${prefix}play <query/url>:** Searches youtube for the provided query/url and plays it.\n**${prefix}skip:** Skips the currently playing song\n**${prefix}volume <volume>:** Sets the volume of the music to the provided volume\n**${prefix}nowplaying:** Gets information about the song that is currently playing\n**${prefix}remove <index>:** Removes the song from the queue at the provided index\n**${prefix}stop:** Stops the music, deletes the queue and leaves the voice channel\n**${prefix}queue:** Shows the list of the songs in the queue\n**${prefix}pause:** Pauses the currently playing son\n**${prefix}resume:** Unpauses the music`
      )
      .setAuthor(
        message.author.tag,
        message.author.avatarURL({ dynamic: true })
      )
      .setThumbnail(client.user.avatarURL({ dynamic: true }));

    const embed4 = new Discord.MessageEmbed()
      .setColor(colour)
      .setAuthor(
        message.author.tag,
        message.author.avatarURL({ dynamic: true })
      )
      .setThumbnail(client.user.avatarURL({ dynamic: true }))
      .setFooter("<> = required, [] = optional || DM for modmail")
      .addField(
        ":ribbon: Miscellaneous :ribbon:",
        `**${prefix}help:** Displays this embed\n**${prefix}ping:** Displays the bots latency to Discord\n**${prefix}avatar [@user]:** Displays the avatar of the mentioned user/person who ran the command`
      );
    var pages = [menu, embed1, embed2, embed3, embed4];
    disbutpages.pages(
      client,
      message,
      pages,
      100000,
      disbut,
      "green",
      "red",
      "⏩",
      "⏪",
      "❌",
      "Forward",
      "Backward",
      "Delete",
      []
    );
  } else if (["modmail", "mm"].find((k) => prefix + k == args[0])) {
    if (!message.member.roles.cache.find((k) => k.id == "863405388296355870"))
      return message.channel.send(
        "You must be support to use mod mail commands!"
      );
    if (!args[1]) {
      const embed = new Discord.MessageEmbed()
        .setColor(colour)
        .setAuthor(
          message.author.tag,
          message.author.avatarURL({ dynamic: true })
        )
        .setTitle("ModMail Commands")
        .setDescription(
          `**${prefix}modmail close:** Closes the modmail thread in the channel the command is sent in.`
        );
      message.channel.send(embed);
    } else if (args[1] == "close") {
      if (!modmails.mails.find((k) => k.channelID == message.channel.id))
        return message.channel.send("This channel is not a modmail channel!");
      var reason = args.slice(2).join(" ");
      const embed = new Discord.MessageEmbed()
        .setColor(colour)
        .setAuthor(
          message.author.tag,
          message.author.avatarURL({ dynamic: true })
        )
        .setDescription(`ModMail Thread Closed for reason: ${reason}`)
        .setTimestamp();
      var user = await message.guild.members.fetch(
        `${
          message.channel.topic.split(" ")[
            message.channel.topic.split(" ").length - 1
          ]
        }`
      );
      user.send(embed);
      message.channel.send(embed);
      modmails.mails.splice(
        modmails.mails.findIndex((k) => k.id == user.id),
        1
      );
      fs.writeFile("./modmails.json", JSON.stringify(modmails), function () {
        1;
      });
      await message.channel.delete(`ModMail solved reason: ${reason}`);
      message.guild.channels.cache
        .find((k) => k.id == settings.modmailChannel)
        .send(embed);
      return;
    }
    /*else if(args[1] == "take"){
      if(!args[2] || !modmails.mails.find(k=> k.number == args[2]))return message.channel.send("Invalid thread ID, solved thread or someone else has taken the thread.")
      var index = modmails.mails.findIndex(k=> k.number == args[2])
      modmails.mails.splice(index, 1)
      fs.writeFile("./modmails.json", JSON.stringify(modmails), function(){
        1
      })
      var guild = client.guilds.cache.find(k=> k.id == 859833614124449832)
      var channel = guild.channels.cache.find(k=> k.id == settings.modmailChannel)
      channel.send(`${message.author.tag} has taken thread ${args[2]}`)
    }*/
  } else if (["reactionrole", "rr"].find((k) => prefix + k == args[0])) {
    if (!message.member.hasPermission("MANAGE_GUILD", "ADMINISTRATOR"))
      return message.reply(`
It looks like you do not have the proper permissions to execute this command
Missing Permission:
Manage Server`);
    if (
      !message.guild.me.hasPermission(
        "MANAGE_MEMBERS",
        "ADMINISTRATOR",
        "MANAGE_ROLES"
      )
    )
      return message.reply(`
It looks like I do not have the proper permissions to execute this command
Missing Permission:
Manage Members`);
    var roleHighest = false;
    for (var i = 0; i < message.mentions.roles.array().length; i++) {
      if (
        message.mentions.roles.array()[i].position >=
          message.guild.member(message.author.id).roles.highest.position &&
        message.author.id != message.guild.ownerID
      ) {
        roleHighest = true;
      }
    }
    if (roleHighest)
      return message.channel.send(
        "Your highest role is lower in the role hierarchy than the mentioned role."
      );
    if (
      !args[1] ||
      !args[2] ||
      !args[3] ||
      !message.mentions.roles.first() ||
      !message.mentions.channels.first() ||
      isNaN(args[1])
    ) {
      message.channel.send(
        `Invalid command.\n \`\`\`Correct format for reaction role should be as follows: ${prefix}reactionrole <messageID> <emoji> <@role> <#channel>\`\`\``
      );
      return;
    }
    var reactionSetup = {
      messageID: args[1],
      emoji: args[2],
      roleID: message.mentions.roles.first().id
    };
    reactionRoles.push(reactionSetup);
    fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
      if (err) return console.log(err);
    });
    message.channel.send("Reaction role setup.");
    message.mentions.channels
      .first()
      .messages.fetch(args[1])
      .then((m) => {
        m.react(args[2]);
      });
  } else if ([`kick`, `k`].find((k) => prefix + k == args[0])) {
    if (!message.member.hasPermission("KICK_MEMBERS")) {
      message.channel.send(
        `You require the \`\`\`KICK_MEMBERS\`\`\` permission`
      );
      return;
    }
    if (!message.mentions.users.first()) {
      message.channel.send(
        `The command syntax is: \`\`\`${prefix}kick <user> [reason]\`\`\``
      );
      return;
    }
    if (
      message.mentions.members.first().roles.highest.position >=
      message.member.roles.highest.position
    ) {
      message.channel.send(
        "The person you mentioned has the same or higher priviliges than you, so you cannot kick them."
      );
      return;
    }
    if (!message.mentions.members.first().kickable) {
      message.channel.send(
        "I cannot kick the person you mentioned.\n\nCheck the role hierarchy."
      );
      return;
    }
    var reason = args.slice(2).join(" ");
    if (reason === "") {
      reason = `${message.author.tag} ran the kick command.`;
    } else {
      reason = `${message.author.tag} used the kick command for ${reason}`;
    }
    try {
      message.mentions.members
        .first()
        .kick(reason)
        .then(() => {
          const embed = new Discord.MessageEmbed()
            .setAuthor("Successfully Kicked")
            .setTitle(
              `Kicked user \`\`\`${
                message.mentions.users.first().tag
              }\`\`\` for :\`\`\`${reason}\`\`\``
            )
            .setColor(colour)
            .setThumbnail(
              message.mentions.users.first().avatarURL({ dynamic: true })
            );
          message.channel.send(embed);
        });
    } catch (error) {
      message.channel.send(`An error has occurred.\n${error}/`);
    }
  } else if ([`ban`, `b`].find((k) => prefix + k == args[0])) {
    if (!message.member.hasPermission("BAN_MEMBERS")) {
      message.channel.send("You require the ```BAN_MEMBERS``` permission");
      return;
    }
    if (!message.mentions.users.first() && isNaN(args[1])) {
      message.channel.send(
        `The command syntax is: \`\`\`${prefix}ban <user> [reason]\`\`\``
      );
      return;
    }
    if (!message.mentions.users.first()) {
      var user = message.guild.members.cache.find((u) => u.id === args[1]);
      if (!user) return message.channel.send("Cannot find this user!");
    } else {
      var user = message.mentions.members.first();
    }
    if (user.roles.highest.position >= message.member.roles.highest.position) {
      message.channel.send(
        "The person you mentioned has the same or higher priviliges than you, so you cannot ban them."
      );
      return;
    }
    if (!user.bannable) {
      message.channel.send(
        "I cannot ban the person you mentioned.\n\nCheck the role hierarchy."
      );
      return;
    }
    var reason = args.slice(2).join(" ");
    if (reason === "") {
      reason = `${message.author.tag} ran the ban command.`;
    } else {
      reason = `${message.author.tag} used the ban command for ${reason}`;
    }
    try {
      user.ban(reason).then(() => {
        const embed = new Discord.MessageEmbed()
          .setAuthor("Successfully banned")
          .setTitle(
            `Banned user \`\`\`${
              message.mentions.users.first().tag
            }\`\`\` for :\`\`\`${reason}\`\`\``
          )
          .setColor(colour)
          .setThumbnail(
            message.mentions.users.first().avatarURL({ dynamic: true })
          );
        message.channel.send(embed);
      });
    } catch (error) {
      message.channel.send(`An error has occurred.\n${error}/`);
    }
  } else if ([`serverinfo`, `si`].find((k) => prefix + k == args[0])) {
    const embed = new Discord.MessageEmbed()
      .setColor(colour)
      .setAuthor(`${message.guild}'s Information`, message.guild.iconURL())
      .addField(`Member Count`, message.guild.memberCount, false)
      .addField(
        `Custom Emoji Count`,
        message.guild.emojis.cache.array().length,
        false
      )
      .addField(`Role Count`, message.guild.roles.cache.array().length, false)
      .addField(
        `Channel Count`,
        message.guild.channels.cache.array().length,
        true
      );
    message.channel.send(embed);
  } else if ([`animal`].find((k) => prefix + k == args[0])) {
    const animalImage = [
      { animal: "dog", api: "https://some-random-api.ml/img/dog" },
      { animal: "cat", api: "https://some-random-api.ml/img/cat" },
      { animal: "panda", api: "https://some-random-api.ml/img/panda" },
      { animal: "bird", api: "https://some-random-api.ml/img/birb" },
      { animal: "fox", api: "https://some-random-api.ml/img/fox" },
      { animal: "koala", api: "https://some-random-api.ml/img/koala" }
    ];
    const animalFact = [
      { animal: "dog", api: "https://some-random-api.ml/facts/dog" },
      { animal: "cat", api: "https://some-random-api.ml/facts/cat" },
      { animal: "panda", api: "https://some-random-api.ml/facts/panda" },
      { animal: "bird", api: "https://some-random-api.ml/facts/bird" },
      { animal: "fox", api: "https://some-random-api.ml/facts/fox" },
      { animal: "koala", api: "https://some-random-api.ml/facts/koala" }
    ];
    if (!args[1]) {
      var ranAn = Math.floor(Math.random() * animalImage.length);
      var animalImageUrl = animalImage[ranAn].api;
      var animalFactUrl = animalFact[ranAn].api;
    } else {
      var animalImageUrlr = animalImage.find((k) => k.animal === args[1]);
      var animalFactUrlr = animalFact.find((k) => k.animal === args[1]);
      if (!animalFactUrlr || !animalImageUrlr) {
        const embed = new Discord.MessageEmbed()
          .setColor(colour)
          .setAuthor(`Invalid animal`)
          .addField(`Valid animals:`, `Dog\nCat\nPanda\nBird\nFox\nKoala`);
        message.channel.send(embed);
        return null;
      }
      var animalFactUrl = animalFactUrlr.api;
      var animalImageUrl = animalImageUrlr.api;
    }
    var animalFacte = await fetch(animalFactUrl)
      .then((res) => res.json())
      .then((json) => {
        return json.fact;
      });
    var animalImagee = await fetch(animalImageUrl)
      .then((res) => res.json())
      .then((json) => {
        return json.link;
      });
    const embed = new Discord.MessageEmbed()
      .setColor(colour)
      .setTitle(animalFacte)
      .setImage(animalImagee);
    message.channel.send(embed);
  } else if ([`meme`].find((k) => prefix + k == args[0])) {
    fetch("https://meme-api.herokuapp.com/gimme")
      .then((res) => res.json())
      .then((json) => {
        if (json.nsfw === true)
          return message.channel.send(
            "Sorry, but that meme was flagged as nsfw. Please run the command again."
          );
        const memeembed = new Discord.MessageEmbed()
          .setTitle(json.title)
          .setURL(json.postLink)
          .setColor(colour)
          .setImage(json.url)
          .setFooter(`✍: ${json.author}       👍: ${json.ups}`);
        message.channel.send(memeembed);
      });
  } else if ([`prefix`].find((k) => prefix + k == args[0])) {
    if (!message.member.hasPermission("MANAGE_GUILD")) {
      message.channel.send("You require the ```MANAGE_GUILD``` permission");
      return;
    }
    if (!args[1]) {
      message.channel.send(
        `The command syntax is: \`\`\`${prefix}prefix <newPrefix>\`\`\``
      );
      return;
    }
    if (args[2]) {
      message.channel.send(
        `The command syntax is: \`\`\`${prefix}prefix <newPrefix>\`\`\`\nYou may only have one word as the prefix!`
      );
      return;
    }
    prefix = args[1];
    settings.prefix = args[1];
    fs.writeFile(
      "./serverSettings.json",
      JSON.stringify(settings),
      function () {
        1;
      }
    );
    const embed = new Discord.MessageEmbed()
      .setAuthor("Prefix Changed")
      .setTitle(`To ${args[1]}`)
      .setColor(colour);
    message.channel.send(embed);
  } else if (["8ball"].find((k) => prefix + k == args[0])) {
    var options = [
      "Maybe",
      "Yes Absolutely",
      "Perhaps",
      "Definitely",
      "Ask later",
      "No",
      "I do not know",
      "Absolutely not"
    ];
    var t = args.slice(1).join(" ");
    if (!t.split(" ")[0])
      return message.channel.send("No content provided to ask the 8ball");
    const embed = new Discord.MessageEmbed()
      .setColor(colour)
      .setAuthor(
        message.author.tag,
        message.author.avatarURL({ dynamic: true })
      )
      .setTitle(t)
      .setDescription(
        `:8ball: ${options[Math.floor(Math.random() * options.length)]}`
      );
    message.channel.send(embed);
  } else if (["ping", "latency"].find((k) => prefix + k == args[0])) {
    var m = await message.channel.send("Pinging...");
    var msgTime = message.createdTimestamp;
    var myTime = m.createdTimestamp;
    var ping = myTime - msgTime;
    m.edit("Ping is " + ping + "ms");
  } else if (["pokemon"].find((k) => prefix + k == args[0])) {
    if (!args[1])
      return message.channel.send("You need to provide a pokemon to lookup!");
    var a = args.slice(1).join(" ");
    fetch(`https://some-random-api.ml/pokedex?pokemon=${encodeURIComponent(a)}`)
      .then((res) => res.json())
      .then(async (json) => {
        if (!json.name)
          return message.channel.send("Cannot find that pokemon!");
        var pok = ``;
        json.type.forEach((e) => {
          pok = `${pok} ${e},`;
        });
        var spec = ``;
        json.species.forEach((f) => {
          spec = `${spec} ${f},`;
        });
        var ab = ``;
        json.abilities.forEach((s) => {
          ab = `${ab} ${s},`;
        });
        var bn = ``;
        json.family.evolutionLine.forEach((a) => {
          bn = `${bn}\n${a}`;
        });
        const embed = new Discord.MessageEmbed()
          .setTitle(json.name)
          .setThumbnail(json.sprites.animated)
          .setDescription(
            `**Types** - ${pok}\n**Species** - ${spec}\n**Abilities** - ${ab}\n**Height** - ${json.height}\n**Weight** - ${json.weight}\n**Evolution Line**${bn}`
          )
          .setColor(colour)
          .setFooter(json.description);
        message.channel.send(embed);
      });
  } else if (["joke"].find((k) => prefix + k == args[0])) {
    const loadingEmbed = new Discord.MessageEmbed()
      .setTitle("Loading...")
      .setColor(colour)
      .setAuthor(
        message.author.username,
        message.author.displayAvatarURL({ dynamic: true })
      );
    message.channel.send(loadingEmbed).then((m) => {
      fetch(
        "https://sv443.net/jokeapi/v2/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist"
      )
        .then((res) => res.json())
        .then((json) => {
          if (json.type === "single") {
            const jokeEmbed = new Discord.MessageEmbed()
              .setColor(colour)
              .setAuthor(
                message.author.username,
                message.author.displayAvatarURL({ dynamic: true })
              )
              .setTimestamp()
              .addField(`Joke:`, json.joke);
            m.edit(jokeEmbed);
          } else {
            const jokeEmbed = new Discord.MessageEmbed()
              .setColor(colour)
              .setAuthor(
                message.author.username,
                message.author.displayAvatarURL({ dynamic: true })
              )
              .setTimestamp()
              .addField(`Joke:`, json.setup)
              .addField(`Punchline:`, json.delivery);
            m.edit(jokeEmbed);
          }
        });
    });
  } else if (["fact"].find((k) => prefix + k == args[0])) {
    const loadingEmbed = new Discord.MessageEmbed()
      .setTitle("Loading...")
      .setColor(colour)
      .setAuthor(
        message.author.username,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp();
    message.channel.send(loadingEmbed).then((m) => {
      fetch("https://uselessfacts.jsph.pl/random.json?language=en")
        .then((res) => res.json())
        .then((json) => {
          const factEmbed = new Discord.MessageEmbed()
            .setColor(colour)
            .setAuthor(
              message.author.username,
              message.author.displayAvatarURL({ dynamic: true })
            )
            .setTimestamp()
            .setDescription(`**${json.text}**`)
            .setFooter(
              `🔗: ${json.source} | The owner of the bot does not fact check these.`
            )
            .setImage(json.image);
          m.edit(factEmbed);
        });
    });
  } else if (["riddle"].find((k) => prefix + k == args[0])) {
    const loadingEmbed = new Discord.MessageEmbed()
      .setTitle("Loading...")
      .setColor(colour)
      .setAuthor(
        message.author.username,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp();
    message.channel.send(loadingEmbed).then((m) => {
      fetch("https://www.no-api-key.com/api/v1/riddle")
        .then((res) => res.json())
        .then((json) => {
          const riddleEmbed = new Discord.MessageEmbed()
            .setColor(colour)
            .setAuthor(
              message.author.username,
              message.author.displayAvatarURL({ dynamic: true })
            )
            .setTimestamp()
            .setTitle("Riddle Time!")
            .setDescription(json.question)
            .addField(`Answer:`, `||${json.answer}||`);
          m.edit(riddleEmbed);
        });
    });
  } else if (["effect"].find((k) => prefix + k == args[0])) {
    var sources = [
      {
        effect: "blue",
        url: "https://api.no-api-key.com/api/v2/blueify?image="
      },
      {
        effect: "purple",
        url: "https://api.no-api-key.com/api/v2/purplify?image="
      },
      {
        effect: "inverted",
        url: "https://api.no-api-key.com/api/v2/invert?image="
      }
    ];
    if (!args[1]) {
      var selected = sources[Math.floor(Math.random() * sources.length)];
      const embed = new Discord.MessageEmbed()
        .setTitle(`Your profile picture but ${selected.effect}`)
        .setColor(colour)
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setTimestamp()
        .setImage(
          `${selected.url}${message.author.avatarURL({ format: "png" })}`
        );
      message.channel.send(embed);
      return;
    } else if (!sources.find((k) => k.effect == args[1])) {
      const embed = new Discord.MessageEmbed()
        .setColor(colour)
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setTitle(`Invalid Effect`)
        .setDescription(`**Valid Effects:**\nBlue\nPurple\nInverted`);
      message.channel.send(embed);
      return;
    } else {
      var selected = sources.find((k) => k.effect == args[1]);
      const embed = new Discord.MessageEmbed()
        .setTitle(`Your profile picture but ${selected.effect}`)
        .setColor(colour)
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setTimestamp()
        .setImage(
          `${selected.url}${message.author.avatarURL({ format: "png" })}`
        );
      message.channel.send(embed);
    }
  } else if (["avatar"].find((k) => prefix + k == args[0])) {
    if (!message.mentions.users.first()) {
      var user = message.author;
    } else {
      var user = message.mentions.users.first();
    }
    const embed = new Discord.MessageEmbed()
      .setColor(colour)
      .setImage(user.avatarURL({ dynamic: true }))
      .setAuthor(user.tag, user.avatarURL({ dynamic: true }))
      .setThumbnail(user.avatarURL({ dynamic: true }))
      .setFooter(user.tag, user.avatarURL({ dynamic: true }));
    message.channel.send(embed);
  }
});

client.on("messageReactionRemove", async (reaction, user) => {
  try {
    if (user.bot) return;
    // When we receive a reaction we check if the reaction is partial or not
    if (reaction.partial) {
      // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
      try {
        await reaction.fetch();
      } catch (error) {
        console.error(
          "Something went wrong when fetching the message: ",
          error
        );
        // Return as `reaction.message.author` may be undefined/null
        return;
      }
    }
    // Now the message has been cached and is fully available
    try {
      reactionRoles.forEach((react) => {
        console.log("CHECKING");
        if (reaction.message.id === react.messageID) {
          console.log("MESSAGE ID SAME AS STORED");
          if (reaction.emoji.name === react.emoji) {
            console.log("EMOJI SAME AS STORED");
            var person = client.users.resolve(user.id);
            var sender = reaction.message.guild.member(person);
            sender.roles.remove(react.roleID);
          }
        }
      });
    } catch (err) {
      1;
    }
  } catch {}
});

client.on("messageReactionAdd", async (reaction, user) => {
  try {
    if (user.bot) return;
    // When we receive a reaction we check if the reaction is partial or not
    if (reaction.partial) {
      // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
      try {
        await reaction.fetch();
      } catch (error) {
        console.error(
          "Something went wrong when fetching the message: ",
          error
        );
        // Return as `reaction.message.author` may be undefined/null
        return;
      }
    }
    // Now the message has been cached and is fully available
    try {
      reactionRoles.forEach((react) => {
        console.log("CHECKING");
        if (reaction.message.id === react.messageID) {
          console.log("MESSAGE ID SAME AS STORED");
          if (reaction.emoji.name === react.emoji) {
            console.log("EMOJI SAME AS STORED");
            var person = client.users.resolve(user.id);
            var sender = reaction.message.guild.member(person);
            sender.roles.add(react.roleID);
          }
        }
      });
    } catch (err) {
      1;
    }
  } catch {}
});

client.on("guildMemberAdd", async (member) => {
  var channel = member.guild.channels.cache.find(
    (k) => k.id == settings.welcomeChannel
  );
  const embed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setAuthor(member.user.tag, member.user.avatarURL({ dynamic: true }))
    .setTitle(member.guild.name)
    .setThumbnail(
      `https://cdn.discordapp.com/icons/${member.guild.id}/${member.guild.icon}`
    )
    .setDescription(
      `Welcome to the server ${member.user.tag}!\nThe total member count is now ${member.guild.memberCount}`
    )
    .setTimestamp();
  channel.send(embed);
});

client.on("guildMemberRemove", async (member) => {
  var channel = member.guild.channels.cache.find(
    (k) => k.id == settings.welcomeChannel
  );
  const embed = new Discord.MessageEmbed()
    .setColor("#ff0000")
    .setAuthor(member.user.tag, member.user.avatarURL({ dynamic: true }))
    .setTitle(member.guild.name)
    .setThumbnail(
      `https://cdn.discordapp.com/icons/${member.guild.id}/${member.guild.icon}.webp`
    )
    .setDescription(
      `${member.user.tag} has left the server :(\nThe total member count is now ${member.guild.memberCount}`
    )
    .setTimestamp();
  channel.send(embed);
});

//modmail from text channel
client.on("message", async (message) => {
  if (
    message.author.bot ||
    message.channel.type != "text" ||
    !modmails.mails.find((k) => k.channelID == message.channel.id) ||
    message.content.startsWith(prefix)
  )
    return;
  const embed = new Discord.MessageEmbed()
    .setColor(colour)
    .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
    .setTimestamp();
  if (message.content) {
    embed.setDescription(message.content);
  } else {
    embed.setDescription("No message provided, see attachments below.");
  }
  var user = await message.guild.members.fetch(
    `${
      message.channel.topic.split(" ")[
        message.channel.topic.split(" ").length - 1
      ]
    }`
  );
  user.send(embed);
  if (message.attachments.first()) {
    await user.send({ files: message.attachments.array() });
  }
});

//modmail from dm
client.on("message", async (message) => {
  if (message.author.bot || message.channel.type != "dm") return;
  if (!modmails.mails.find((k) => k.id == message.author.id)) {
    const yeBut = new disbut.MessageButton()
      .setStyle("green")
      .setLabel("Create New Thread")
      .setID(`createThread^${message.author.id}^${message.id}`);
    const noBut = new disbut.MessageButton()
      .setStyle("red")
      .setLabel("Don't Create New Thread")
      .setID(`dontCreateThread^${message.author.id}^${message.id}`);
    const embed = new Discord.MessageEmbed()
      .setColor(colour)
      .setAuthor(
        message.author.tag,
        message.author.avatarURL({ dynamic: true })
      )
      .setTitle("Create new Thread?");
    const row = new disbut.MessageActionRow().addComponents([yeBut, noBut]);
    var m = await message.channel.send({ embed: embed, components: [row] });
  } else {
    var guild = client.guilds.cache.find((k) => k.id == 859833614124449832);
    var channel = guild.channels.cache.find(
      (k) =>
        k.id == modmails.mails.find((l) => l.id == message.author.id).channelID
    );
    const embed = new Discord.MessageEmbed()
      .setColor(colour)
      .setAuthor(
        message.author.tag,
        message.author.avatarURL({ dynamic: true })
      )
      .setTimestamp()
      .setFooter(message.author.id);
    if (message.content) {
      embed.setDescription(message.content);
    } else {
      embed.setDescription("No message provided, see attachments below.");
    }
    await channel.send(embed);
    if (message.attachments.first()) {
      await channel.send({ files: message.attachments.array() });
    }
  }
});
try {
  client.on("clickButton", async (button) => {
    try {
      button.defer();
    } catch (err) {
      try {
        button.reply.defer();
      } catch (err) {
        console.log("CANNOT DEFER BUTTON");
      }
    }
    try {
      if (
        button.id.split("^")[0] == `createThread` &&
        button.id.split("^")[1] == `${button.clicker.user.id}` &&
        !modmails.mails.find((k) => k.id == button.id.split("^")[1])
      ) {
        button.message.channel.send(
          "Your modmail thread has been created, please send details of your reason for opening. Support will be with you soon"
        );
        createModmail(
          await button.message.channel.messages.fetch(button.id.split("^")[2])
        );
        button.message.delete();
        return;
      } else {
      }
    } catch (err) {}
  });
} catch (err) {}

async function createModmail(message) {
  var js = {
    id: message.author.id,
    number: modmails.cases + 1
  };
  var guild = client.guilds.cache.find((k) => k.id == 859833614124449832);
  var ch = await guild.channels.create(message.author.tag, {
    topic: `ModMail for ${message.author.tag} ${message.author.id}`,
    nsfw: false,
    parent: "863925484760465418",
    reason: `ModMail started for ${message.author.tag} ${message.author.id}`
  });
  js.channelID = ch.id;
  var channel = guild.channels.cache.find(
    (k) => k.id == settings.modmailChannel
  );
  const embed = new Discord.MessageEmbed()
    .setColor(colour)
    .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
    .setTitle("New ModMail Thread")
    .setDescription(
      `User ID: ${message.author.id}\nModMail Thread ID: ${modmails.cases}\nChannel: <#${ch.id}>`
    );
  if (message.content) {
    embed.addField("Opening Message", message.content);
  } else {
    embed.addField(
      "Opening Message",
      "No message provided, see attachments below."
    );
  }
  modmails.mails.push(js);
  modmails.cases++;
  fs.writeFile("./modmails.json", JSON.stringify(modmails), function () {
    1;
  });
  await channel.send(embed);
  await ch.send(embed);
  if (message.attachments.first()) {
    await channel.send({ files: message.attachments.array() });
    await ch.send({ files: message.attachments.array() });
  }
}
client.login(process.env.TOKEN)
