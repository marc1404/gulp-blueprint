var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var babelify = require('babelify');
var plumber = require('gulp-plumber');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

module.exports = function(options){
    options = options || {};
    var buildTask = options.buildTask || 'build';
    var watchTask = options.watchTask || 'watch';
    var _watchTask = '_' + watchTask;
    var sourcePath = options.sourcePath || 'client/js';
    var sourceFile = options.sourceFile || 'app';
    var outputPath = options.outputPath || 'client/dist';
    var outputFile = options.outputFile || sourceFile;
    var watchedFiles = options.watchedFiles || [ sourcePath + '/**/*.js', '!' + outputPath + '/' + outputFile + '*' ];

    gulp.task(buildTask, function(){
        browserify(sourcePath + '/' + sourceFile + '.js' , { debug: true })
            .transform(babelify)
            .bundle()
                .on('error', function(err){
                    console.error(err.message);
                })
            .pipe(plumber())
            .pipe(source(outputFile + '.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
                .pipe(ngAnnotate())
                .pipe(uglify())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(outputPath));
    });

    gulp.task(watchTask, [ buildTask, _watchTask ]);

    gulp.task(_watchTask, function(){
        gulp.watch(watchedFiles, [ buildTask ]);
    });
};