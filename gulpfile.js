
import gulp from 'gulp'
import rename from 'gulp-rename'
import autoprefixer from 'gulp-autoprefixer'
import srcmaps from 'gulp-sourcemaps'
import sassFactory from 'gulp-sass'
import browserSync from 'browser-sync'
import fileinclude from 'gulp-file-include'
import markdown from 'markdown'
import path from 'path'
import del from 'del'
import pug from 'gulp-pug'
import compile from 'sass'
import imagemin from 'gulp-imagemin'
import svgo from 'imagemin-svgo'
import mozjpeg from 'imagemin-mozjpeg'
import minify from 'gulp-minify'

const sass = sassFactory(compile)
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
            path.extname = '.css'
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
    gulp.watch(
        // './src/*' + LAYOUT_EXT,
        './src/**/*' + LAYOUT_EXT
        , layoutInclude)
    gulp.watch(
        './src/**/*.js', 
        layoutInclude)
}

function compileJs(next) {
    gulp.src('./src/js/**/*')
        .pipe(minify({
            ext: '.js'
        }))
        .pipe(gulp.dest(path.join(CUR_ROOT, '/js')))
    gulp.src('./src/libs/**/js/bin/*.js', {base: './src/libs/'})
        .pipe(minify({
            ext: '.js'
        }))
        .pipe(gulp.dest(path.join(CUR_ROOT, '/libs')))
    next()
}

function watchJs() {
    gulp.watch('./src/**/*.js', compileJs)
}

function compileImg(next) {
    if (CUR_ROOT == DEBUG_ROOT) {
        gulp.src('./src/img/**/*')
            .pipe(gulp.dest(path.join(CUR_ROOT, '/img')))
    } else {
        gulp.src('./src/img/**/*')
            .pipe(imagemin([
                // other options https://github.com/imagemin/imagemin-mozjpeg
                mozjpeg({quality: 75, progressive: true}),
                // imagemin.optipng({optimizationLevel: 5}),
                svgo()
            ]))
            .pipe(gulp.dest(path.join(CUR_ROOT, '/img')))
    }
    next()
}

function watchImg() {
    gulp.watch('./src/img/**/*', compileImg)
}

function addFonts(next) {
    gulp.src('./src/fonts/**/*')
        .pipe(gulp.dest(path.join(CUR_ROOT, '/fonts')))
    next()
}
function watchFonts() {
    gulp.watch('./src/fonts/**/*', addFonts)
}

function makeBuild(next) {
    CUR_ROOT = RELEASE_ROOT
    gulp.series(
        addFonts,compileImg,layoutInclude,sassCompilerCompresed, compileJs
        )()
    next()
}

gulp.task('clean', () => {
    return del('./build/**', {force:true})
});
gulp.task('build', makeBuild)
gulp.task('default', gulp.series(
    browInit,
    addFonts,
    compileImg,
    layoutInclude,
    sassCompiler,
    compileJs,
    gulp.parallel(
        watchFonts,
        watchImg,
        watchSass,
        watchLayoutInclude,
        wathBrow,
        watchJs
        )
    ))
