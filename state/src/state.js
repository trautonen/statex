const nextTick = require('next-tick');

function isFunction(val) {
  return val && typeof val === 'function';
}

function createState(options = {}) {
  const {
    initial = {},
    maxHistory = 1,
    handler,
    proxy,
    clone
  } = options;

  if (!isFunction(handler)) {
    throw new Error('handler is not defined');
  }

  if (!isFunction(proxy)) {
    throw new Error('proxy is not defined');
  }

  if (!isFunction(clone)) {
    throw new Error('clone is not defined');
  }

  let states = [];
  let changes = [];
  let batching = null;

  function dispatch() {
    if (changes.length > 0) {
      handler(states[0], states[1], changes);
      changes = [];
    }
    batching = null;
  }

  function beforeChange(path) {
    if (!batching) {
      version();
      batching = nextTick(() => dispatch())
    }
    changes.push(path);
  }

  function afterChange() {
    // noop
  }

  function current() {
    return states[0];
  }

  function version() {
    if (states.length > maxHistory) {
      states.pop();
    }
    const state = current();
    const cloned = clone(state);
    states.splice(1, 0, cloned);
    return state;
  }

  function revert() {
    if (states.length > 1) {
      states.shift();
      states[0] = proxy(states[0], beforeChange, afterChange);
    }
    return current();
  }

  function init(state) {
    states.push(proxy(state, beforeChange, afterChange));
    return {
      current,
      version,
      revert
    };
  }

  const state = isFunction(initial) ? initial() : initial;
  return init(state);
}

module.exports = createState;
