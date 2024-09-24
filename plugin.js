const { Chunk } = require('webpack');

class MyPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('MyPlugin', (compilation) => {
      compilation.hooks.chunkIds.tap(
        'MyPlugin',
        /**
         * 
         * @param {Set<Chunk>} chunks 
         */
        (chunks) => {
          // chunks.forEach((chunk) => {
          //   console.log(chunk.getModules().map((module) => module._source));
          // })
        }
      );
    });
  }
}

module.exports = MyPlugin;
