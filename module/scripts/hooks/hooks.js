//import testModDev from '../../testModDev.js';
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

class HotbarVampireObjects{
    static object = null;
    static html = null;
    static init = false;
}
/**
 * @class {{
 * HotbarVampire(): *,
 * }}
 */
class Logger {
        static info(...t) {
            console.log("Hotbar Vampire info |", ...t)
        }
        static error(...t) {
            console.error("Hotbar Vampire  error |", ...t)
        }
    }
    
class HotbarVampire extends Hotbar {
  constructor(options) {
      super(options);
      this.hp = 0;
      this.hpmax = 100;
      this.hpratio = ((this.hp / this.hpmax) * 100).toFixed(1);
      this.tokenname = "VAMPIRE HUD";
      if (!game.users.current.character) {return;}
      this.hp = HotbarVampire.getHealth().value;
      this.hpmax = HotbarVampire.getHealth().max;
      this.hpratio = ((this.hp / this.hpmax) * 100).toFixed(1);
      this.tokenname = game.users.current.character?.prototypeToken.name;
      this.img = game.users.current.character?.img; 

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
      hpratio: this.hpratio,
      tokenname : this.tokenname,
      img: this.img
    };
  }
  
  static getHealth(){
      let hp = 0;
      let hpmax = 100;
      let hpmin = 0;
      switch (game.system.id){
          case 'dnd4e':
          case 'dnd5e':
          case 'pf1':
          case 'pf2e':
            return game.users.current.character?.prototypeToken.actor.system.attributes.hp;
          case 'starwarsffg':
            hp = game.users.current.character?.prototypeToken.actor.system.stats.wounds.value;
            hpmax = game.users.current.character?.prototypeToken.actor.system.stats.wounds.max;
            hpmin = game.users.current.character?.prototypeToken.actor.system.stats.wounds.min;
            hp = hpmax - hp;
            return {
                value: hp,
                max: hpmax,
                min: hpmin
            };
           case 'torgeternity': 
            hp = game.users.current.character?.prototypeToken.actor.system.wounds.value;
            hpmax = game.users.current.character?.prototypeToken.actor.system.wounds.max;
            hp = hpmax - hp;
            return {
                value: hp,
                max: hpmax
            };
          case 'cthack':
            return game.users.current.character?.prototypeToken.actor.system.hp;
          case 'wfrp4e':
            return game.users.current.character?.prototypeToken.actor.system.status.wounds;
          case 'alienrpg':
            return game.users.current.character?.prototypeToken.actor.system.header.health;
          case 'foundryvtt-reve-de-dragon':
            return game.users.current.character?.prototypeToken.actor.system.sante.vie;
          default:
            Logger.error("This system is not supported by this module");
            return game.users.current.character?.prototypeToken.actor.system.attributes.hp;
      }
        
  }
  
  static getPicture(){
      return game.users.current.character?.img;
  }
};

