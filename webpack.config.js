const path = require('path');
const webpack = require("webpack");

module.exports = {
    entry: path.join(__dirname, '/src/index.ts'),
    mode: 'production',
    output: {
        filename: 'index.js',
        publicPath: '',
        path: path.join(__dirname, 'build'),
        libraryTarget: 'commonjs'   
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.svg$/,
                use: [
                  {
                    loader: 'svg-url-loader',
                    options: {
                      limit: 10000,
                    },
                  },
                ],
              },
              {
                test: /\.png$/,
                use: [
                  {
                    loader: 'file-loader',
                    options: {
                      limit: 10000,
                    },
                  },
                ],
              },
        
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
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
        }),
    ]
};