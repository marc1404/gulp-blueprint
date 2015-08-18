# gulp-blueprint
[![npm](https://img.shields.io/npm/v/gulp-blueprint.svg?style=flat-square)](https://www.npmjs.com/package/gulp-blueprint)
[![Travis](https://img.shields.io/travis/marc1404/gulp-blueprint.svg?style=flat-square)](https://travis-ci.org/marc1404/gulp-blueprint)
[![Code Climate](https://img.shields.io/codeclimate/github/marc1404/gulp-blueprint.svg?style=flat-square)](https://codeclimate.com/github/marc1404/gulp-blueprint)
[![Code Climate](https://img.shields.io/codeclimate/coverage/github/marc1404/gulp-blueprint.svg?style=flat-square)](https://codeclimate.com/github/marc1404/gulp-blueprint/coverage)
[![npm](https://img.shields.io/npm/l/gulp-blueprint.svg?style=flat-square)](https://github.com/marc1404/gulp-blueprint/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/dm/gulp-blueprint.svg?style=flat-square)](https://www.npmjs.com/package/gulp-blueprint)

[![David](https://img.shields.io/david/marc1404/gulp-blueprint.svg?style=flat-square)](https://github.com/marc1404/gulp-blueprint/blob/master/package.json)
[![David](https://img.shields.io/david/dev/marc1404/gulp-blueprint.svg?style=flat-square)](https://github.com/marc1404/gulp-blueprint/blob/master/package.json)

## Installation
```
$ npm install --save-dev gulp-blueprint
```
  
## Description
This package can be used to setup many common [gulp](https://www.npmjs.com/package/gulp) tasks.  
Features:  
- Copy ```index.html``` from assets folder
- Copy vendor scripts
- [Register Angular modules](https://www.npmjs.com/package/gulp-ng-register)
- [Convert Angular templates to JavaScript](https://www.npmjs.com/package/gulp-angular-templatecache)
- Compile SASS to a minified CSS stylesheet
- [Browserify](https://www.npmjs.com/package/browserify), [Babelify](https://babeljs.io/) ES6 to ES5, [ngAnnotate](https://www.npmjs.com/package/gulp-ng-annotate) & [minify](https://www.npmjs.com/package/gulp-uglify)  JavaScript
- Watch task to rebuild project on changes

## Usage
*gulpfile.js*
```javascript
var blueprint = require('gulp-blueprint');

blueprint();
```
  
## Options
You can pass an options object to ```blueprint()```.
- ```elixir``` boolean defaults to ```false```, pass the [Elixir](https://www.npmjs.com/package/laravel-elixir) mix object to automatically configure *gulp-blueprint* for [Elixir](https://www.npmjs.com/package/laravel-elixir)
- ```buildInto``` string defaults to ```'public'```, specify the build folder
- ```assets``` string defaults to ```'assets'```, specify where assets can be found
- ```vendor``` string defaults to ```'vendor'```, specify where vendor files can be found
- ```app``` string defaults to ```'app/client'```, specify where your client-side JavaScript can be found
- ```templates``` boolean defaults to ```false```, whether Angular templates should be converted to JavaScript 

## Test
```
$ npm install -g mocha  
$ mocha
```

## Author
[marc1404](https://github.com/marc1404)

## License
[MIT](https://github.com/marc1404/gulp-blueprint/blob/master/LICENSE)