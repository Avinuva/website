const webpack = require("webpack");
const merge = require("webpack-merge");
const common = require("./webpack.config.common");

module.exports = merge(common, {
  mode: "development",
  devServer: {
    contentBase: "source",
    watchContentBase: true,
    hot: true,
    port: process.env.PORT || 9000,
    host: process.env.HOST || "localhost"
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
});
