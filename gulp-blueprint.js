var gulp = require('gulp');
var batch = require('gulp-batch');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');
var ngRegister = require('gulp-ng-register');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var rimraf = require('rimraf');
var _ = require('lodash');

var defaults = {
    clean: 'public',
    assets: {
        src: [ 'assets/**/*', '!assets/sass{,/**}' ],
        dest: 'public'
    },
    vendor: {
        src: 'vendor/**/*',
        dest: 'public/vendor'
    },
    html: {
        src: 'app/client/**/*.html',
        dest: 'public/html'
    },
    sass: {
        src: 'assets/sass/**/*',
        dest: 'public'
    },
    js: {
        base: 'app/client',
        sourceFile: 'app.js',
        outputFile: 'app.min.js',
        dest: 'public'
    },
    watch: {
        files: [ 'assets/**/*', 'vendor/**/*', 'app/client/**/*' ],
        tasks: [ 'build' ]
    },
    register: {
        src: 'app/client/**/*.{controller,directive,service}.js',
        dest: 'app/client'
    }
};

module.exports = function(options){
    options = options || {};
    options = _.defaultsDeep(options, defaults);

    gulp.task('default', [ 'build' ]);
    gulp.task('build', [ 'clean', 'assets', 'vendor', 'html', 'sass', 'js' ]);

    gulp.task('clean', function(finished){
        rimraf(options.clean, finished);
    });

    gulp.task('assets', [ 'clean' ], function(){
        return copy(options.assets);
    });

    gulp.task('vendor', [ 'clean' ], function(){
        return copy(options.vendor);
    });

    gulp.task('html', [ 'clean' ], function(){
        return copy(options.html);
    });

    gulp.task('sass', [ 'clean' ], function(){
        return gulp.src(options.sass.src)
            .pipe(rename({ extname: '.min.css' }))
            .pipe(sourcemaps.init())
                .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(options.sass.dest));
    });

    gulp.task('js', [ 'clean', 'register' ], function(){
        return browserify(options.js.sourceFile, { debug: true, basedir: options.js.base })
            .transform(babelify)
            .bundle()
            .on('error', function(err){
                console.error(err.message);
            })
            .pipe(plumber())
            .pipe(source(options.js.outputFile))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
                .pipe(ngAnnotate())
                .pipe(uglify())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(options.js.dest));
    });

    gulp.task('watch', options.watch.tasks, function(){
        gulp.watch(options.watch.files, batch(function(events, done){
            gulp.start(options.watch.tasks, done);
        }));
    });

    gulp.task('register', [ 'clean' ], function(){
        return gulp.src(options.register.src)
            .pipe(ngRegister())
            .pipe(gulp.dest(options.register.dest));
    });
};

/* public */
/* private */

function copy(options){
    return gulp.src(options.src).pipe(gulp.dest(options.dest));
}
