var gulp = require('gulp');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function () {
    gulp.src('./sass/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({errLogToConsole: true}))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./css')
        );
});

// Watch Files For Changes
gulp.task('watch', function() {
    livereload.listen({host: null});
    gulp.watch('sass/**/*.scss', ['sass']);
    gulp.watch('css/**/*.css').on('change', livereload.changed);
});

// Default task
gulp.task('default', ['sass', 'watch']);
