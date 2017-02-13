const diff = require('@statex/diff');
const proxy = require('@statex/proxy');
const store = require('@statex/store');
const clone = require('lodash/cloneDeep');

module.exports = function createStore(options) {
  if (!options.diff) {
    options.diff = diff;
  }
  if (!options.proxy) {
    options.proxy = proxy;
  }
  if (!options.clone) {
    options.clone = clone;
  }
  return store(options);
};
