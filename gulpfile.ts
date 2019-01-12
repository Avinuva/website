import del from 'del'
import gulp from 'gulp'
import browserSync from 'browser-sync'

import styles from './build/tasks/styles'
import images from './build/tasks/images'
import scripts from './build/tasks/scripts'
import markups from './build/tasks/markups'
import statics from './build/tasks/statics'

import { outputs, inputs, watches } from './build/gulp.config'

function watch() {
  gulp.watch(watches.statics, statics)
  gulp.watch(watches.markups, markups)
  gulp.watch(watches.scripts, scripts)
  gulp.watch(watches.styles, styles)
  gulp.watch(watches.images, images)
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
