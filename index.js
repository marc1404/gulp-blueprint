var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var babelify = require('babelify');
var plumber = require('gulp-plumber');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var _ = require('lodash');
var defaultOptions = {
    buildTask: 'build',
    watchTask: 'watch',
    sourcePath: 'public/js',
    sourceFile: 'app.js',
    outputPath: 'public/js',
    outputFile: 'app.min.js',
    watchFiles: [ 'public/js/**/*.js', '!public/js/app.min.js' ]
};

module.exports = function(options){
    options = mergeDefaultOptions(options);

    gulp.task(options.buildTask, function(){
        build(options);
    });

    gulp.task(options.watchTask, function(){
        build(options);
        gulp.watch(options.watchFiles, [ options.buildTask ]);
    });
};

function build(options){
    browserify(options.sourcePath + '/' + options.sourceFile, { debug: true })
        .transform(babelify)
        .bundle()
        .on('error', function(err){
            console.error(err.message);
        })
        .pipe(plumber())
        .pipe(source(options.outputFile))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(ngAnnotate())
            .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(options.outputPath));
}

function mergeDefaultOptions(options){
    return _.merge(defaultOptions, options);
}