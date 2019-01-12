import gulp from 'gulp'
import postcss from 'gulp-postcss'
import sourcemaps from 'gulp-sourcemaps'
import sass from 'gulp-sass'
import gulpif from 'gulp-if'
import browserSync from 'browser-sync'

import autoprefixer from 'autoprefixer'
import presetEnv from 'postcss-preset-env'
import cssnano from 'cssnano'

import { isProduction } from '../gulpconfig'

const plugins = [autoprefixer(), presetEnv()]

if (isProduction) {
  plugins.push(cssnano())
}

export default function styles() {
  return gulp
    .src('./source/styles/*.scss')
    .pipe(gulpif(!isProduction, sourcemaps.init()))
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(gulpif(!isProduction, sourcemaps.write()))
    .pipe(postcss(plugins))
    .pipe(gulp.dest('./bundle/assets/styles'))
    .pipe(browserSync.reload({ stream: true }))
}
