/* eslint-disable no-plusplus */
const fs = require('fs');

const path = require('path');
const bp = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');

let ID = 0;
// 首先我们要建立一个依赖表
// 我们创建一个接收一个路径的函数，读取他的内容并且获取他的依赖
function createAsset(fileName) {
  const content = fs.readFileSync(fileName, 'utf-8');

  const ast = bp.parse(content, { sourceType: 'module' });

  const dependencies = [];
  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value);
    },
  });

  const id = ID++;

  const { code } = babel.transformFromAstSync(ast, null, {
    presets: ['@babel/preset-env'],
  });
  return {
    id,
    fileName,
    dependencies,
    code,
  };
}

function createGraph(fileName) {
  const rootAsset = createAsset(fileName);

  const queue = [rootAsset];

  for (const asset of queue) {
    const dirname = path.dirname(asset.fileName);
    asset.mapping = {};
    asset.dependencies.forEach((value) => {
      const depFileName = path.resolve(dirname, `${value}.js`);
      const depAsset = createAsset(depFileName);
      queue.push(depAsset);
      asset.mapping[value] = depAsset.id;
    });
  }
  return queue;
}

function bundle(graph) {
  let modules = '';
  graph.forEach((mod) => {
    modules += `${mod.id}:[function(require,module, exports){
        ${mod.code}
    },
    ${JSON.stringify(mod.mapping)}],`;
  });
  const result = `(function(modules){
      function require(id){
        const [fn, mapping]=modules[id]
        function localRequire(name){
            return require(mapping[name])
        }
        const module={exports:{}}

        fn(localRequire, module, module.exports)
        return module.exports
      }
      require(0)
  })({${modules}})`;
  return result;
}
// {/a/js:10}
const graph = createGraph('./example/entry.js');
console.info(bundle(graph));
