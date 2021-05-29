import Client from "./Client.ts";
import config from "./config.ts";
import Guild from "../src/entities/guild/Guild.ts";
import Message from "../src/entities/Message.ts";
import UserStatus from "../src/entities/UserStatus.ts";
import Activity from "../src/entities/Activity.ts";
import Logger from "../src/structs/Logger.ts";

const client = new Client({ token: config.token, logLevel: "DEBUG" });

await client.loadCommands();

client.on("ready", () => {
  Logger.info("Bot started!");

  setTimeout(() => {
    if (!client.me.presence?.game) {
      const status = new UserStatus({
        since: null,
        afk: false,
        game: new Activity({
          name: "Made with Cord",
          type: 0,
        }),
        status: "online",
      });
      client.gateway.updateStatus(status);
    }
  }, 3000);
});

client.on("guildCreated", (guild: Guild) => {
  Logger.info("Guild ->", guild.name);
});

client.on("message", (message: Message) => {
  if (message.author.bot || message.author.id === client.me.id) return;
  if (message.content.charAt(0) !== config.prefix) return;

  const split = message.content.split(/\s+/g);
  const commandName = split[0].slice(config.prefix.length);
  const args = split.slice(1);

  // get command object
  let command;
  if (client.commands[commandName]) {
    command = client.commands[commandName];
  } else if (client.aliases[commandName]) {
    const resolvedAlias = client.aliases[commandName];
    command = client.commands[resolvedAlias];
  } else {
    message.react(client, message, "🚫");
    return;
  }

  // run command
  command.run(client, message, args);
});

client.login();
