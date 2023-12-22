const Dotenv = require('dotenv-webpack');

module.exports = {
    // ...otras configuraciones de Webpack
    /*resolve: {
        fallback: {
            path: require.resolve('path-browserify'),
            //os: require.resolve('os-browserify/browser'),
            os: false,
            crypto: require.resolve('crypto-browserify'),
        },*/
    resolve: {
        alias: {
            path: require.resolve('path-browserify'),
            os: require.resolve('os-browserify/browser'),
            crypto: require.resolve('crypto-browserify'),
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },

    plugins: [
        new Dotenv(),
        // ...otros plugins
    ],
};
