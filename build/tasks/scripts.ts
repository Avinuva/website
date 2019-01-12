import path from 'path'
import glob from 'glob'
import browserSync from 'browser-sync'
import { rollup } from 'rollup'

import typescript from 'rollup-plugin-typescript'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'

import { isProduction, inputs, outputs } from '../gulp.config'

const plugins = [typescript(), resolve(), commonjs()]

if (isProduction) {
  plugins.push(uglify())
}
export default function scripts() {
  return Promise.all(
    glob.sync(inputs.scripts).map(async input => {
      const bundle = await rollup({ input, plugins })
      await bundle.write({
        file: path.join(outputs.scripts, `${path.basename(input, '.ts')}.js`),
        format: 'iife',
        sourcemap: !isProduction,
      })
      browserSync.reload()
    })
  )
}
