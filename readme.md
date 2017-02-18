StateX
======

Simple and concise state management library for Node.js and browsers. Heavily inspired by
[VueX](https://github.com/vuejs/vuex).


### Development

StateX uses micromodule architecture where different logical parts of the library are provided
as scoped modules. This makes development experience a bit bad. NPM links help with this and the
root project provides an initialization script to set up everything for development.

Just run `npm init` in this root directory. The initialization script changes global node modules
directory to local `.npm-packages` and creates links for all submodules. The script also runs
install for all submodules so everything is ready after this.


### Todo

* proper build with ci
* ES6 codebase with packaging to ES6/ES5
* some tests
* code cleanup


### License

MIT
