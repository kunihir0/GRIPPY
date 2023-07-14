import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import type { Guild } from 'discord.js';

@ApplyOptions<Listener.Options>({ enabled: true })
export class UserEvent extends Listener {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			once: true,
			event: 'guildDelete'
		});
	}

	public run(guild: Guild) {
		const { logger } = this.container;
		try {
			logger.info(`Guild Left: ${guild.name} (${guild.id})`);
		} catch (error) {
			logger.error(error);
		}
	}
}
