var elixir = require('laravel-elixir');
var blueprint = require('../../lib/gulp-blueprint');

elixir(function(mix){
    blueprint(function modify(draft){
        draft.elixir = mix;
    });
});