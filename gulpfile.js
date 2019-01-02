/*
 * @Author: 刘祥祥 
 * @Date: 2019-01-02 09:02:32 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-01-02 10:10:46
 */

var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer'); //前缀
var cleancss = require('gulp-clean-css'); //压缩css
var imagemin = require('gulp-imagemin');
var rev = require('gulp-rev');
var collector = require('gulp-rev-collector');
var webserver = require('gulp-webserver'); //服务
var uglify = require('gulp-uglify'); //压缩js
var sass = require('gulp-sass'); //编译scss
var concat = require('gulp-concat'); //合并

var url = require('url');
var fs = require('fs');
var path = require('path');

gulp.task('scss', function() { //创建任务（编译scss到css）
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/css/'));
});

gulp.task('watch', function() { //监听
    gulp.watch('./sass/**/*.scss', gulp.series('sass'));
});

gulp.task('cssmin', function() { //创建任务（压缩css到dist的css）
    return gulp.src('./src/css/*.css')
        .pipe(cleancss({ compatibility: 'ie8' }))
        .pipe(gulp.dest('./dist/css'));
});


gulp.task('default', function() { //创建任务（前缀）
    return gulp.src('./src/scss/*.scss')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./src/css/*.css'))
});

gulp.task('jsmin', function() { //创建任务（压缩 合并 js）
    return gulp.src('./src/js/**/*.js')
        .pipe(uglify())
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('imgmin', function() { //压缩image到dist
    gulp.src('./src/img/*.{png,jpg,gif}')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/images'))
});

gulp.task('webserver', function() { //启动服务
    gulp.src('src')
        .pipe(webserver({
            port: 8889,
            livereload: true,
            directoryListing: true,
            open: true,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url(path.join(__dirname, "src"))).pathname;
                if (pathname === 'favicon.ico') {
                    res.end('');
                    return;
                }
                pathname = pathname === '/' ? 'index.html' : pathname;
                res.end(fs.readFileSync(path.join(__dirname, "src", pathname)));
            }
        }));
});
gulp.task('dev', function() { //监听
    gulp.watch('./sass/**/*.scss', gulp.series('scss', 'default', 'jsmin', 'webserver', 'cssmin', 'imgmin'));
});