import path from 'path'
import glob from 'glob'
import del from 'del'
import gulp from 'gulp'
import postcss from 'gulp-postcss'
import sass from 'gulp-sass'
import imagemin from 'gulp-imagemin'
import browserSync from 'browser-sync'
import { rollup } from 'rollup'

sass.compiler = require('node-sass')

const postCSSPlugins = [
  require('autoprefixer')(),
  require('postcss-preset-env')(),
]
if (process.env.PRODUCTION) {
  postCSSPlugins.push(
    require('cssnano')()
  )
}
export function styles() {
  return gulp
    .src('./source/styles/*.scss')
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss(postCSSPlugins))
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

const rollupPlugins = [
  require('rollup-plugin-typescript')(),
  require('rollup-plugin-node-resolve')(),
  require('rollup-plugin-commonjs')(),
]
if (process.env.PRODUCTION) {
  rollupPlugins.push(
    require('rollup-plugin-uglify').uglify()
  )
}
export function scripts() {
  return Promise.all(
    glob.sync('./source/scripts/*.ts').map(async entry => {
      const bundle = await rollup({ input: entry, plugins: rollupPlugins })
      await bundle.write({
        file: `./bundle/assets/scripts/${path.basename(entry, '.ts')}.js`,
        format: 'iife',
      })
      browserSync.reload()
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
    browser: 'google chrome',
    server: {
      baseDir: './bundle',
    },
  })
}

export const serve = gulp.series(build, gulp.parallel(watch, createServer))
