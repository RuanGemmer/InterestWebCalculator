const path = require("path");

module.exports = {
    entry: "./assets/js/main.js", // Arquivo de entrada
    output: {
        path: path.resolve(__dirname, "dist"), // Pasta de saída
        filename: "bundle.js", // Nome do arquivo de saída
    },
    mode: "production", // Modo de desenvolvimento ('development' ou 'production')
};
