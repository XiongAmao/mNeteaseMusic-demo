var gulp = require('gulp');
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var sass = require('gulp-sass')
var gutil = require('gulp-util');
const babel = require('gulp-babel');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var del = require('del');

const srcPaths = {
  js:['./js/**/*.js'],
  scss:['./css/**/*.scss'],
  json:['./json/**/*.json'],
  image:['./image/**/*.{jpg,jpeg,png,webp}'],
  html:['./*.html']
}
const outputPaths = {
  js:'build/js/',
  css:'build/css/',
  json:'build/json/',
  image:'build/image/',
  html:'build/'
}
gulp.task('reset', function() {
  return del(['build']);
});


gulp.task('js', ['reset'], function() {
    return gulp.src(srcPaths.js)
      .pipe(babel({presets:['env']}))
      .pipe(uglify())
      .pipe(gulp.dest(outputPaths.js));

});
gulp.task('css',['reset'],function(){
  return gulp.src(srcPaths.scss)
    .pipe(postcss([autoprefixer()]))
    .pipe(sass({outputStyle:'compressed'}))
    .pipe(gulp.dest(outputPaths.css))
})
gulp.task('html-files',['reset'],function(){
  return gulp.src(srcPaths.html)
    .pipe(gulp.dest(outputPaths.html))
})
gulp.task('json-files',['reset'],function(){
  return gulp.src(srcPaths.json)
    .pipe(gulp.dest(outputPaths.json))
})

gulp.task('default', ['js','css','html-files','json-files']);