class hotbarVampireData extends Application {
    refresh_timeout = null;
    tokenname = "";
    hp = 0;
    hpmax = 0;
    hpratio = 0;
    object = null;
    html = null;
    img = null;
    constructor(t) {
            super(), this.user = t
        }
    async init(t) {
            this.user = t;
        }
    update() {
            this.refresh_timeout && clearTimeout(this.refresh_timeout), this.refresh_timeout = setTimeout(this.updateHotbar.bind(this), 100)
        }
    async updateHotbar() {
            //Logger.info("Updating Hotbar");
            //HotbarVampireObjects.object = this;
            let t = this._getTargetToken(this.tokens?.controlled),
                e = this.tokens?.controlled.length > 1 && !t;
            this.tokenname = t?.document.name;
            this.hp = t?.document._actor.system.hp;
            this.img = t?.document._actor.img;
            //renderHotbarHandler();
            Hooks.callAll("renderHotbar",HotbarVampireObjects.object,HotbarVampireObjects.html);
        }
    _getTargetToken(t = []) {
            if (t.length > 1) return null;
            if (0 === t.length && canvas.tokens?.placeables && game.user.character) {
                //if (!get("alwaysShowHud")) return null;
                let t = game.user.character,
                    e = canvas?.tokens?.placeables.find((e => e.actor?.id === t?.id));
                return e || null
            }
            let e = t[0];
            return e && this._userHasPermission(e) ? e : null
        }
        _userHasPermission(t = "") {
            let e = t.actor,
                i = game.user;
            return game.user.isGM || e?.testUserPermission(i, "OWNER")
        }
};
/**
 * @type {{
 * hoverTokenHandler(): *,
 * }}
 */
 /*
 Hooks.on("updateToken", ((t, e, i, s, a) => {
            i.hasOwnProperty("y") || i.hasOwnProperty("x") || game.tokenActionHUD.validTokenChange(e) && game.tokenActionHUD.update()
        }))
 */
 const hookHandlers = {
     initHookHandler() {
    return addHookHandler('init', HOOK_TYPE.ONCE, async () => {
        CONFIG.debug.hooks = false;
        CONFIG.ui.hotbar = HotbarVampire;
    });
  },
  canvasReadyhandler() {
      return addHookHandler ('canvasReady',HOOK_TYPE.ON, async () => {
        let t = game.user;
        if (!t) throw new Error("Hotbar Vampire | No user found.");
        game.hotbarVampireData || (game.hotbarVampireData = new hotbarVampireData(), await game.hotbarVampireData.init(t)), Hooks.on("controlToken", ((t, e) => {
            game.hotbarVampireData.update()
        }))
      });
  },
  updateTokenHandler(){
      return addHookHandler('updateToken', HOOK_TYPE.ON , (t, e, i, s, a) => {
        
        Hooks.callAll("renderHotbar",HotbarVampireObjects.object,HotbarVampireObjects.html);   
      });
  },
  updateAcotrHandler(){
      return addHookHandler('updateActor', HOOK_TYPE.ON , (t) => {
        
        Hooks.callAll("renderHotbar",HotbarVampireObjects.object,HotbarVampireObjects.html);   
      });
  },
  renderHotbarHandler() {
    return addHookHandler('renderHotbar', HOOK_TYPE.ON, async (object, html) =>{
        //console.log("I AM IN");
        /*if (game.HotbarVampire){
          if (!game.HotbarVampire?.object && object)
              game.HotbarVampire.object = object;
          if (!game.HotbarVampire?.html && html)
            game.HotbarVampire.html = html;
        }*/
        if (!HotbarVampireObjects.init && object && html){
          HotbarVampireObjects.object = object;
          HotbarVampireObjects.html = html;
          HotbarVampireObjects.init = object && html;
        }
        
        if (!game.users.current.character || !object) {
            object.hp = 0;
            object.hpmax = 100;
            object.hpratio = 0;
            object.tokenname = "CHOOSE AN ACTOR";
            object.img = "";
            object.render();
            return;
        }
        object.hp = HotbarVampire.getHealth().value;
        object.hpmax = HotbarVampire.getHealth().max;
        object.hpratio = ((object.hp/object.hpmax) *100).toFixed(1);
        //object.tokenname = game.users.current.character?.prototypeToken.name;
        object.tokenname = game.hotbarVampireData?.tokenname;
        object.img = HotbarVampire.getPicture();
        object.render();
    });
  },
  hoverTokenHandler() {
    return addHookHandler('hoverToken', HOOK_TYPE.ON, (token, isHovering) => {
        Hooks.callAll("renderHotbar",HotbarVampireObjects.object,HotbarVampireObjects.html); 
    }/*testModDev.hoverToken.bind(testModDev)*/
    );
  }
  
  /*Hooks.on("canvasReady", (async () => {
        let t = game.user;
        if (!t) throw new Error("Token Action HUD | No user found.");
        game.hotbarVampireData || (game.hotbarVampireData = new hotbarVampireData(l), await game.hotbarVampireData.init(t)), Hooks.on("controlToken", ((t, e) => {
            game.hotbarVampireData.update()
  }))}*/
 };
 
 function registerHandlers() {
  Object.values(hookHandlers).forEach((handlers) => handlers());
}

export { registerHandlers };