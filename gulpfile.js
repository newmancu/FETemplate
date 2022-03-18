
const gulp = require('gulp')
const rename = require('gulp-rename')
const autoprefixer = require('gulp-autoprefixer')
const srcmaps = require('gulp-sourcemaps')
const sass = require('gulp-sass')(require('sass'))
const browserSync = require('browser-sync').create()
const fileinclude = require('gulp-file-include')
const markdown = require('markdown')
const path = require('path')
const del = require('del')
const pug = require('gulp-pug')

const IS_PUG = true
const IS_SASS = true
const BUILD_FOLDER = './build'

const DEBUG_ROOT = path.join(BUILD_FOLDER, '/debug')
const RELEASE_ROOT = path.join(BUILD_FOLDER, '/release')

const LAYOUT_EXT = IS_PUG ? '.pug' : '.html'
const STYLE_EXT = IS_SASS ? '.sass' : '.scss' 

let CUR_ROOT = DEBUG_ROOT

function layoutInclude(next) {
    gulp.src('./src/*' + LAYOUT_EXT)
        .pipe(fileinclude({
            filters: {
                markdown: markdown.parse
            }
        }))
        .pipe(pug({

        }))
        .pipe(gulp.dest(CUR_ROOT))
    next()
}

function sassCompiler(next) {
    gulp.src('./src/' + STYLE_EXT.slice(1) + '/style' + STYLE_EXT)
        .pipe(srcmaps.init())
        .pipe(sass({
            errLogToConsole: true,
        }))
        .on('error', console.error.bind(console))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(rename((path) => {
            path.extname = '.css'
        }))
        .pipe(srcmaps.write('./'))
        .pipe(gulp.dest(path.join(CUR_ROOT, '/css')))
        .pipe(browserSync.stream())
    next()
}

function sassCompilerCompresed(next) {
    gulp.src('./src/' + STYLE_EXT.slice(1) + '/style' + STYLE_EXT)
        .pipe(srcmaps.init())
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: 'compressed'
        }))
        .on('error', console.error.bind(console))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(rename((path) => {
            path.extname = '.min.css'
        }))
        .pipe(srcmaps.write('./'))
        .pipe(gulp.dest(path.join(CUR_ROOT, '/css')))
        .pipe(browserSync.stream())
    next()
}

function browInit(next) {
    browserSync.init({
        server: {
            baseDir: DEBUG_ROOT
        },
        port: 3300
    })
    next()
}

function browReload(next) {
    browserSync.reload()
    next()
}

function watchSass() {
    gulp.watch([
        "./src/" + STYLE_EXT.slice(1) + "/**/*" + STYLE_EXT,
        "./src/**/*" + STYLE_EXT,
    ], sassCompiler)
}

function wathBrow() {
    gulp.watch('./src/**/*', browReload)
}

function watchLayoutInclude() {
    gulp.watch([
        // './src/*' + LAYOUT_EXT,
        './src/**/*' + LAYOUT_EXT
    ], layoutInclude)
}

function makeBuild(next) {
    CUR_ROOT = RELEASE_ROOT
    gulp.series(layoutInclude,sassCompilerCompresed)()
    next()
}

gulp.task('clean', () => {
    return del('./build/**', {force:true})
});
gulp.task('build', makeBuild)
gulp.task('default', gulp.series(
    browInit,
    layoutInclude,
    sassCompiler,
    gulp.parallel(
        watchSass,
        watchLayoutInclude,
        wathBrow
        )
    ))
