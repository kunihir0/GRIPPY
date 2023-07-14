import path from 'path';
import { envSchema, type JSONSchemaType } from 'env-schema';

interface Config {
	NODE_ENV: 'development' | 'testing' | 'production';
	DISCORD_TOKEN: string;
	DATABASE_URL_MONGOD: string;
	OWNERS: string;
}

const configSchema: JSONSchemaType<Config> = {
	type: 'object',
	required: ['NODE_ENV', 'DISCORD_TOKEN', 'DATABASE_URL_MONGOD', 'OWNERS'],
	properties: {
		NODE_ENV: {
			type: 'string',
			enum: ['development', 'testing', 'production']
		},
		DISCORD_TOKEN: { type: 'string' },
		DATABASE_URL_MONGOD: { type: 'string' },
		OWNERS: { type: 'string' }
	}
};

export class AppConfig {
	private static instance: AppConfig;
	public readonly NODE_ENV: Config['NODE_ENV'];
	public readonly DISCORD_TOKEN: Config['DISCORD_TOKEN'];
	public readonly DATABASE_URL_MONGOD: Config['DATABASE_URL_MONGOD'];
	public readonly OWNERS: Config['OWNERS'];

	private constructor() {
		const result = require('dotenv').config({
			path: path.join(__dirname, '..', '..', '.env')
		});

		if (result.error) {
			throw new Error(result.error);
		}

		const config = envSchema<Config>({
			data: result.parsed,
			schema: configSchema
		});

		this.NODE_ENV = config.NODE_ENV;
		this.DISCORD_TOKEN = config.DISCORD_TOKEN;
		this.DATABASE_URL_MONGOD = config.DATABASE_URL_MONGOD;
		this.OWNERS = config.OWNERS;
	}

	public static getInstance(): AppConfig {
		if (!AppConfig.instance) {
			AppConfig.instance = new AppConfig();
		}

		return AppConfig.instance;
	}
}
