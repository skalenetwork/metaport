
const path = require("path");
/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  staticDirs: ["../build"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    // "storybook-css-modules",
    // {
    //   name: '@storybook/addon-styling',
    //   options: {
    //     sass: {
    //       // Require your Sass preprocessor here
    //       implementation: require('sass'),
    //     },
    //   },
    // }
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  webpackFinal: async config => {
    if (config.resolve && config.resolve.alias) {
      const {
        global,
        ...alias
      } = config.resolve.alias;
      config.resolve.alias['browser'] = false;
      // const { ...alias } = config.resolve.alias
      config.resolve.alias = alias;
    }
    if (config.resolve && config.resolve.fallback) {
      config.resolve.fallback = {
        path: require.resolve('path-browserify'),
        os: "os-browserify/browser",
        "fs": false,
        "browser": false,
        "https": require.resolve("https-browserify"),
        "http": require.resolve("stream-http"),
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "buffer": require.resolve("buffer"),
        "constants": require.resolve("constants-browserify")
        //...config.resolve.fallback,
      };
    }
    if (config.module && config.module.rules) {
      config.module.rules.push({
        test: /\.scss$/,
        use: ["style-loader", {
          loader: 'css-loader',
          options: {
            modules: true,
            sourceMap: true,
            importLoaders: 2,
            esModule: false
          }
        }, "sass-loader"],
        include: path.resolve(__dirname, "../")
      });
    }

    return config;
  }
};
export default config;

