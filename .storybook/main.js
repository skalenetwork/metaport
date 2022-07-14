const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
  stories: ["../src/components/**/*.stories.tsx"],
  // Add any Storybook addons you want here: https://storybook.js.org/addons/
  addons: [],
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.scss$/,
      use: ["style-loader", "css-loader", "sass-loader"],
      include: path.resolve(__dirname, "../")
    });
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve("babel-loader"),
      options: {
        presets: [["react-app", {
          flow: false,
          typescript: true
        }]]
      }
    });
    config.resolve.extensions.push(".ts", ".tsx");
    config.resolve.fallback = {
      path: require.resolve('path-browserify'),
      os: "os-browserify/browser",
      "fs": false,
      "https": require.resolve("https-browserify"),
      "http": require.resolve("stream-http"),
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer"),
      //...config.resolve.fallback,
    },
    config.plugins.push(new NodePolyfillPlugin())
    return config;
  },
  core: {
    builder: "webpack5"
  }
};
