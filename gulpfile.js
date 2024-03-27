const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const tsify = require("tsify");
const uglify = require('gulp-uglify');

gulp.task('sass', () => {
  return gulp.src('src/index.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('index.min.css'))
    .pipe(gulp.dest('src/static'));
});

gulp.task('typescript', () => {
  return browserify({
    basedir: ".",
    debug: true,
    entries: ["src/index.ts"],
    cache: {},
    packageCache: {},
  }).plugin(tsify)
    .bundle()
    .pipe(source('index.min.js'))
    // .pipe(buffer())
    // .pipe(uglify())
    .pipe(gulp.dest('src/static'));
});

gulp.task('watch', () => {
  gulp.watch('./src/**/**/*.scss', gulp.series('sass'));
  gulp.watch('./src/**/**/*.ts', gulp.series('typescript'));
});

gulp.task('default', gulp.series('sass', 'typescript', 'watch'));