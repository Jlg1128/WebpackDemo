
const path = require('path');
const RemovePreviewModulePlugin = require('./removePreviewModulePlugin');
var webpack = require('webpack');
const TerserPlugin = require("terser-webpack-plugin");
const miniCssExtractPlugin = require('mini-css-extract-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const {argv} = require('yargs');
const MyPlugin = require('./plugin');
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
  },
  {
    loader: 'replace-loader-other'
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
  // },
  entry: './index.js',
  resolve: {
    alias: {
      comp: path.resolve('components'),
    },
  },
  resolveLoader: {
    alias: {
      'replace-loader-other': path.resolve(__dirname, './replace-loader-other.js'),
      'replace-loader-preview': path.resolve(__dirname, './replace-loader-preview.js'),
      'replace-buildentry-loader-preview': path.resolve(__dirname, './replace-buildentry-loader-preview.js'),
      'replace-buildentry-loader-other': path.resolve(__dirname, './replace-buildentry-loader-other.js'),
      // 'pitch-loader': path.resolve(__dirname, './pitch-loader.js'),
      // 'ts-loader': path.resolve(__dirname, './ts-loader.js'),
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
    new miniCssExtractPlugin({
      filename: 'css/' + '[name].css'
    }),
    // new MyPlugin(),
    // new RemovePreviewModulePlugin({
    //   needRemoveModulePaths: ['modal.js'],
    // })
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules(\/|\\)monaco-editor/,
        use: jsLoaders,
      },
      // {
      //   test: /\.ts$/,
      //   use: ['pitch-loader'],
      // },
      {
        test: /\.css$/,
        include: /node_modules(\/|\\)monaco-editor/,
        use: ['style-loader', 'thread-loader', 'css-loader']
      }, 
      {
        test: /\.scss$/,
        use: getCSSLoaders({isEnvProduction, enableCssModules: false})
      },
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
  },
}

module.exports = config;