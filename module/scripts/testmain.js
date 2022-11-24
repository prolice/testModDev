import { registerHandlers } from './hooks/hooks.js';

class testModDev{
	constructor() {
        this.testModDev = new Map();
        this.TIMEOUT_INTERVAL = 50; // ms
        this.MAX_TIMEOUT = 1000; // ms
        // Random id to prevent collision with other modules;
        this.ID = randomID(24);
    }
	
	async init() {
		game.settings.register('testModDev', 'displayClassic', {
          name: 'Display progress classic progress bar ?'/*game.i18n.localize('SWFFG.flickering')*/,
          hint: 'If \'true\' then folder parameter below is useless.\n\'false\' to activate custom images'/*game.i18n.localize('SWFFG.flickeringHint')*/,
          scope: 'world',
          type: Boolean,
          default: true,
          config: true,
          onChange: () => {
              location.reload();
          },
        });
		
        game.settings.register('testModDev', 'pathToBarsImages', {
          name: 'Path to bars images'/*game.i18n.localize('SWFFG.flickering')*/,
          hint: 'The images must be in png with format : "vampire-health<x>.png"\nwhere \'x\' is percentage / 10 rounded\nExample: vampire-health8.png for 80%'/*game.i18n.localize('SWFFG.flickeringHint')*/,
          scope: 'world',
          type: String,
          filePicker: 'folder',
          default: '/modules/testModDev/images/bars',
          config: true,
          onChange: () => {
              location.reload();
          },
        });		
	}
}

Hooks.on("ready", () => {
    testModDev.singleton = new testModDev();
    testModDev.singleton.init();
});
registerHandlers();