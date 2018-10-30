### Install

```shell
$ npm install gulp-requirejs-optimize
```

### Usage

```javascript
var gulp = require('gulp');
var requirejsOptimize = require('gulp-requirejs-optimize');
// 打包单个文件（模块）
gulp.task('scripts', function () {
	return gulp.src('src/main.js')
		.pipe(requirejsOptimize({
			optimize: 'none',
			insertRequire: ['foo/bar/bop'],
		}))
		.pipe(gulp.dest('dist'));
});
// 打包多个文件（模块）
gulp.task('scripts', function () {
	return gulp.src('src/modules/*.js')
		.pipe(requirejsOptimize())
		.pipe(gulp.dest('dist'));
});
```

### requirejsOptimize(options)

配置项option中除了没有`out`, `modules`和`dir`之外，其他与r.js相同

- `out`和`dir`用`gulp.dest()`代替
- `modules`用`gulp.src()`代替

[示例代码](./gulp-require-demo)