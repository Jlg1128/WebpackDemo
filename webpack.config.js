
const path = require('path');
const RemovePreviewModulePlugin = require('./removePreviewModulePlugin');
var webpack = require('webpack');
const TerserPlugin = require("terser-webpack-plugin");
const miniCssExtractPlugin = require('mini-css-extract-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const {argv} = require('yargs');
require('webpack-dev-server');

const sassModuleRegex = /\.(scss|sass)$/;
function getCSSLoaders({isEnvProduction, enableCssModules}) {
  const configScssPath = path.resolve(__dirname, './public/config.scss');
  return [
    isEnvProduction ? {
      loader: miniCssExtractPlugin.loader,
      options: {
        esModule: false,
      }
    } : {
      loader: 'style-loader',
      options: {
        esModule: false,
      }
    },
    // {
    //   loader: 'thread-loader',
    //   options: {
    //     workers: 2,

    //     // number of jobs a worker processes in parallel
    //     // defaults to 20
    //     workerParallelJobs: 50,

    //     // additional node.js arguments
    //     workerNodeArgs: ['--max-old-space-size=1024'],
  
    //     // Allow to respawn a dead worker pool
    //     // respawning slows down the entire compilation
    //     // and should be set to false for development
    //     poolRespawn: false,
  
    //     // timeout for killing the worker processes when idle
    //     // defaults to 500 (ms)
    //     // can be set to Infinity for watching builds to keep workers alive
    //     poolTimeout: 2000,
  
    //     // number of jobs the poll distributes to the workers
    //     // defaults to 200
    //     // decrease of less efficient but more fair distribution
    //     poolParallelJobs: 50,
  
    //     // name of the pool
    //     // can be used to create different pools with elsewise identical options
    //     name: 'my-pool',
    //   }
    // },
    {
      loader: 'css-loader',
      options: {
        importLoaders: 2,
        sourceMap: !isEnvProduction,
        url: false,
        import: false,
        modules: enableCssModules ? {
          mode: 'local',
          localIdentName: '[name]__[local]___[hash:base64:5]'
        } : false,
      }
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: !isEnvProduction,
        additionalData: '@use "_config.scss" as *;\n',
        sassOptions: {
          importer: [
            function (url) {
              if (url.includes('_config.scss')) {
                return {file: configScssPath};
              } else {
                return {file: url};
              }
            }
          ]
        },
        // implementation: require('sass-embedded'),
      }
    }
  ].filter(Boolean);
}
const isPreview = process.env.MODE === 'preview';

const useLayer = !!process.env.USELAYER;
console.log('预览模式', isPreview);
console.log('使用layer', useLayer);
console.log(process.env.NODE_ENV);
const swcOptions = {
  jsc: {
    parser: {
      syntax: 'ecmascript',
      jsx: false,
      dynamicImport: true,
      privateMethod: false,
      exportDefaultFrom: false,
      exportNamespaceFrom: false,
      preserveAllComments: false
    },
    loose: false,
  },
  env: {
    targets: {
      chrome: '75',
      safari: '14'
    },
  },
};

const jsLoaders = [
  {
    loader: 'swc-loader',
    options: swcOptions
  }
].filter(Boolean);


const previewOnDemandFiles = [
  'components/helper.js',
];

const isEnvProduction = false;
const PREVIEW_ONDEMAND_FILE_MATCH_REG = new RegExp(previewOnDemandFiles.map(item => `(${item})`).join('|'));
/**
 * @type {import('webpack').Configuration}
 */
