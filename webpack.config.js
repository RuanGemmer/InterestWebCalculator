// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = MiniCssExtractPlugin.loader;

const pages = [
    new HtmlWebpackPlugin({
        chunks: ["index"],
        template: "./src/index.html",
        filename: "./index.html",
        minify: isProduction ? true : false,
        inject: true,
        chunks: ["index"],
    }),
    new HtmlWebpackPlugin({
        chunks: ["simple_interest"],
        template: "./src/simple_interest.html",
        filename: "./simple_interest.html",
        minify: isProduction ? true : false,
        inject: true,
        chunks: ["simple_interest"],
    }),
    new HtmlWebpackPlugin({
        chunks: ["cash_or_credit"],
        template: "./src/cash_or_credit.html",
        filename: "./cash_or_credit.html",
        minify: isProduction ? true : false,
        inject: true,
        chunks: ["cash_or_credit"],
    }),
    new HtmlWebpackPlugin({
        chunks: ["compound_interest"],
        template: "./src/compound_interest.html",
        filename: "./compound_interest.html",
        minify: isProduction ? true : false,
        inject: true,
        chunks: ["compound_interest"],
    }),
    new HtmlWebpackPlugin({
        chunks: ["total_buy"],
        template: "./src/total_buy.html",
        filename: "./total_buy.html",
        minify: isProduction ? true : false,
        inject: true,
        chunks: ["total_buy"],
    }),
];

const config = {
    entry: {
        index: ["./src/assets/js/main.js"],
        simple_interest: ["./src/assets/js/main.js"],
        total_buy: ["./src/assets/js/main.js"],
        compound_interest: ["./src/assets/js/main.js"],
        cash_or_credit: ["./src/assets/js/main.js"],
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "assets/js/[name].js",
        publicPath: "",
        assetModuleFilename: "assets/img/[name][ext]",
    },
    devServer: {
        contentBase: "./dist",
        historyApiFallback: true,
    },
    plugins: [
        ...pages,

        new MiniCssExtractPlugin({
            filename: "assets/css/[name].css", // Onde o CSS será salvo
        }),

        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: "babel-loader",
            },
            {
                test: /\.css$/i,
                use: [stylesHandler, "css-loader"],
            },
            // {
            //     test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
            //     type: "asset",
            // },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/i,
                loader: "file-loader",
                options: {
                    name: "[name].[ext]",
                    outputPath: "assets/img", // Caminho de saída das imagens
                    publicPath: "./", // Caminho público usado nos links das imagens no HTML
                },
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = "production";
    } else {
        config.mode = "development";
    }
    return config;
};
