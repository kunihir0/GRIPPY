import './lib/setup';
import { LogLevel, SapphireClient } from '@sapphire/framework';
import { GatewayIntentBits, Partials } from 'discord.js';
import { AppConfig } from './config';

const config = AppConfig.getInstance();

class MyBot extends SapphireClient {
	constructor() {
		super({
			defaultPrefix: '!',
			regexPrefix: /^(hey +)?bot[,! ]/i,
			caseInsensitiveCommands: true,
			logger: {
				level: LogLevel.Debug
			},
			shards: 'auto',
			intents: [
				GatewayIntentBits.DirectMessageReactions,
				GatewayIntentBits.DirectMessages,
				GatewayIntentBits.GuildModeration,
				GatewayIntentBits.GuildEmojisAndStickers,
				GatewayIntentBits.GuildVoiceStates,
				GatewayIntentBits.GuildMessageReactions,

				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.Guilds,
				GatewayIntentBits.MessageContent
			],
			partials: [Partials.Channel],
			loadMessageCommandListeners: true
		});
	}

	async start() {
		try {
			this.logger.info('Logging in');
			await this.login(config.DISCORD_TOKEN);
			this.logger.info('logged in');
		} catch (error) {
			this.logger.fatal(error);
			this.destroy();
			process.exit(1);
		}
	}
}

const client = new MyBot();
client.start();
