const path = require('path');
const webpack = require("webpack");


module.exports = {
  entry: path.join(__dirname, '/src/index.ts'),
  mode: 'production',
  output: {
    filename: 'index.js',
    // publicPath: '',
    path: path.join(__dirname, 'build'),
    library: {
      type: 'commonjs'
    },
    // chunkFilename: '[id].[chunkhash].js'
  },
  module: {
    rules: [
      // { test: /\.m?js$/, type: 'javascript/auto' },
      // { test: /\.m?js$/, resolve: { fullySpecified: false } },
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/, // excludes node_modules directory
        loader: require.resolve("babel-loader"),
        options: {
          presets: [["react-app", {
            flow: false,
            typescript: true
          }]]
        }
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        // include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 200000,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        sideEffects: true,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          }
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: 'style-loader',
            options: {
              esModule: false,
            },
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true
            }
          },
          "sass-loader",
        ],
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".css", ".scss"],
    fallback: {
      // make sure you `npm install path-browserify` to use this
      path: require.resolve('path-browserify'),
      os: "os-browserify/browser",
      "fs": false,
      "https": require.resolve("https-browserify"),
      "http": require.resolve("stream-http"),
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer")
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        default: false,
        vendors: false,
        // Merge all the chunks into one.
        single: {
          name: 'main',
          chunks: 'all',
          minChunks: 1,
          reuseExistingChunk: true,
          enforce: true
        }
      }
    },
    runtimeChunk: false
  }
};