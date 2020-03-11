const path = require("path");
const fs = require("fs");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

function resolve(dir) {
    return path.join(__dirname, "./", dir);
}
let projectName = "tripConfCenter";
// cdn预加载使用

// 是否使用gzip
const productionGzip = true;
// 需要gzip压缩的文件后缀
const productionGzipExtensions = ["js", "css"];
let prod =
    process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test";
module.exports = {
    publicPath: "", //prod ? projectName : "/",
    assetsDir: "static",
    productionSourceMap: false,
    chainWebpack: config => {
        config.resolve.alias
            .set("vue$", "vue/dist/vue.esm.js")
            .set("@", resolve("src"))
            .set("~", resolve("src/page"))
            .set("assets", resolve("src/assets"))
            .set("@commons", resolve("src/commons"))
            .set("@components", resolve("src/components"));
        // .set("@api", resolve("src/api"))
        // .set("@utils", resolve("src/utils"));


        config.externals({
            'vue': 'Vue',
            'element-ui': 'ElementUI',});
    },
    // node_modules依赖项es6语法未转换问题
    // transpileDependencies: ["vuex-persistedstate"],
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            config.optimization.minimizer[0].options.terserOptions.compress.warnings = false
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
            config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
          }

        const myConfig = {};
        if (prod) {
            myConfig.plugins = [];
            myConfig.optimization = {
                minimizer: [
                    new UglifyJsPlugin({
                        uglifyOptions: {
                            compress: {
                                // warnings: false,
                                drop_console: true, //console
                                drop_debugger: false,
                                pure_funcs: ["console.log"] //移除console
                            }
                        }
                    })
                ]
            };
            // 2. 构建时开启gzip，降低服务器压缩对CPU资源的占用，服务器也要相应开启gzip
            productionGzip &&
                myConfig.plugins.push(
                    new CompressionWebpackPlugin({
                        test: new RegExp(
                            "\\.(" + productionGzipExtensions.join("|") + ")$"
                        ),
                        threshold: 8192,
                        minRatio: 0.8
                    })
                );
        }
        if (process.env.NODE_ENV === "development") {
            /**
             * 关闭host check，方便使用ngrok之类的内网转发工具
             */
            myConfig.devServer = {
                disableHostCheck: true,
                // 端口
                port: 8080,
                // 是否开启https
                https: true
            };
        }
        return myConfig;
    },
    // close eslint
  lintOnSave:false,
  devServer: {
    open: true
  },

  css: {
    extract: false
  }
};