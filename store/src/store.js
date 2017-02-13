const createState = require('@statex/state');

function isFunction(val) {
  return val && typeof val === 'function';
}

function isPromise(val) {
  return val && isFunction(val.then);
}

function getNestedValue(obj, path) {
  const props = Array.isArray(path) ? path : path.split('.');
  return props.reduce((val, prop) => val[prop], obj);
}

function forwardSubscriptions(subscriptions, state, paths) {
  for (const subscription of subscriptions) {
    const match = paths.some(path => {
      return subscription.path.reduce((truth, segment, idx) => {
        return truth && segment === path[idx];
      }, true);
    });
    if (match) {
      subscription.handler(getNestedValue(state, subscription.path));
    }
  }
}

function createStore(options) {
  const {
    mutations = {},
    actions = {},
    diff
  } = options;

  let subscriptions = [];

  options.handler = (newState, oldState, changes) => {
    const differences = diff(oldState, newState);
    if (differences.length > 0) {
      forwardSubscriptions(subscriptions, newState, differences);
    }
  };

  const state = createState(options);

  function commit(type, payload) {
    const entry = mutations[type];
    entry(state.current(), payload);
  }

  function dispatch(type, payload) {
    const entry = actions[type];
    const context = {
      state: state.current(),
      commit: commit,
      dispatch: dispatch
    };
    const result = entry(context, payload);
    return isPromise(result) ? result : Promise.resolve(result);
  }

  function subscribe(path, handler) {
    if (subscriptions.findIndex(sub => sub.handler === handler) === -1) {
      subscriptions.push({
        path: Array.isArray(path) ? path : path.split('.'),
        handler: handler
      });
    }
    return () => {
      const idx = subscriptions.findIndex(sub => sub.handler === handler);
      if (idx !== -1) {
        subscriptions.splice(idx, 1)
      }
    }
  }

  return {
    commit,
    dispatch,
    subscribe
  }
}

module.exports = createStore;
