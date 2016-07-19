var gulp = require('gulp');
var sass = require('gulp-sass')
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var rename = require('gulp-rename');
var gutil = require('gulp-util');
var concat = require('gulp-concat');


gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
});

// compile sass to css
gulp.task('sass', function() {
  return gulp.src('app/scss/main.scss') // Gets all files ending with .scss in app/scss
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// cleaning up generated files
gulp.task('clean:dist', function() {
  return del.sync('dist');
})

// \\\\\\\\\\\\\\\\\\\
// GULP DEPLOY TASKS\\
// \\\\\\\\\\\\\\\\\\\
gulp.task('js-deploy', function() {
  return gulp.src('app/js/**/*')
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});
gulp.task('fonts-deploy', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
});
gulp.task('html-deploy', function() {
  return gulp.src('app/*.html')
  .pipe(gulp.dest('dist/'))
});
gulp.task('styles-deploy', function() {
  return gulp.src('app/css/**/*.css') // Gets all files ending with .scss in app/scss
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css'))
});
gulp.task('images-deploy', function(){
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'))
});
// \\\\\\\\\\\\
// GULP WATCH\\
// \\\\\\\\\\\\
gulp.task('watch', ['browserSync', 'sass', ], function (){
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

// \\\\\\\\\\\\
// GULP BUILD\\
// \\\\\\\\\\\\
gulp.task('build', function (callback) {
  runSequence('clean:dist', ['sass', 'html-deploy', 'styles-deploy', 'images-deploy', 'fonts-deploy', 'js-deploy'], 
    callback)
})

gulp.task('default', function (callback) {
  runSequence(['sass', 'browserSync', 'watch'],
    callback
  )
})