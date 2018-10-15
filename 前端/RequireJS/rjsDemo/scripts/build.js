({
    baseUrl: ".",
    // name: "main",
    // 一个包含多个对象的数组。每个对象代表一个将被优化的模块
    modules: [
        {
            name: 'main'
        }
    ],
    paths: {
        "jquery": "lib/jquery-3.3.1.min",
        // 'css': 'lib/css.min'
    },
    map: {
        '*': {
          'css': 'lib/css.min'
        }
    },
    // out: "../dist/main-built.js"
    // 输出目录
    dir: "../dist",
    // 是否从输出目录中删除已经被合并的文件
    removeCombined: true,
    // 优化器需要排除的文件，任何与此规则匹配的文件或文件夹都不会被复制到输出目录
    fileExclusionRegExp: /^(r|build)\.js$/,
    optimizeCss: 'standard', // [standard.keepLines.keepWhitespace]
})