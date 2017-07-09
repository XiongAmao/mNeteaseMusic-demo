var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    gutil = require('gulp-util'),
    babel = require('gulp-babel'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    del = require('del'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload

const srcPaths = {
  js: ['./js/**/*.js'],
  scss: ['./css/**/*.scss'],
  json: ['./json/**/*.json'],
  image: ['./image/**/*.{svg,jpg,jpeg,png,webp}'],
  htmlFiles: ['./*.html'],
  imageFiles: ['./image/**/*.{ico,svg,jpg,jpeg,png,webp}']
}
const outputPaths = {
  js: 'build/js/',
  css: 'build/css/',
  json: 'build/json/',
  image: 'build/image/',
  build: 'build/',
  imageFiles: 'build/image'
}
gulp.task('serve', ['css'], function () {
  browserSync.init({
    server: { baseDir: "./build" },
    files:""
  })
  // Watch .scss files
    gulp.watch(srcPaths.scss, ['css']);
  // Watch .js files
  gulp.watch(srcPaths.js, ['js-watch']);
  // Watch image files
  gulp.watch(srcPaths.htmlFiles, ['html-watch']);
})



gulp.task('reset', function () {
  return del(['build'])
})

gulp.task('js', function () {
  return gulp.src(srcPaths.js)
    .pipe(babel({ presets: ['env'] }))
    .pipe(uglify())
    .pipe(gulp.dest(outputPaths.js))

})
gulp.task('js-watch', ['js'], browserSync.reload);

gulp.task('css', function () {
  return gulp.src(srcPaths.scss)
    .pipe(postcss([autoprefixer()]))
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(gulp.dest(outputPaths.css))
    .pipe(browserSync.stream());
})

gulp.task('cp-html-files', function () {
  return gulp.src(srcPaths.htmlFiles)
    .pipe(gulp.dest(outputPaths.build))
})
gulp.task('html-watch', ['cp-html-files'], browserSync.reload);

gulp.task('cp-json-files', function () {
  return gulp.src(srcPaths.json)
    .pipe(gulp.dest(outputPaths.json))
})
gulp.task('cp-image-files', function () {
  return gulp.src(srcPaths.imageFiles)
    .pipe(gulp.dest(outputPaths.imageFiles))
})
gulp.task('cp-static-files', ['cp-html-files', 'cp-json-files', 'cp-image-files'])

gulp.task('default', ['reset'], function () {
  gulp.start('css', 'js', 'cp-static-files', 'serve')
})

gulp.task('watch',function(){


})

