"use strict";
class testModDev {
	constructor() {
        this._tooltips = [];
		//
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