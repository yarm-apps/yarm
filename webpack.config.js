const path = require('path');

var webpack = require('webpack');

module.exports = (env, argv) => {
    const VERSION = "custom";
    return {
        entry: './public/index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'bundle.js',
        },
        plugins: [new webpack.SourceMapDevToolPlugin({
            filename: "[file].map"
        })],
        mode: "development",
        devtool: "source-map",
        resolve: {
            // Add `.ts` and `.tsx` as a resolvable extension.
            extensions: [".ts", ".tsx", ".js"]
        },
        plugins: [
            /** Pass variables into modules */
            new webpack.DefinePlugin({
              VERSION: JSON.stringify(VERSION),
            }),
        ],
        module: {
            rules: [

                {
                    test: /\.ts$/,
                    use: [
                      {
                        loader: 'babel-loader',
                        options: {
                          cacheDirectory: true,
                        },
                      },
                      {
                        loader: 'ts-loader',
                      },
                    ],
                  },
                // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
                // {test: /\.tsx?$/, loader: "ts-loader" },
                {test: /\.(svg)$/, loader: 'raw-loader'},
                {
                    test: /\.(sass|less|css)$/,
                    loader: 'postcss-loader'
                  }
            ],
        }
    }
};