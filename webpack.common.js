const path = require('path');
// const fs = require('fs');
const webpack = require('webpack');
// const Dotenv = require('dotenv-webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const makeVersion = () => {

  const d = new Date();
  
  return '"'+[
    d.getFullYear(), 
    (''+eval(d.getMonth()+1)).padStart(2,'0'),
    (''+eval(d.getDate())).padStart(2,'0')
  ].join('-')
  +'_'+
  [
    (''+d.getHours()).padStart(2,'0'),
    (''+d.getMinutes()).padStart(2,'0'),
    (''+d.getSeconds()).padStart(2,'0')].join(':')+'"';
};

const getEnvConf = env => {
  const envKeys = {
    'process.env.ENV': JSON.stringify(env),
    'process.env.VERSION': makeVersion()
  };

  return envKeys;
};

const getEntry = name => {
  const entry = {};
  entry[name] = './src/index.js';
  return entry;
};

const getOutput = (env, prodPath, prodPublicPath) => {
  switch (env) {
    case 'dev':
      return {
        path: path.join(__dirname, 'dist'),
        publicPath: 'http://localhost:8080/',
        filename: '[name].js',
        chunkFilename: '[name].js'
      };
    
    case 'prod':
      return {
        // path: prodPath,
        // publicPath: prodPublicPath,
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].js'
      };
    
    default:
      throw new Error("Unknown environment to get the output configuration.");
  }
};

const getLoaders = () => {
  return {
    rules: [
      { test: /\.(js|jsx)$/, exclude: /node_modules/, use: ['babel-loader'] },
      { test: /\.html$/, exclude: /src/, use: ["html-loader"] },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] }
    ]
  };
};

const getPlugins = env => {
  let plugins;
  switch (env) {
    case 'dev':
      plugins = [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin()
      ];
      break;
    case 'prod':
      plugins = [
        new ManifestPlugin(),
        new CleanWebpackPlugin({ verbose: true })
      ];
      break;
    default:
      throw new Error("Unknown environment to get plugins.");
  }

  const envKeys = getEnvConf(env);
  console.log("envKeys", envKeys);

  plugins = plugins.concat([
    new webpack.DefinePlugin(envKeys),
  ]);

  return plugins
};

const getResolvers = () => {
  return {
    extensions: ['*', '.js', '.jsx']
  };
};

const getDevServer = () => {
  return {
    port: 8080,
    contentBase: './dist',
      // contentBase: path.join(__dirname, 'wds-assets'),
    hot: true,
    disableHostCheck: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
      // "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      // "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
    // historyApiFallback: true,
    // watchOptions: { aggregateTimeout: 300, poll: 1000 },
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost',
    //     pathRewrite: {'^/api' : '/projectasks/v_3.0/frontend/main_app/backend/api'}
    //   }
    // }
  };
};

const getOptimization = () => {
  return {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  };

  // {
  //   runtimeChunk: 'single',
  //   splitChunks: {
  //     chunks: 'all',
  //     maxInitialRequests: Infinity,
  //     minSize: 0,
  //     cacheGroups: {
  //       vendor: {
  //         test: /[\\/]node_modules[\\/]/,
  //         name(module) {
  //           // get the name. E.g. node_modules/packageName/not/this/part.js
  //           // or node_modules/packageName
  //           const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

  //           // npm package names are URL-safe, but some servers don't like @ symbols
  //           return `npm.${packageName.replace('@', '')}`;
  //         },
  //       },
  //     },
  //   },
  // }
};

const getConfig = ({appName, env, prodPath = '', prodPublicPath = ''}) => {

  env = env.toLowerCase();

  return {
    entry: getEntry(appName),
    output: getOutput(env, prodPath, prodPublicPath),
    module: getLoaders(),
    plugins: getPlugins(env),
    resolve: getResolvers(),
    devServer: getDevServer(),
    optimization: getOptimization()
  }
};

module.exports = {getConfig, getEnvConf, getEntry, getOutput, getLoaders, getPlugins, getResolvers, getDevServer, getOptimization};
