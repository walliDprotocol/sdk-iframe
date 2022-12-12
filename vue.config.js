const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  // configureWebpack: {
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
  // },
});
