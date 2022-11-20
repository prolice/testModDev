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
 * @type {{
 * hoverTokenHandler(): *,
 * }}
 */
 
 const hookHandlers = {
  hoverTokenHandler() {
    return addHookHandler('hoverToken', HOOK_TYPE.ON, testModDev.hoverToken.bind(testModDev));
  }
 };
 
 function registerHandlers() {
  Object.values(hookHandlers).forEach((handlers) => handlers());
}

export { registerHandlers };