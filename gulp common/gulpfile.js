/*
 * 朱圣华 2017/6/27
 * gulp 四个语法 
 * gulp.src(),gulp.watch,gulp.task(),gulp.run()
 * gulp 安装
 * 需要全局安装 后 在项目里安装
 * 
 */

'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass'),
	jshint = require('gulp-jshint'),
	concat = require('gulp-concat'),
	htmlmin = require('gulp-htmlmin'),
	md5 = require("gulp-md5-plus"),
	rev = require('gulp-rev'),
	uglify = require('gulp-uglify'),
	clean = require('gulp-clean');
//实时更新
var browserSync = require('browser-sync').create();
var revCollector = require('gulp-rev-collector');

// 本地 server 
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./src",
            index: 'views/index.html'
        }
    });
});

gulp.task('watch',['clean'],function () {
   gulp.watch([
        './src/styles/*.sass',
        './src/scripts/*.js'
   ], ['browser-sync']);
 });
 
gulp.task('clean',function(){
	gulp.src('./dest')
	.pipe(clean())
});
 
//gulp-sass
gulp.task('sass',function(){
	gulp.src('./src/styles/*.sass')
	.pipe(sass())
	.pipe(gulp.dest('./src/css'))
	.pipe(rev())
	.pipe(gulp.dest('./dest/css'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/css'));
})
//gulp-jshint gulp-uglify
gulp.task('js',function(){
	gulp.src('./src/scripts/*.js')
	.pipe(jshint())
	.pipe(uglify())
	.pipe(concat('ab.js'))
	.pipe(rev())
	.pipe(gulp.dest('./dest/scripts'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/js'));

})

gulp.task('rev', function () {
    return gulp.src(['rev/**/*.json', './src/views/*.html'])
        .pipe(revCollector({
            replaceReved: true
           }))
        .pipe(gulp.dest('./dest/view'));
});

gulp.task('htmlmin',function(){
	gulp.src('./src/views/*.html')
	.pipe(htmlmin({collapseWhitespace: true}))
	.pipe(gulp.dest('./dest/view'));
	
})

//gulp-watch
gulp.task('watch',function(){
	gulp.watch('./src/styles/*.sass',['sass']);
	gulp.watch('./src/views/*.html',['htmlmin']);
	gulp.watch('./src/scripts/*.js',['js']);
})

gulp.task('default',['clean','watch'],function(){
	gulp.run('sass','js','htmlmin','watch','browser-sync','rev');
});
