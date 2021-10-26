(function (modules) {
  function require(id) {
    const [fn, mapping] = modules[id];
    function localRequire(name) {
      return require(mapping[name]);
    }
    const module = { exports: {} };

    fn(localRequire, module, module.exports);
    return module.exports;
  }
  require(0);
}({
  0: [function (require, module, exports) {
    const _message = _interopRequireDefault(require('./message'));

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    console.log(_message.default);
  },
  { './message': 1 }],
  1: [function (require, module, exports) {
    Object.defineProperty(exports, '__esModule', {
      value: true,
    });
    exports.default = void 0;

    const _name = _interopRequireDefault(require('./name'));

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    const _default = 'hello '.concat(_name.default);

    exports.default = _default;
  },
  { './name': 2 }],
  2: [function (require, module, exports) {
    Object.defineProperty(exports, '__esModule', {
      value: true,
    });
    exports.default = void 0;
    const _default = 'world';
    exports.default = _default;
  },
  {}],
}));
