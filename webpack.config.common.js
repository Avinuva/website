const glob = require("glob");
const path = require("path");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const PROJECT = (() => {
  let entries = {};
  let extract = [];
  glob.sync("./source/pages/*.html").forEach(template => {
    const name = path.basename(template, ".html");
    entries[name] = path.resolve(__dirname, template);
    extract.push(new ExtractTextPlugin(`${name}.html`));
  });
  return { entries, extract };
})();

module.exports = {
  stats: {
    colors: true
  },
  devtool: "source-map",
  entry: PROJECT.entries,
  output: {
    path: path.resolve(__dirname, "bundle"),
    filename: "assets/scripts/[name].js"
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]"
            }
          },
          { loader: "extract-loader" },
          {
            loader: "html-loader",
            options: {
              attrs: ["link:href", "script:src", "img:src"]
            }
          }
        ]
      },
      {
        test: /\.js$/,
        use: [
            "file-loader?name=assets/scripts/[name].js",
            "extract-loader",
            "babel-loader"
        ]
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          "file-loader?name=assets/styles/[name].css",
          "extract-loader",
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ]
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: "./source/static",
        to: ""
      }
    ])
  ]
};
