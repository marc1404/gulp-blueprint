var gulp = require('gulp');
var watch = require('gulp-blueprint-watch');
var sass = require('gulp-blueprint-sass');
var babel = require('gulp-blueprint-babel');
var ngRegister = require('gulp-ng-register');
var ngTemplates = require('gulp-angular-templatecache');
var rimraf = require('rimraf');

module.exports = init;

function init(options){
    options = defaultOptions(options);

    registerTasks(options);
}

function defaultOptions(options){
    options = options || {};
    options.buildInto = options.buildInto || 'public';
    options.assets = options.assets || 'assets';
    options.vendor = options.vendor || 'vendor';
    options.app = options.app || 'app/client';
    options.templates = (typeof options.templates !== 'undefined') ? options.templates : true;
    options.proxy = options.proxy || 'localhost:8000';

    return options;
}

function registerTasks(options){
    gulp.task('default', [ 'build' ]);
    gulp.task('build', [ 'clean', 'html', 'vendor', 'sass', 'js' ]);
    copyTask('html', [ 'clean' ], options.assets + '/**/*.html', options.buildInto);
    copyTask('vendor', [ 'clean' ], options.vendor + '/**/*', options.buildInto + '/vendor');

    gulp.task('clean', function(done){
        rimraf(options.buildInto, done);
    });

    gulp.task('register', [ 'clean' ], function(){
        return gulp.src(options.app + '/**/*.{controller,directive,service}.js')
            .pipe(ngRegister())
            .pipe(gulp.dest(options.app));
    });

    gulp.task('templates', [ 'clean' ], function () {
        if(options.templates){
            return gulp.src(options.app + '/**/*.html')
                .pipe(ngTemplates({standalone: true}))
                .pipe(gulp.dest(options.buildInto));
        }else{
            return copy(options.app + '/**/*.html', options.buildInto);
        }
    });

    sass({
        gulp: gulp,
        task: 'sass',
        dependencies: [ 'clean' ],
        src: options.assets + '/sass/**/*',
        dest: options.buildInto
    });

    babel({
        gulp: gulp,
        task: 'js',
        dependencies: [ 'clean', 'register', 'templates' ],
        basedir: options.app
    });

    watch({
        gulp: gulp,
        task: 'watch',
        dependencies: [ 'build' ],
        watch: [ options.assets + '/**/*', options.vendor + '/**/*', options.app + '/**/*', '!' + options.app + '/register.js' ],
        start: 'build',
        proxy: options.proxy
    });
}

function copyTask(name, dependencies, src, dest){
    gulp.task(name, dependencies, function(){
       copy(src, dest);
    });
}

function copy(src, dest){
    return gulp.src(src).pipe(gulp.dest(dest));
}