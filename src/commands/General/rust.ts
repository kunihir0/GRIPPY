import { ApplyOptions, RequiresClientPermissions } from '@sapphire/decorators';
import { Command, Args } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { PermissionFlagsBits } from 'discord.js';
import { type Message } from 'discord.js';

interface CraftingCost {
	[key: string]: {
		[key: string]: number;
	};
}

const craftingCosts: CraftingCost = {
	rocket: {
		pipes: 2,
		gunpowder: 150,
		explosives: 10
	}
};

@ApplyOptions<Command.Options>({
	description: 'Calculates the cost of crafting items in Rust'
})
export class UserCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options });
	}

	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('rust')
				.setDescription('Calculates the cost of crafting items in Rust')
				.addStringOption((option) => option.setName('item').setDescription('The name of the item to craft').setRequired(true))
				.addIntegerOption((option) => option.setName('quantity').setDescription('The number of items to craft').setRequired(false))
		);
	}

	@RequiresClientPermissions([PermissionFlagsBits.SendMessages])
	public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const itemName = interaction.options.getString('item');
		const quantity = interaction.options.getInteger('quantity') || 1;

		if (!itemName) return interaction.reply('Please provide an item name.');

		const item = craftingCosts[itemName.toLowerCase()];

		if (!item) return interaction.reply(`I'm sorry, I don't have information about ${itemName}.`);

		let response = `Crafting ${quantity} ${itemName}(s) will cost:\n`;

		for (const [material, cost] of Object.entries(item)) {
			response += `- ${cost * quantity} ${material}\n`;
		}

		return interaction.reply(response);
	}

	// Message command
	@RequiresClientPermissions([PermissionFlagsBits.SendMessages])
	public async messageRun(message: Message, args: Args) {
		const itemName = await args.pick('string').catch(() => null);
		const quantity = await args.pick('number').catch(() => 1);

		if (!itemName) return send(message, 'Please provide an item name.');

		const item = craftingCosts[itemName.toLowerCase()];

		if (!item) return send(message, `I'm sorry, I don't have information about ${itemName}.`);

		let response = `Crafting ${quantity} ${itemName}(s) will cost:\n`;

		for (const [material, cost] of Object.entries(item)) {
			response += `- ${cost * quantity} ${material}\n`;
		}

		return send(message, response);
	}
}
