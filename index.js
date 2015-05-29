var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

module.exports = function(gulp){
    gulp.task('build', function(){
        browserify('public/js/app.js', { debug: true })
            .transform(babelify)
            .bundle()
            .on('error', function(err){
                console.error(err.message);
            })
            .pipe(source('bundle.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
                .pipe(ngAnnotate())
                .pipe(uglify())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('public/js'));
    });

    gulp.task('watch', function(){
        gulp.watch([ 'public/js/**/*.js', '!public/js/bundle*' ], [ 'build' ]);
    });
};