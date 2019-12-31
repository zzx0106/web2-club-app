const config = {
    axios_config: {
        // 这里用了proxy代理接口请求
        // 可以在vue.config.js中修改
        // proxy方式不能在正式环境使用
        baseClientURL: '/api', // 客户端请求
        timeout: '5000', // 超时时间
        withCredentials: true, //是否携带cookie
    },
    webpack_config: {
        bundleView: true, // （仅production环境）是否开启压缩可视化
        // 压缩参数可以自行去vue.config.js添加
        imgMin: true, // （仅production环境）是否开启图片压缩功能。注：可能导致svg动画失效
        alias: {
            // 已存在 '@' => src
            // 该对象只允许存放src内部的文件，../会被替换为src
            components: '../components',
        },
        // 全局参数，会被作用至全局
        globalParams: {
            // 通过 process.env.VERSION 获得
            // 已存在 BASE_URL => /
            // 已存在 NODE_ENV => "production" || "development"
            VERSION: '1.0.0',
        },
    },
    height_config: {
        languages: {
            javascript: require('highlight.js/lib/languages/javascript'),
            dockerfile: require('highlight.js/lib/languages/dockerfile'),
            java: require('highlight.js/lib/languages/java'),
            sql: require('highlight.js/lib/languages/sql'),
            htmlbars: require('highlight.js/lib/languages/htmlbars'),
            'vbscript-html': require('highlight.js/lib/languages/vbscript-html'),
            xml: require('highlight.js/lib/languages/xml'),
            python: require('highlight.js/lib/languages/python'),
            scss: require('highlight.js/lib/languages/scss'),
            less: require('highlight.js/lib/languages/less'),
            css: require('highlight.js/lib/languages/css'),
            stylus: require('highlight.js/lib/languages/stylus'),
            php: require('highlight.js/lib/languages/php'),
            nginx: require('highlight.js/lib/languages/nginx'),
            http: require('highlight.js/lib/languages/http'),
            go: require('highlight.js/lib/languages/go'),
            dart: require('highlight.js/lib/languages/dart'),
            json: require('highlight.js/lib/languages/json'),
            kotlin: require('highlight.js/lib/languages/kotlin'),
        },
    },
};
module.exports = config;
// export default config;
