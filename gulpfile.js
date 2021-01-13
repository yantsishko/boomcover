'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglifycss = require('gulp-uglifycss');
// var exec = require('gulp-exec');
var exec = require('child_process').exec;
var autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function () {
    return gulp.src('./public/app/css/*.sass')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(uglifycss({
            "maxLineLen": 120,
            "uglyComments": true
        }))
        .pipe(gulp.dest('./public/app/css'));
});

gulp.task('sass:watch', function () {
    return gulp.watch('./public/app/css/*.sass', ['sass']);
});

gulp.task('dev', ['sass:watch']);

gulp.task('build-front', function (cb) {
  exec('cd public/app/ && ../../node_modules/.bin/r.js -o app.build.js', function (err, stdout, stderr) {
    console.log(stdout);
    console.error(stderr);
    cb(err);
  });
});

gulp.task('sass-admin', function () {
    return gulp.src('./admin/public/sass/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(uglifycss({
            "maxLineLen": 120,
            "uglyComments": true
        }))
        .pipe(gulp.dest('./admin/public/css'));
});

gulp.task('sass-admin:watch', function () {
    return gulp.watch('./admin/public/sass/*.scss', ['sass-admin']);
});

gulp.task('default', ['build-front'])