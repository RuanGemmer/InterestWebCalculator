// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = MiniCssExtractPlugin.loader;

const pages = [
    new HtmlWebpackPlugin({
        chunks: ["home"],
        template: "./src/index.html",
        filename: "./index.html",
        // Adicione a propriedade "minify" para minificar o HTML (opcional)
        minify: isProduction ? true : false,
        // Adicione a propriedade "inject" para controlar onde os scripts e estilos são inseridos
        inject: true,
        // Adicione a propriedade "chunks" para especificar quais chunks (arquivos JS) são usados nesta página
        chunks: ["home"],
    }),
    new HtmlWebpackPlugin({
        chunks: ["simple_interest"],
        template: "./src/simple_interest.html",
        filename: "./simple_interest.html",
        // Adicione a propriedade "minify" para minificar o HTML (opcional)
        minify: isProduction ? true : false,
        // Adicione a propriedade "inject" para controlar onde os scripts e estilos são inseridos
        inject: true,
        // Adicione a propriedade "chunks" para especificar quais chunks (arquivos JS) são usados nesta página
        chunks: ["simple_interest"],
    }),
];

const config = {
    entry: {
        main: ["./src/assets/js/main.js"],
        simple_interest: ["./src/assets/js/main.js"],
        // transforms: ["./assets/js/transforms.js"],
        // utils: ["./assets/js/utils.js"],
        // validation: ["./assets/js/validation.js"],
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
