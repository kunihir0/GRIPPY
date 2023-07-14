import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import type { Guild } from 'discord.js';
import { prisma } from '../lib/utils';

@ApplyOptions<Listener.Options>({ enabled: true })
export class UserEvent extends Listener {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			once: true,
			event: 'guildCreate'
		});
	}

	public async run(guild: Guild) {
		const { logger } = this.container;
		try {
			logger.info(`Joined new guild: ${guild.name} (${guild.id})`);

			const existingGuild = await prisma.guild.findUnique({ where: { id: guild.id } });
			if (!existingGuild) {
				await prisma.guild.create({
					data: {
						id: guild.id,
						name: guild.name
					}
				});
				logger.info(`Created new guild record in database for guild ${guild.name} (${guild.id})`);
			}
		} catch (error) {
			logger.error(error);
		}
	}
}
