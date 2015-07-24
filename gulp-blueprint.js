var gulp = require('gulp');
var batch = require('gulp-batch');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');
var ngRegister = require('gulp-ng-register');
var ngTemplates = require('gulp-angular-templatecache');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var rimraf = require('rimraf');

module.exports = blueprint;

function blueprint(modify){
    var draft = nonElixirDraft();

    if(modify){
        modify(draft);

        if(draft.elixir){
            elixifyDraft(draft);
        }
    }

    register(draft);
}

function nonElixirDraft(){
    return {
        elixir: false,
        buildInto: 'public',
        assets: 'assets',
        vendor: 'vendor',
        app: 'app/client',
        templates: true
    };
}

function elixifyDraft(draft){
    draft.assets = 'resources/assets';
    draft.vendor = 'resources/vendor';
    draft.app = 'resources/assets/js';
}

function register(draft){
    registerElixir(draft);

    if(!draft.elixir){
        registerNonElixir(draft);
    }
}

function registerElixir(draft){
    var mix = draft.elixir;
    var cleanDependency = [];

    if(!draft.elixir){
        cleanDependency.push('clean');
    }

    gulp.task('index', cleanDependency, function(){
        return copy(draft.assets + '/index.html', draft.buildInto);
    });

    gulp.task('register', cleanDependency, function(){
        return gulp.src(draft.app + '/**/*.{controller,directive,service}.js')
            .pipe(ngRegister())
            .pipe(gulp.dest(draft.app));
    });

    if(draft.templates) {
        if(draft.elixir) {
            mix.task('templates', draft.app + '/**/*.html');
        }

        gulp.task('templates', cleanDependency, function () {
            return gulp.src(draft.app + '/**/*.html')
                .pipe(ngTemplates({standalone: true}))
                .pipe(gulp.dest(draft.buildInto));
        });
    }

    if(draft.elixir){
        mix.task('index', draft.assets + '/index.html');
        mix.task('register', draft.app + '/**/*.{controller,directive,service}.js');
        mix.sass('app.scss');
        mix.browserify('app.js');
    }
}

function registerNonElixir(draft){
    gulp.task('default', [ 'build' ]);

    var buildDependencies = [ 'clean', 'index', 'vendor', 'sass', 'js' ];

    if(!draft.templates){
        buildDependencies.push('html');
    }

    gulp.task('build', buildDependencies);

    gulp.task('clean', function(done){
        rimraf(draft.buildInto, done);
    });

    gulp.task('vendor', [ 'clean' ], function(){
        return copy(draft.vendor + '/**/*', draft.buildInto + '/vendor');
    });

    if(!draft.templates){
        gulp.task('html', [ 'clean' ], function(){
            return copy(draft.app + '/**/*.html', draft.buildInto + '/html');
        });
    }

    gulp.task('sass', [ 'clean' ], function(){
        return gulp.src(draft.assets + '/sass/**/*')
            .pipe(rename({ extname: '.min.css' }))
            .pipe(sourcemaps.init())
            .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(draft.buildInto));
    });

    var jsDependencies = [ 'clean', 'register' ];

    if(draft.templates){
        jsDependencies.push('templates');
    }

    gulp.task('js', jsDependencies, function(){
        return browserify('app.js', { debug: true, basedir: draft.app })
            .transform(babelify)
            .bundle()
            .on('error', function(err){
                console.error(err.message);
            })
            .pipe(plumber())
            .pipe(source('app.min.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(ngAnnotate())
            .pipe(uglify())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(draft.buildInto));
    });

    gulp.task('watch', [ 'build' ], function(){
        gulp.watch([ draft.assets + '/**/*', draft.vendor + '/**/*', draft.app + '/**/*' ], batch(function(events, done){
            events.on('end', function(){
                gulp.start([ 'build' ], done);
            });
        }));
    });
}

function copy(src, dest){
    return gulp.src(src).pipe(gulp.dest(dest));
}
