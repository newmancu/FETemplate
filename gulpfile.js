
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

let DEBUG = true
const BUILD_FOLDER = './build'

const DEBUG_ROOT = path.join(BUILD_FOLDER, '/debug')
const RELEASE_ROOT = path.join(BUILD_FOLDER, '/release')

let CUR_ROOT = DEBUG_ROOT

function htmlInclude(next) {
    gulp.src('./src/*.html')
        .pipe(fileinclude({
            filters: {
                markdown: markdown.parse
            }
        }))
        .pipe(gulp.dest(CUR_ROOT))
    next()
}

function sassCompiler(next) {
    gulp.src('./src/scss/style.scss')
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
    gulp.src('./src/scss/style.scss')
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
    gulp.watch("./src/scss/**/*.scss", sassCompiler)
}

function wathBrow() {
    gulp.watch('./src/**/*', browReload)
}

function watchInclude() {
    gulp.watch('./src/*.html', htmlInclude)
}

function makeBuild(next) {
    DEBUG = false
    CUR_ROOT = RELEASE_ROOT
    gulp.series(htmlInclude,sassCompilerCompresed)()
    next()
}

gulp.task('clean', () => {
    return del('./build/**', {force:true})
});
gulp.task('build', makeBuild)
gulp.task('default', gulp.series(
    browInit,
    htmlInclude,
    sassCompiler,
    gulp.parallel(
        watchSass,
        watchInclude,
        wathBrow
        )
    ))
