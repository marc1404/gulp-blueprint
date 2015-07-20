var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var babelify = require('babelify');
var plumber = require('gulp-plumber');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

module.exports = (sourceFile, outputFile, dest) => {
    return browserify(sourceFile, { debug: true })
        .transform(babelify)
        .bundle()
        .on('error', err => {
            console.error(err.message);
        })
        .pipe(plumber())
        .pipe(source(outputFile))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(ngAnnotate())
            .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dest));
};