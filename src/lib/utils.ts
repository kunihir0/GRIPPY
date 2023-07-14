import type { ChatInputCommandSuccessPayload, Command, ContextMenuCommandSuccessPayload, MessageCommandSuccessPayload } from '@sapphire/framework';
import { container } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { cyan } from 'colorette';
import { EmbedBuilder, type APIUser, type Guild, type Message, type User } from 'discord.js';
import { Constants } from './constants';

export class Utils {
	/**
	 * Picks a random item from an array
	 * @param array The array to pick a random item from
	 * @example
	 * const randomEntry = Utils.pickRandom([1, 2, 3, 4]) // 1
	 */
	public static pickRandom<T>(array: readonly T[]): T {
		const { length } = array;
		return array[Math.floor(Math.random() * length)];
	}

	/**
	 * Sends a loading message to the current channel
	 * @param message The message data for which to send the loading message
	 */
	public static sendLoadingMessage(message: Message): Promise<typeof message> {
		return send(message, {
			embeds: [new EmbedBuilder().setDescription(Utils.pickRandom(Constants.RandomLoadingMessage)).setColor('#FF0000')]
		});
	}

	public static logSuccessCommand(payload: ContextMenuCommandSuccessPayload | ChatInputCommandSuccessPayload | MessageCommandSuccessPayload): void {
		let successLoggerData: ReturnType<typeof Utils.getSuccessLoggerData>;

		if ('interaction' in payload) {
			successLoggerData = Utils.getSuccessLoggerData(payload.interaction.guild, payload.interaction.user, payload.command);
		} else {
			successLoggerData = Utils.getSuccessLoggerData(payload.message.guild, payload.message.author, payload.command);
		}

		container.logger.debug(
			`${successLoggerData.shard} - ${successLoggerData.commandName} ${successLoggerData.author} ${successLoggerData.sentAt}`
		);
	}

	public static getSuccessLoggerData(guild: Guild | null, user: User, command: Command) {
		const shard = Utils.getShardInfo(guild?.shardId ?? 0);
		const commandName = Utils.getCommandInfo(command);
		const author = Utils.getAuthorInfo(user);
		const sentAt = Utils.getGuildInfo(guild);

		return { shard, commandName, author, sentAt };
	}

	private static getShardInfo(id: number) {
		return `[${cyan(id.toString())}]`;
	}

	private static getCommandInfo(command: Command) {
		return cyan(command.name);
	}

	private static getAuthorInfo(author: User | APIUser) {
		return `${author.username}[${cyan(author.id)}]`;
	}

	private static getGuildInfo(guild: Guild | null) {
		if (guild === null) return 'Direct Messages';
		return `${guild.name}[${cyan(guild.id)}]`;
	}
}
