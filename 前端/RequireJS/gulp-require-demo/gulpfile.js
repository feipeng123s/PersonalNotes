var gulp = require('gulp');
var requirejsOptimize = require('gulp-requirejs-optimize');

gulp.task('scripts', function () {
    return gulp.src('main.js')
            .pipe(requirejsOptimize({

            }))
            .pipe(gulp.dest('dist'));
});

gulp.task('deps', function () {
    return gulp.src('build.js')
            .pipe(requirejsOptimize())
            .pipe(gulp.dest('dist/lib'));
});