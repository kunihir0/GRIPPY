import { Listener, LogLevel, type ContextMenuCommandSuccessPayload } from '@sapphire/framework';
import type { Logger } from '@sapphire/plugin-logger';
import { Utils } from '../../../lib/utils';

export class UserListener extends Listener {
	public run(payload: ContextMenuCommandSuccessPayload) {
		Utils.logSuccessCommand(payload);
	}

	public onLoad() {
		this.enabled = (this.container.logger as Logger).level <= LogLevel.Debug;
		return super.onLoad();
	}
}