const config = {
  output: {
    path: isEnvProduction ? path.resolve('dist') : path.resolve('public'),
    filename: '[name].js',
    chunkFilename: '[name].js',
  },
  mode: isEnvProduction ? 'production' : 'development',
  target: 'web',
  devtool: isEnvProduction ? false : 'source-map',
  cache: false,
  // cache: {
  //   type: 'filesystem',
  //   store: 'pack',
  //   cacheDirectory: path.resolve(__dirname, './node_modules/.cache/webpack'),
  //   memoryCacheUnaffected: true,
  // },
  entry: !useLayer ? isPreview ? {
    preview: {
      //   layer: 'preview',
        import: './preview.js',
      }
  } : {
    index: {
      // layer: 'other',
      import: './index.js',
    },
  } : {
    index: {
      import: './index.js',
    },
    preview: {
      layer: 'preview',
      import: './preview.js',
    }
  },
  resolve: {
    alias: {
      comp: path.resolve('components')
    },
  },
  resolveLoader: {
    alias: {
      'replace-loader-other': path.resolve(__dirname, './replace-loader-other.js'),
      'replace-loader-preview': path.resolve(__dirname, './replace-loader-preview.js'),
      'replace-buildentry-loader-preview': path.resolve(__dirname, './replace-buildentry-loader-preview.js'),
      'replace-buildentry-loader-other': path.resolve(__dirname, './replace-buildentry-loader-other.js'),
    }
  },
  plugins:[
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './public/index.html'
    }),
    // 设置环境变量信息
    // new webpack.DefinePlugin({
    //   'process.env.buildEntry': process.env.MODE === 'preview' ? '"preview"' : '"other"'
    // }),
    // new miniCssExtractPlugin({
    //   filename: 'css/' + '[name].css'
    // }),
    // new RemovePreviewModulePlugin({
    //   needRemoveModulePaths: ['modal.js'],
    // })
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /node_modules(\/|\\)monaco-editor/,
        use: jsLoaders,
      },
      {
        test: /\.js$/,
        include: PREVIEW_ONDEMAND_FILE_MATCH_REG,
        issuerLayer: 'preview',
        use: ['replace-buildentry-loader-preview']
        // oneOf: [
        //   {
        //     issuerLayer: 'preview',
        //     use: ['replace-buildentry-loader-preview']
        //   },
        //   {
        //     issuerLayer: 'other',
        //     use: ['replace-buildentry-loader-other']
        //   },
        // ],
      },
      {
        test: /\.css$/,
        include: /node_modules(\/|\\)monaco-editor/,
        use: ['style-loader', 'thread-loader', 'css-loader']
      }, 
      {
        test: /\.scss$/,
        use: getCSSLoaders({isEnvProduction: true, enableCssModules: false})
      },
      // {
      //   test: /worker\.js$/,
      //   use: {
      //     loader: 'worker-loader',
      //     options: {
      //       filename: `[name].js`,
      //     },
      //   },
      // }
    ]
  },
  optimization: {
    providedExports: true,
    usedExports: true,
    minimize: false,
    minimizer: [new TerserPlugin({
      parallel: true,
      minify: TerserPlugin.swcMinify,
      // `terserOptions` options will be passed to `swc` (`@swc/core`)
      // Link to options - https://swc.rs/docs/config-js-minify
      terserOptions: {
        compress: {
          pure_funcs: ['console.log'],
          unused: true
        },
        mangle: true
      },
    })],
  },
  experiments: {
    layers: true,
  },
  // devServer: {
  //   port: '8081',
  //   host: '127.0.0.1',
  //   clientLogLevel: 'info',
  // },
  optimization: {
    usedExports: true,
    // splitChunks: {
    //   cacheGroups: {
    //     asyncRouterScreen: {
    //       name: 'asyncRouterScreen',
    //       test: () => true,
    //       chunks: 'async',
    //       priority: 30,
    //       /**
    //        * @param {webpack.Module} module
    //        * @param {{chunkGraph: webpack.ChunkGraph, moduleGraph: webpack.ModuleGraph}} param
    //        */
    //       // (module, {chunkGraph, moduleGraph}) => {
    //       //   if (module.resource && module.resource.includes('webpackDemo/components/modal.js')) {
    //       //     const o = moduleGraph.getIncomingConnections(module);
    //       //     // console.log(o.size);
              
    //       //     // o.forEach(item => {
    //       //     //   console.log(item.originModule.resource);
    //       //     //   console.log(item.module.resource);
    //       //     // })
    //       //     // console.log(moduleGraph.getOutgoingConnections(module));
    //       //   }
    //       //   return true
    //       // },
    //     },
        
    //   },
    // },
    splitChunks: {
      cacheGroups: {
        // 异步路由包用asyncRouter开头
        asyncRouterScreen: {
          /**
           * 
           * @param {webpack.Module} module 
           * @param {webpack.Chunk[]} chunks 
           * @param {*} cacheGroupKey 
           * @returns 
           */
          name(module, chunks, cacheGroupKey) {
            debugger
            const moduleFileName = module
            .identifier()
            .split('/')
            .reduceRight((item) => item);
            console.log(chunks.map((item) => item.name));
            const allChunksNames = chunks.map((item) => item.name).join('~');
            console.log(allChunksNames);
            console.log(moduleFileName);
            
            return 'asyncRouterScreen';
          },
          // test: /** @param {webpack.Module} module */(module) => module.getChunks().find(chunk => (chunk.name || '').startsWith('async-router-screen')),
          test: () => {
            return true;
          },
          chunks: 'async',
          // minChunks: 1,
          maxAsyncRequests: 1,
          // minSize: 22020210301203120301,
        },
        // default: {
        //   chunks: 'all',
        //   minSize: 0,
        // }
      }
    }
  },
}

module.exports = config;