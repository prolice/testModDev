class testModDev{
  constructor() {
    this._tooltips = [];
    //this._settingKeys = TTAConstants.SETTING_KEYS;
  }
  
   static getInstance() {
    if (!testModDev._instance) { testModDev._instance = new testModDev(); }
    return testModDev._instance;
  }
  
  _isAltPressed() {
    /*const after9 = versionAfter9();
    if (!after9) return keyboard?.isDown?.('Alt');*/
    console.log(game.keyboard.downKeys);
    return game?.keyboard?.downKeys?.has?.('AltLeft') || game?.keyboard?.downKeys?.has?.('AltRight');
  }
  
  // public hook when hovering over a token (more precise when a token is focused)
  async hoverToken(token, isHovering) {
      /*if (!token?.actor || !this._shouldActorHaveTooltip(token)) { return; }
      const isAltPressed = this._isAltPressed();
      if (isAltPressed) {
        const altSettings = this._getAltSettings();
        if (!altSettings.showOnAlt) { return; }
        const isTokenHidden = token?.data?.hidden;
        if (altSettings.showOnAlt && !altSettings.showAllOnAlt && isTokenHidden) { return; }
      }
      this[isHovering ? '_addTooltip' : '_removeTooltip'](token);
    }*/
    const isAltPressed = this._isAltPressed();
  }
}
export default testModDev.getInstance();