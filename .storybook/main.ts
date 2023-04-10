const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
import type { StorybookConfig } from "@storybook/react-webpack5";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  core: {
    builder: {
      name: '@storybook/builder-webpack5',
      options: {
        lazyCompilation: true,
      },
    }
  },
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  staticDirs: ["../build"],
  webpackFinal: async (config) => {

    if (config.resolve && config.resolve.alias) {
      const { global, ...alias } = config.resolve.alias
      // config.resolve.alias['global'] = undefined;
      // const { ...alias } = config.resolve.alias
      config.resolve.alias = alias
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
      config.module.rules.push({
        test: /\.(ts|tsx)$/,
        loader: require.resolve("babel-loader"),
        options: {
          presets: [["react-app", {
            flow: false,
            typescript: true,
            runtime: 'automatic'
          }]]
        }
      });
      config.module.rules.push({
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      });
    }
    if (config.plugins) {
      config.plugins.push(new NodePolyfillPlugin());
    }
    if (config.resolve && config.resolve.extensions) {
      config.resolve.extensions.push(".ts", ".tsx");
    }
    if (config.resolve && config.resolve.fallback) {
      config.resolve.fallback = {
        path: require.resolve('path-browserify'),
        os: "os-browserify/browser",
        "fs": false,
        "https": require.resolve("https-browserify"),
        "http": require.resolve("stream-http"),
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "buffer": require.resolve("buffer")
        //...config.resolve.fallback,
      };
    }
    return config;
  },
};
export default config;
