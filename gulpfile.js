var gulp = require('gulp');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var umd = require('gulp-umd');

gulp.task('default', function() {
  gulp.src('src/**/*.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
      .pipe(babel())
      .pipe(umd())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['default'], function() {
  gulp.watch('src/**/*.js', ['default']);
});
