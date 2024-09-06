const { Module } = require('webpack');
const { Chunk } = require('webpack');
const { Compilation } = require('webpack');
const { Compiler } = require('webpack');
const path = require('path');

class RemovePreviewModulePlugin {
  constructor(options) {
    this.options = options;
  }

  /**
   * @param {Compiler} compiler 
   */
  apply(compiler) {
    const removePaths = this.options.needRemoveModulePaths.map(item => path.join(compiler.context, item));
    console.log('removePaths', removePaths);
    compiler.hooks.compilation.tap('RemovePreviewModulePlugin', 
      /**
        * @param {Compilation} compilation 
       */
      (compilation) => {
        compilation.hooks.processAssets.tap('RemovePreviewModulePlugin', 
          /**
            * @param {Set<Chunk>} chunks 
          */
          (chunks) => {
            // console.log(compilation.modules.forEach._source)
            // console.log(compilation.chunks);
            compilation.modules.forEach(module => {
              console.log(module.request);
            })
            // compilation.dependencyTemplates
            // compilation.modules.forEach(module => {
            //   console.log(module._source);
            // })
            // for (const module of modules) {
            //   const {dependencies} = module;
            //   dependencies.forEach(dependency => {
            //     const resource = compilation.moduleGraph.getModule(dependency).resource
            //     if (removePaths.includes(resource)) {
            //       console.log(1);
            //       // module.removeDependency(dependency);
            //     }
            //   })
            // }

            // console.log(compiler.options.context);
            // module.removeDependency(module.dependencies)
            // console.log(module.dependencies[0]);
            // if (module.dependencies.find(item => item))
            // module.removeDependency()
            // console.log(module.dependencies[0].request, module.dependencies[0]._loc, module.dependencies[0]._context);
            // console.log(path.join());
            // console.log(module.dependencies.length);
            // console.log(chunks);
            // chunks.forEach((chunk) => {
            //   console.log(chunk.getModules()[0].dependencies);
            // })

            // for (const chunk of chunks) {
              // chunk.getModules()[0].removeDependency(new )
              // for (const module of chunk.modulesIterable) {
              //   console.log(module.source());
                
              //   if (module._source && module._source._value === this.moduleContent) {
              //     module._source._value = ''; // Set module content to empty
              //   }
              // }
            // }
        })
    })
  }
}

module.exports = RemovePreviewModulePlugin;