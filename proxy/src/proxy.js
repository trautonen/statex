function accessor(val, prop) {
  return Array.isArray(val) && !isNaN(prop) ? parseInt(prop, 10) : prop;
}

function listener(beforeChange, afterChange, path) {
  return {
    set(obj, prop, value) {
      const propPath = path.concat(accessor(obj, prop));
      beforeChange(propPath, value);
      obj[prop] = proxy(value, beforeChange, afterChange, propPath);
      afterChange(propPath, value);
      return value;
    },
    get(obj, prop) {
      if (prop === '__isProxy') {
        return true;
      }
      return obj[prop];
    }
  };
}

function proxy(value, beforeChange, afterChange, path = []) {
  if (value !== null && typeof value === 'object' && !value.__isProxy) {
    for (const prop of Object.keys(value)) {
      value[prop] = proxy(value[prop], beforeChange, afterChange, path.concat(accessor(value, prop)));
    }
    return Array.isArray(value) ? value : new Proxy(value, listener(beforeChange, afterChange, path));
  }
  return value;
}

module.exports = function createProxy(value, beforeChange, afterChange) {
  return proxy(value, beforeChange, afterChange);
};
