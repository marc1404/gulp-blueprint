process.chdir(__dirname);

var gulp = require('gulp');
var blueprint = require('../lib/gulp-blueprint');

blueprint();

describe('when running default task', function(){
  it('should complete without an error', function(){
    gulp.start('default');
  });
});

describe('when running watch task', function(){
  it('should complete without an error', function(){
    gulp.start('watch');
  });
});