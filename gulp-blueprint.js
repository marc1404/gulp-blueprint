var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var babelify = require('babelify');
var plumber = require('gulp-plumber');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var rimraf = require('rimraf');

module.exports = {
    registerTasks,
    clean,
    assets,
    vendor,
    html,
    js
};

function registerTasks(gulp){
    gulp.task('default', [ 'build' ]);
    gulp.task('build', [ 'clean', 'assets', 'vendor', 'html', 'js' ]);

    gulp.task('clean', function(finished){
        clean(finished);
    });

    gulp.task('assets', [ 'clean' ], function(){
        return assets();
    });

    gulp.task('vendor', [ 'clean' ], function(){
        return vendor();
    });

    gulp.task('html', [ 'clean' ], function(){
        return html();
    });

    gulp.task('js', [ 'clean' ], function(){
        return js();
    });

    gulp.task('watch', [ 'build' ], function(){
        return watch();
    });
}

function clean(finished, folder){
    folder = folder || 'public';

    rimraf(folder, finished);
}

function assets(src, dest){
    src = src || 'assets/**/*';
    dest = dest || 'public';

    return copy(src, dest);
}

function vendor(src, dest){
    src = src || 'vendor/**/*';
    dest = dest || 'public/vendor';

    return copy(src, dest);
}

function html(src, dest){
    src = src || 'app/client/**/*.html';
    dest = dest || 'public/html';

    return copy(src, dest);
}

function js(sourceFile, outputFile, dest){
    sourceFile = sourceFile || 'app/client/app.js';
    outputFile = outputFile || 'app.min.js';
    dest = dest || 'public';

    return browserify(sourceFile, { debug: true })
        .transform(babelify)
        .bundle()
        .on('error', function(err){
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
}

function watch(files, tasks){
    files = files || [ 'assets/**/*', 'vendor/**/*', 'app/client/**/*' ];
    tasks = tasks || [ 'build' ];

    return gulp.watch(files, tasks);
}

/* public */
/* private */

function copy(src, dest){
    return gulp.src(src).pipe(gulp.dest(dest));
}