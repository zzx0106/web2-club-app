const webpack = require('webpack');
const path = require('path');
const pageConfig = require('./src/config/config.js');
const UglifyjsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const isDev = process.env.NODE_ENV !== 'production';
const bundleView = pageConfig.webpack_config.bundleView ? [new BundleAnalyzerPlugin()] : [];
// vue inspect > config.js 生成配置到config.js 查看配置
let prodConfigureWebpack = {
    mode: 'production', //指定webpack的编译环境
    devtool: 'cheap-module-source-map', // 无法捕获错误位置，强压缩代码 prod
    optimization: {
        splitChunks: {
            chunks: 'all', // 必须三选一： "initial" | "all"(推荐) | "async" (默认就是async)
            minSize: 30000, // 最小尺寸，30000
            minChunks: 1, // 最小 chunk ，默认1
            maxAsyncRequests: 5, // 最大异步请求数， 默认5
            maxInitialRequests: 3, // 最大初始化请求书，默认3
            automaticNameDelimiter: '~', // 打包分隔符
            name: true, // 根据模块和缓存组秘钥自动生成
            cacheGroups: {
                // TODO vender 细化，下面有例子
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                },

                // vendor: {
                //     test(module) {
                //         let path = module.resource;
                //         if (!path) return true;
                //         path = path.replace(/\\/g, '/');
                //         let isNeed = path && /node_modules/.test(path) && /node_modules\/(?!muse)\n*/.test(path);
                //         // let isNeed = path && /node_modules/.test(path) && /node_modules\/(?!vuetify)/.test(path) && /node_modules\/(?!muse)\n*/.test(path);
                //         console.log('path', path, isNeed)
                //         if (!isNeed && path.indexOf('node_modules') > -1) {
                //             console.log('vendor not need::', path, isNeed);
                //         }
                //         return isNeed;
                //     },
                //     name: 'chunk-vendors',
                //     priority: 10,
                //     enforce: true,
                // },
                commons: {
                    chunks: 'initial',
                    minChunks: 2,
                    maxInitialRequests: 5, // The default limit is too small to showcase the effect
                    minSize: 0,
                    name: 'commons',
                },
            },
        },
        runtimeChunk: {
            name: (entrypoint) => `runtimechunk~${entrypoint.name}`,
        },
    },
    plugins: [
        // 骨架页生成功能
        // new PrerenderSpaPlugin(path.join(__dirname, 'dist'), ['/', '/products/1', '/products/2', '/products/3']),
        // 打包可视化
        ...bundleView,
    ],
};
let devConfigureWebpack = {
    mode: 'development', //指定webpack的编译环境
    devtool: 'source-map', // （默认）加快编译速度
    module: {},
};
const HtmlPluginConfig = {
    // cli3x中不能使用hash: 因为该方法会将app等js文件加上?[hash]
    // 但是内置 @vue/preload-webpack-plugin插件会将app等js通过link的方式提前引入页面
    // 导致同一个js和css等文件会被加载两次(一次不带hash一次带hash)
    // hash: true, //是否为所有注入的静态资源添加webpack每次编译产生的唯一hash值
    inject: true, // inject主要是设置将js和css文件插入在html的哪个位置，由于js的加载时同步进行的，所以它的位置对网页的加载速度是有影响的。inject共有四个可选项：true、body、head和false
    filename: 'index.html', //输出的文件名
    template: path.resolve(__dirname, './public/index.html'), //引入的模板
    showErrors: false, //是否将错误信息输出到html页面中
    minify: {
        //是否压缩html文件，为false则不压缩
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
    },
};
module.exports = {
    publicPath: './', // 提供rn访问
    outputDir: '../android/app/src/main/assets/webview/',
    lintOnSave: false, // 关闭eslint
    productionSourceMap: false, // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建
    css: {
        loaderOptions: {
            // 这里的选项会传递给对应-loader
            css: {
                // dev环境下开启sourceMap方便查找元素对应文件
                sourceMap: isDev,
            },
            sass: {
                sourceMap: isDev,
            },
            postcss: {
                sourceMap: isDev,
            },
        },
    },
    configureWebpack: {
        ...(isDev ? devConfigureWebpack : prodConfigureWebpack),
        // 注：此处配置无效
    },
    // chainWebpack: https://github.com/neutrinojs/webpack-chain#getting-started
    chainWebpack: (config) => {
        const webpackConfig = pageConfig.webpack_config;
        // css有关的loader不建议在这里修改，在loaderOptions中修改即可
        // alins配置，
        // 可以通过.get(key)获取、.set(key, value)设置、.delete(key)
        // config.resolve.alias.get('@')
        if (webpackConfig && webpackConfig.alias) {
            Object.keys(webpackConfig.alias).forEach((key) => {
                let value = webpackConfig.alias[key];
                value = path.resolve(__dirname, value.replace(/..\//, './src/'));
                config.resolve.alias.set(key, value);
            });
        }

        // extensions配置，
        // config.resolve.extensions.add(value).prepend(value).clear()

        // 图片压缩(仅 production环境)
        if (!isDev && webpackConfig && webpackConfig.imgMin) {
            config.module
                .rule('images')
                .use('image-webpack-loader')
                .loader('image-webpack-loader')
                .tap((options) => {
                    options = options || {};
                    options['mozjpeg'] = {
                        progressive: true,
                        quality: 75,
                    };
                    // optipng.enabled: false will disable optipng
                    options['optipng'] = {
                        enabled: false,
                    };
                    options['pngquant'] = {
                        quality: '75-90',
                        speed: 4,
                    };
                    options['gifsicle'] = {
                        interlaced: false,
                    };
                    // the webp option will enable WEBP
                    options['webp'] = {
                        quality: 75,
                    };
                    return options;
                });
        }
        // 修改全局配置
        if (webpackConfig && webpackConfig.globalParams) {
            config.plugin('define').tap((args) => {
                Object.keys(webpackConfig.globalParams).forEach((key) => {
                    let value = webpackConfig.globalParams[key];
                    if (value) args[0][`process.env.${key}`] = JSON.stringify(value);
                });
                return args;
            });
        }
        config.plugin('provide').use(webpack.ProvidePlugin, [
            {
                'window.Quill': 'quill/dist/quill.js',
                Quill: 'quill/dist/quill.js',
            },
        ]);
        if (!isDev) {
            // hashed
            // 该插件会根据模块的相对路径生成一个四位数的hash作为模块id
            config.plugin('hashed').use(webpack.HashedModuleIdsPlugin, [
                {
                    hashFunction: 'md5', //所使用的算法
                    hashDigest: 'base64', //在生成 hash 时使用的编码方式
                    hashDigestLength: 4, //散列摘要的前缀长度
                },
            ]);
            // Uglify
            config.plugin('uglify').use(UglifyjsPlugin, [
                {
                    exclude: /\.min\.js$/,
                    parallel: true, // 开启并行压缩，充分利用cpu
                    //压缩es6语法
                    uglifyOptions: {
                        compress: {
                            warnings: false,
                            comparisons: false,
                            // drop_debugger: true, //去除debug
                            // drop_console: true, //去除console.log
                        },
                        mangle: true,
                        output: {
                            comments: false,
                            ascii_only: true,
                        },
                    },
                    sourceMap: false,
                },
            ]);
            // 会将所有本地化内容和核心功能一起打包。你可使用 IgnorePlugin 在打包时忽略本地化内容:
            // ignore
            config.plugin('ignore').use(webpack.IgnorePlugin, [/^\.\/locale$/, /moment$/]);
        }

        // 修改原html plugin配置
        config.plugin('html').tap((args) => {
            const newTp = {
                ...args[0],
                ...HtmlPluginConfig,
            };
            args[0] = newTp;
            return args;
        });
    },
    devServer: {
        // 服务器代理，其实就是利用了服务端接口不存在跨域的原理
        proxy: {
            '/api': {
                target: 'https://cnodejs.org/api/v1',
                changeOrigin: true,
                pathRewrite: {
                    // 重写上方的/api地址
                    '^/api': '',
                },
            },
        },
    },
};
