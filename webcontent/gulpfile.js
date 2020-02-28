// -----------------------------------------------------------------------------
// File system builder
// -----------------------------------------------------------------------------

const fs = require('fs');
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const cleancss = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const gzip = require('gulp-gzip');
const del = require('del');
const inline = require('gulp-inline');
const inlineImages = require('gulp-css-base64');
const favicon = require('gulp-base64-favicon');
const gulp_babel = require('gulp-babel');
const replace = require('gulp-replace');
const rename = require('gulp-rename');

const distFolder = 'dist/';

var clean = function () {
    return del([ distFolder + '*']);
}

// gulp.task('clean', gulp.series(clean));

var babel = function (){
    return gulp.src('src/main.js')
        .pipe(gulp_babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest(distFolder));
}
// gulp.task('babel',gulp.series(babel));

// gulp.task('buildfs_inline', gulp.series('clean','babel',function buildfs_inline() {
gulp.task('buildClient_inline', gulp.series(function buildClient_inline() {
    clean();
    // babel();
    return gulp.src('src/index.html')
        .pipe(favicon())
        .pipe(inline({
            base: 'html/',
            js: function(){
                return gulp_babel({presets: ['@babel/env']});
            },
            css: [cleancss, inlineImages],
            disabledTypes: ['svg', 'img']
        }))
        .pipe(htmlmin({
            collapseWhitespace: true,
            removecomments: true,
            aside: true,
            minifyCSS: true,
            minifyJS: true
        }))
        .pipe(gulp.dest(distFolder))
        .pipe(gzip())
        .pipe(gulp.dest(distFolder));
}));

gulp.task('buildClient_embeded', gulp.series('buildClient_inline', function buildfs_embeded(cb){
    var source = distFolder + 'index.html.gz';
    var destination = distFolder + 'index.html.gz.h';

    var wstream = fs.createWriteStream(destination);
    wstream.on('error', function (err) {
        console.log(err);
    });

    var data = fs.readFileSync(source);

    wstream.write('#define index_html_gz_len ' + data.length + '\n');
    wstream.write('#define index_last_update "' + new Date().toUTCString() + '"\n');
    wstream.write('const uint8_t index_html_gz[] PROGMEM = {')

    for (i=0; i<data.length; i++) {
        if (i % 1000 == 0) wstream.write("\n");
        wstream.write('0x' + ('00' + data[i].toString(16)).slice(-2));
        if (i<data.length-1) wstream.write(',');
    }

    wstream.write('\n};')
    wstream.end();

    cb();
}));