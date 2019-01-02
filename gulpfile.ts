import gulp from 'gulp'
import { rollup } from 'rollup'
import source from 'vinyl-source-stream'
import del from 'del'
import typescript from 'rollup-plugin-typescript'
import postcss from 'gulp-postcss'
import sass from 'gulp-sass'
import imagemin from 'gulp-imagemin'
import browserSync from 'browser-sync'
import merge from 'gulp-merge'
import glob from 'glob'
import path from 'path'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

sass.compiler = require('node-sass')

export function styles() {
  return gulp
    .src('./source/styles/*.scss')
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss())
    .pipe(gulp.dest('./bundle/assets/styles'))
    .pipe(browserSync.reload({ stream: true }))
}

export function clean() {
  return del(['bundle'])
}

export function copy() {
  return gulp
    .src(['./source/static/**/*', './source/pages/*'], {
      since: gulp.lastRun(copy),
    })
    .pipe(gulp.dest('./bundle'))
    .pipe(browserSync.reload({ stream: true }))
}

export function scripts() {
  return Promise.all(
    glob.sync('./source/scripts/*.ts').map(entry => {
      return rollup({
        input: entry,
        plugins: [resolve(), commonjs(), typescript()],
      }).then(bundle => {
        return bundle
          .write({
            file: `./bundle/assets/scripts/${path.basename(entry, '.ts')}.js`,
            format: 'iife',
          })
          .then(() => browserSync.reload())
      })
    })
  )
}
export const build = gulp.series(
  clean,
  gulp.parallel(copy, images, styles, scripts)
)

export default build

export function images() {
  return gulp
    .src('./source/images/*.{jpg,jpeg,png}', {
      since: gulp.lastRun(images),
    })
    .pipe(imagemin({ optimizationLevel: 5 }))
    .pipe(gulp.dest('./bundle/assets/images'))
}

function watch() {
  gulp.watch(['./source/static/**/*', './source/pages/*'], copy)
  gulp.watch('./source/scripts', scripts)
  gulp.watch('./source/styles', styles)
  gulp.watch('./source/images', images)
}

function createServer(done) {
  browserSync({
    browser: "google chrome",
    server: {
      baseDir: './bundle',
    },
  })
}

export const serve = gulp.series(build, gulp.parallel(watch, createServer))
