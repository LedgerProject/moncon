const path = require("path");
const Dotenv = require("dotenv-webpack");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: ["@babel/polyfill", "./moncon.js"],
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "moncon.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: { presets: [["@babel/preset-env"]] },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new Dotenv(),
    new CopyPlugin({
      patterns: [
        { from: "moncon.css" },
        { from: "images", to: "images" },
        { from: "fonts", to: "fonts" },
      ],
    }),
  ],
  devServer: {
    port: 5000,
    //https: true,
    host: "0.0.0.0",
    disableHostCheck: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
  },
};
