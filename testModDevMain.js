"use strict";
class testModDev {
	constructor() {
        this.testModDev = new Map();
        this.TIMEOUT_INTERVAL = 50; // ms
        this.MAX_TIMEOUT = 1000; // ms
        // Random id to prevent collision with other modules;
        this.ID = randomID(24);
    }
	
		
	async init() {
		Hooks.on('hoverToken', (token, isHovering) => {
			
			console.log(game.keyboard.downKeys);
			
		});
	}
}

Hooks.on("ready", () => {
    testModDev.singleton = new testModDev();
    testModDev.singleton.init();
});