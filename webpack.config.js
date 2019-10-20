const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const createConfig = (env, argv) => {
  const config = {
    target: 'web',

    context: path.resolve(__dirname, 'src'),
    entry: {
      account: 'container/account',
      courier: 'container/courier',
      login: 'container/login',
      manage: 'container/manage',
      setup: 'container/setup',
      govapi: 'apiconfig',
      govcontext: 'govcontext',
      'gov-ui': 'index.js',
    },
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ['babel-loader', 'eslint-loader'],
        },
      ],
    },

    optimization: {
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: false,
        }),
      ],
    },

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      library: 'govui',
      libraryTarget: 'umd',
    },

    externals: [nodeExternals()],
  };

  return config;
};

module.exports = createConfig;
