import { join } from 'path';

export class Constants {
	static rootDir = join(__dirname, '..', '..');
	static srcDir = join(Constants.rootDir, 'src');
	static RandomLoadingMessage = ['Computing...', 'Thinking...', 'Cooking some food', 'Give me a moment', 'Loading...'];
}
