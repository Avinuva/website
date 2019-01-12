import gulp from 'gulp'
import browserSync from 'browser-sync'

import { inputs, outputs } from '../gulpconfig'

export default function statics() {
  return gulp
    .src(inputs.statics, {
      since: gulp.lastRun(statics),
    })
    .pipe(gulp.dest(outputs.statics))
    .pipe(browserSync.reload({ stream: true }))
}
