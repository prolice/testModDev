import testModDev from '../../testModDev.js';
/**
 * Adds a hook handler
 *
 * @param {string} hookId
 * @param {string} hookType
 * @param {Function} callback
 */
function addHookHandler(hookId, hookType, callback) {
  return Hooks[hookType](hookId, callback);
}

/**
 * @type {{ONCE: string, OFF: string, ON: string}}
 */
const HOOK_TYPE = {
  ONCE: 'once',
  ON: 'on',
  OFF: 'off',
};

/**
 * @class {{
 * HotbarVampire(): *,
 * }}
 */
 
class HotbarVampire extends Hotbar {
  constructor(options) {
      super(options);
      
      this.hp = 0;
      this.hpmax = 0;
      this.hpratio = 0;
  }
  
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.id = "hotbar";
    options.template = "modules/testModDev/templates/hud/hotbarVampire.html";
    options.popOut = false;
    return options;
  }
  
  getData(options={}) {
    this.macros = this._getMacrosByPage(this.page);
    return {
      page: this.page,
      macros: this.macros,
      barClass: this._collapsed ? "collapsed" : "",
      hp: this.hp,
      hpmax: this.hpmax,
      hpratio: this.hpratio
    };
  }
};

/**
 * @type {{
 * hoverTokenHandler(): *,
 * }}
 */
 
 const hookHandlers = {
     initHookHandler() {
    return addHookHandler('init', HOOK_TYPE.ONCE, async () => {
        CONFIG.debug.hooks = false;
        CONFIG.ui.hotbar = HotbarVampire;
    });
  },
  renderHotbarHandler() {
    return addHookHandler('renderHotbar', HOOK_TYPE.ON, async (object, html) =>{
        console.log("I AM IN");
        object.hp = 9;
        object.hpmax = 10;
        object.hpratio = (object.hp/object.hpmax)*100;
        object.render();
    });
  },
  hoverTokenHandler() {
    return addHookHandler('hoverToken', HOOK_TYPE.ON, testModDev.hoverToken.bind(testModDev));
  }
 };
 
 function registerHandlers() {
  Object.values(hookHandlers).forEach((handlers) => handlers());
}

export { registerHandlers };