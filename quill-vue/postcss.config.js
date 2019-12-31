module.exports = {
    plugins: {
        'postcss-import': {},
        'postcss-url': {},
        'postcss-aspect-ratio-mini': {},
        'postcss-write-svg': {
            utf8: false,
        },
        autoprefixer: {},
        'postcss-preset-env': {},
        'postcss-px-to-viewport-opt': {
            viewportWidth: 750, // 设计稿宽度
            viewportHeight: 1334, // 设计稿高度，可以不指定
            unitPrecision: 3, // px to vw无法整除时，保留几位小数
            viewportUnit: 'vw', // 转换成vw单位
            selectorBlackList: [], // 不转换的类名
            minPixelValue: 1, // 小于1px不转换
            mediaQuery: false, // 允许媒体查询中转换
            exclude: /(\/|\\)(node_modules)(\/|\\)/, // 排除node_modules文件中第三方css文件
        },
        'postcss-viewport-units': {},
        cssnano: {
            preset: 'advanced',
            autoprefixer: false, // 和cssnext同样具有autoprefixer，保留一个
            'postcss-zindex': false,
        },
    },
};
