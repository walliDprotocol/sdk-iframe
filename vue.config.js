const { defineConfig } = require("@vue/cli-service");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [new NodePolyfillPlugin()],
    //   module: {
    //     rules: [
    //       {
    //         test: /\.s[ac]ss$/i,
    //         use: [
    //           // Creates `style` nodes from JS strings
    //           // Translates CSS into CommonJS
    //           // Compiles Sass to CSS
    //           "sass-loader",
    //         ],
    //       },
    //     ],
    //   },
  },
});
