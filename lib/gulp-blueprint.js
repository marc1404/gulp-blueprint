var gulp = require('gulp');
var watch = require('gulp-blueprint-watch');
var sass = require('gulp-blueprint-sass');
var babel = require('gulp-blueprint-babel');
var ngRegister = require('gulp-ng-register');
var ngTemplates = require('gulp-angular-templatecache');
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

    gulp.task('register', cleanDependency, function(){
        return gulp.src(draft.app + '/**/*.{controller,directive,service}.js')
            .pipe(ngRegister())
            .pipe(gulp.dest(draft.app));
    });

    gulp.task('templates', cleanDependency, function () {
        if(draft.templates){
            var dest = draft.buildInto;

            if(draft.elixir){
                dest += '/js';
            }

            return gulp.src(draft.app + '/**/*.html')
              .pipe(ngTemplates({standalone: true}))
              .pipe(gulp.dest(dest));
        }else{
            return copy(draft.app + '/**/*.html', draft.buildInto);
        }
    });

    if(draft.elixir){
        mix.sass('app.scss');
        mix
            .task('templates', draft.app + '/**/*.html')
            .task('register', draft.app + '/**/*.{controller,directive,service}.js')
            .browserify('app.js');
    }
}

function registerNonElixir(draft){
    gulp.task('default', [ 'build' ]);

    var buildDependencies = [ 'clean', 'html', 'vendor', 'sass', 'js' ];

    gulp.task('build', buildDependencies);

    gulp.task('clean', function(done){
        rimraf(draft.buildInto, done);
    });

    copyTask('html', [ 'clean' ], draft.assets + '/**/*.html', draft.buildInto);
    copyTask('vendor', [ 'clean' ], draft.vendor + '/**/*', draft.buildInto + '/vendor');

    sass({
        gulp: gulp,
        task: 'sass',
        dependencies: ['clean'],
        src: draft.assets + '/sass/**/*',
        dest: draft.buildInto
    });

    babel({
        gulp: gulp,
        task: 'js',
        dependencies: [ 'clean', 'register', 'templates' ],
        browserify: {
            debug: true,
            baseDir: draft.app
        }
    });

    watch({
        gulp: gulp,
        task: 'watch',
        dependencies: ['build'],
        watch: [ draft.assets + '/**/*', draft.vendor + '/**/*', draft.app + '/**/*', '!' + draft.app + '/register.js' ],
        start: 'build'
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