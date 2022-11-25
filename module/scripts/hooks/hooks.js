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
 * Logger()       : *, 
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
        static debug(...t) {
            if (CONFIG.debug.hooks)
              console.error("Hotbar Vampire  error |", ...t)
        }
    }
    
class HotbarVampire extends Hotbar {
  constructor(options) {
      Logger.debug("##### HotbarVampire CONSTRUCTOR #####");
      super(options);
      this.hp = 0;
      this.hpmax = 100;
      this.hpratio = ((this.hp / this.hpmax) * 100).toFixed(1);
      this.hpimgsuffixe = (this.hpratio / 10).toFixed(0);
      this.tokenname = "SELECT A CHARACTER";
      this.displayHealthImg = 'none';
      this.displayProgress = 'unset';
      this.displayVampireHUD = 'none';
      
      if (canvas.ready){
          this.pathToBarsImages= game.settings.get('testModDev', 'pathToBarsImages');
          this.displayClassic = game.settings.get('testModDev', 'displayClassic');
          if (!this.displayClassic){
             this.displayHealthImg = 'unset';
             this.displayProgress = 'none'; 
          }
      }
       
      if (!game.users.current.character) {return;}
      this.hp = HotbarVampire.getHealth().value;
      this.hpmax = HotbarVampire.getHealth().max;
      this.hpratio = ((this.hp / this.hpmax) * 100).toFixed(1);
      this.hpimgsuffixe = (this.hpratio / 10).toFixed(0);
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
    Logger.debug("##### GETDATA FUNCTION --> HTML HOTBAR UPDATING #####");
    this.macros = this._getMacrosByPage(this.page);
    return {
      page: this.page,
      macros: this.macros,
      barClass: this._collapsed ? "collapsed" : "",
      hp: this.hp,
      hpmax: this.hpmax,
      hpratio: this.hpratio,
      hpdoubleratio : (this.hpratio * 2),
      hpimgsuffixe : this.hpimgsuffixe,
      tokenname : this.tokenname,
      img: this.img,
      pathToBarsImages: this.pathToBarsImages,
      displayHealthImg: this.displayHealthImg,
      displayProgress :this.displayProgress,
      displayVampireHUD : this.displayVampireHUD,
      displayBackground : this.displayProgress == 'none' ? false : true
    };
  }
  static getBar1(t){
      return t?.document.getBarAttribute("bar1")? t?.document.getBarAttribute("bar1"):null;
  }
  static getHealth(){
      //Logger.debug("##### GETHEALTH FUNCTION #####");
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
    tokens = null;
    tokenname = "";
    bar1 = 0;
    bar1max = 0;
    bar1ratio = 0;
    bar1imgsuffixe = 0;
    object = null;
    html = null;
    img = null;
    pathToBarsImages= "";
    displayClassic = true;
    displayHealthImg = 'none';
    displayProgress = 'unset'; 
    displayVampireHUD = 'unset';
 
    constructor(t) {
            super(), this.user = t
        }
    async init(t) {
            this.user = t;
            //if (canvas.ready)
              //this.pathToBarsImages= this.pathToBarsImages= game.settings.get('testModDev', 'pathToBarsImages');
        }
    update(tokens = [], events) {
            //this.refresh_timeout && clearTimeout(this.refresh_timeout), this.refresh_timeout = setTimeout(this.updateHotbar(token)/*.bind(this)*/, 100)
            this.updateHotbar(tokens,events);
        }
    async updateHotbar(token,events) {
            
            this.displayVampireHUD = 'none';
                        
            
            if (!(this.tokens?.controlled.length === 0 && !events)){ 
              this.displayVampireHUD = 'unset';
              let t = this._getTargetToken(this.tokens?.controlled),
                  e = this.tokens?.controlled.length > 1 && !t;
              
              if (e){
                  this.displayVampireHUD = 'none';
                  //Hooks.callAll("renderHotbar",HotbarVampireObjects.object,HotbarVampireObjects.html);
                  //return;
              }
              else {
                this.tokenname = t?.document.name;
                this.displayProgress = t?.document.getBarAttribute("bar1")? 'unset':'none';
                let _getBar1 = HotbarVampire.getBar1(t);
                if (_getBar1)
                {
                  //let _getBar1 =   
                  this.bar1 = _getBar1.value;//t?.document.getBarAttribute("bar1").value;
                  this.bar1max = _getBar1.max;//t?.document.getBarAttribute("bar1").max;
                  this.bar1ratio = ((this.bar1 / this.bar1max) * 100).toFixed(1);
                }
        
                this.img = t?.document._actor.img;
              }
              
            }
            //renderHotbarHandler();
            //Logger.debug("##### [updateHotbar] CALLALL renderHotBar FUNCTION #####");
            //Hooks.callAll("renderHotbar",HotbarVampireObjects.object,HotbarVampireObjects.html);
            //this.render();
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
 * canvasReadyhandler():  *,
 * canvasInitHandler() :  *,  
 * updateTokenHandler():  *,
 * updateAcotrHandler():  *,
 * renderHotbarHandler(): *,
 * hoverTokenHandler():   *,
 * }}
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
        game.hotbarVampireData || (game.hotbarVampireData = new hotbarVampireData(), await game.hotbarVampireData.init(t))/*, Hooks.on("controlToken", ((t, e) => {
            game.hotbarVampireData.tokens = canvas.tokens;
            game.hotbarVampireData.update(t,e);
            Logger.debug("##### [updateHotbar] CALLALL renderHotBar FUNCTION #####");
            Hooks.callAll("renderHotbar",HotbarVampireObjects.object,HotbarVampireObjects.html);
        }))*/
      });
  },
  /* refreshHotBarHandlers() {
    ['updateToken', 'updateActor', 'deleteToken'].forEach((hook) => {
      Hooks.callAll("renderHotbar",HotbarVampireObjects.object,HotbarVampireObjects.html); 
    });*/
  controlTokenHandler(){
     return addHookHandler('controlToken', HOOK_TYPE.ON , async (t, e) =>{
            if (game.hotbarVampireData){
              game.hotbarVampireData.tokens = canvas.tokens ? canvas.tokens : null ;
              game.hotbarVampireData.update(t,e);
            }
            Logger.debug("##### [controlToken] CALLALL renderHotBar FUNCTION #####");
            await Hooks.callAll("renderHotbar",HotbarVampireObjects.object,HotbarVampireObjects.html);   
            ui.hotbar.render();            
      });   
  },
  /*canvasPanHandler(){
      return addHookHandler('canvasPan', HOOK_TYPE.ON , () => {
        Logger.debug("##### [canvasPan] CALLALL renderHotBar FUNCTION #####");
        Hooks.callAll("renderHotbar",HotbarVampireObjects.object,HotbarVampireObjects.html);   
      });
  },*/
  updateTokenHandler(){
      return addHookHandler('updateToken', HOOK_TYPE.ON , (t, e, i, s, a) => {
        Logger.debug("##### [updateToken] CALLALL renderHotBar FUNCTION #####");
        Hooks.callAll("renderHotbar",HotbarVampireObjects.object,HotbarVampireObjects.html);   
        ui.hotbar.render(); 
      });
  },
  drawTokenHandler(){
      return addHookHandler('drawToken', HOOK_TYPE.ON , (t) => {
        Logger.debug("##### [drawToken] CALLALL renderHotBar FUNCTION #####");
        Hooks.callAll("renderHotbar",HotbarVampireObjects.object,HotbarVampireObjects.html);   
        ui.hotbar.render(); 
      });
  },
  updateAcotrHandler(){
      return addHookHandler('updateActor', HOOK_TYPE.ON , (t) => {
        Logger.debug("##### [updateActor] CALLALL renderHotBar FUNCTION #####");
        game.hotbarVampireData.update(t);
        Hooks.callAll("renderHotbar",HotbarVampireObjects.object,HotbarVampireObjects.html);   
        ui.hotbar.render(); 
      });
  },
  renderHotbarHandler() {
    return addHookHandler('renderHotbar', HOOK_TYPE.ON, async (object, html) =>{

        if (!HotbarVampireObjects.init && object && html){
          HotbarVampireObjects.object = object;
          HotbarVampireObjects.html = html;
          HotbarVampireObjects.init = object && html;
        }

        if (canvas.ready){
            object.pathToBarsImages = game.settings.get('testModDev', 'pathToBarsImages');
            object.displayClassic = game.settings.get('testModDev', 'displayClassic');
            if (!object.displayClassic){
              object.displayHealthImg = 'unset';
              object.displayProgress = 'none'; 
            }
        }    
        
        object.hp = game.hotbarVampireData?.bar1;
        object.hpmax = game.hotbarVampireData?.bar1max;
        object.hpratio = ((object.hp/object.hpmax) *100).toFixed(1);
        object.hpimgsuffixe = (object.hpratio / 10).toFixed(0);
        
        object.tokenname = game.hotbarVampireData?.tokenname;
        object.img = game.hotbarVampireData?.img;//HotbarVampire.getPicture();
        
        object.displayVampireHUD = game.hotbarVampireData?.displayVampireHUD ? 'unset' : 'none';
        object.displayProgress =  game.hotbarVampireData?.displayProgress;
        
        Logger.debug("##### PREPARE TO CALL ! => GETDATA FUNCTION (HTML HOTBAR) UPDATING #####");
        Logger.debug("object.rendered ("+object.rendered+")");
      
    });
  },/*
  controlTokenHandler() {
      return addHookHandler('controlToken', HOOK_TYPE.ON, (tokens, events) => {
            game.hotbarVampireData.tokens = tokens;//canvas.tokens;
            game.hotbarVampireData.update(tokens,events);
    }
    ); 
  },*/
  /*hoverTokenHandler() {
    return addHookHandler('hoverToken', HOOK_TYPE.ON, (token, isHovering) => {
        Logger.debug("##### [hoverToken] CALLALL renderHotBar FUNCTION #####");
        Hooks.callAll("renderHotbar",HotbarVampireObjects.object,HotbarVampireObjects.html);  
    }
    );
  }*/
  
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