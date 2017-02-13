const deepDiff = require('deep-diff').diff;

function isObject(val) {
  return val !== null && typeof val === 'object';
}

function accessor(val, prop) {
  return Array.isArray(val) && !isNaN(prop) ? parseInt(prop, 10) : prop;
}

function traverse(val, path) {
  if (!isObject(val)) {
    return [path];
  }

  return Object.keys(val).reduce((arr, key) => {
    return arr.concat(traverse(val[key], path.concat(accessor(val, key))));
  }, []);
}

function extract(difference) {
  if (difference.kind === 'D') {
    return traverse(difference.lhs, difference.path);
  }
  if (difference.kind === 'N') {
    return traverse(difference.rhs, difference.path);
  }
  return [difference.path];
}

module.exports = function diff(obj1, obj2, path) {
  const differences = deepDiff(obj1, obj2) || [];
  return differences.reduce((arr, difference) => arr.concat(extract(difference)), []);
};
