import del from 'del'
import gulp from 'gulp'
import browserSync from 'browser-sync'

import styles from './build/tasks/styles'
import images from './build/tasks/images'
import scripts from './build/tasks/scripts'
import markups from './build/tasks/markups'
import statics from './build/tasks/statics'

import { outputs, inputs } from './build/gulpconfig'

function watch() {
  gulp.watch(inputs.statics, statics)
  gulp.watch(inputs.markups, markups)
  gulp.watch(inputs.scripts, scripts)
  gulp.watch(inputs.styles, styles)
  gulp.watch(inputs.images, images)
}

function server() {
  browserSync({
    browser: 'google chrome',
    server: {
      baseDir: outputs.bundle,
    },
  })
}
export function clean() {
  return del([outputs.bundle])
}
export const build = gulp.series(clean, gulp.parallel(markups, statics, images, styles, scripts))
export const serve = gulp.series(build, gulp.parallel(watch, server))

export default build
