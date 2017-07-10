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
  image: ['./images/**/*.{svg,jpg,jpeg,png,webp}'],
  htmlFiles: ['./*.html'],
  imageFiles: ['./images/**/*.{ico,svg,jpg,jpeg,png,webp}']
}
const outputPaths = {
  js: 'build/js/',
  css: 'build/css/',
  json: 'build/json/',
  image: 'build/images/',
  build: 'build/',
  imageFiles: 'build/images'
}
gulp.task('serve', function () {
  browserSync.init({
    server: { baseDir: "./build" },
    files: './build',
    ui:{
      port: 8081
    },
    port:8080,
    codeSync: false,
    startPath: "/homepage.html"
  })
  // Watch .scss files

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
// gulp.task('js-watch', ['js']);

gulp.task('css', function () {
  return gulp.src(srcPaths.scss)
    .pipe(postcss([autoprefixer()]))
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(gulp.dest(outputPaths.css))
})

gulp.task('cp-html-files', function () {
  return gulp.src(srcPaths.htmlFiles)
    .pipe(gulp.dest(outputPaths.build))
})
gulp.task('html-watch', ['cp-html-files']);

gulp.task('cp-json-files', function () {
  return gulp.src(srcPaths.json)
    .pipe(gulp.dest(outputPaths.json))
})
gulp.task('cp-image-files', function () {
  return gulp.src(srcPaths.imageFiles)
    .pipe(gulp.dest(outputPaths.imageFiles))
})
gulp.task('cp-static-files', ['html-watch', 'cp-json-files', 'cp-image-files'])

gulp.task('default', ['reset'], function () {
  gulp.start('watch','serve', 'js', 'css', 'cp-static-files')
})

gulp.task('watch', function () {
  gulp.watch(srcPaths.scss, ['css']);
  // Watch .scss files
  gulp.watch(srcPaths.js, ['js']);
  // Watch .js files
  gulp.watch(srcPaths.htmlFiles, ['cp-html-files'])
  // Watch .html files
  gulp.watch(srcPaths.json, ['cp-json-files'])
  // Watch .json files
})

