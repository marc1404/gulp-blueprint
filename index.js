var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');

module.exports = function(gulp){
    gulp.task('build', function(){
        return gulp.src('public/js/**/*.js')
            .pipe(sourcemaps.init())
                .pipe(concat('bundle.js'))
                .pipe(babel())
                .pipe(ngAnnotate())
                .pipe(uglify())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('public/js'));
    });

    gulp.task('watch', function(){
        gulp.watch([ 'public/js/**/*.js', '!public/js/bundle*' ], [ 'build' ]);
    });
};