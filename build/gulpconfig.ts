import minimist from 'minimist'

const args = minimist(process.argv, { boolean: ['production'] })

export const isProduction = args.production

export const inputs = {
  source: './source',
  statics: './source/static/**/*',
  markups: './source/pages/*',
  scripts: './source/scripts/*.ts',
  styles: './source/styles/*.scss',
  images: './source/images/*.{jpg,jpeg,png}',
}

export const outputs = {
  bundle: './bundle',
  statics: './bundle',
  markups: './bundle',
  scripts: './bundle/assets/scripts',
  styles: './bundle/assets/styles',
  images: './bundle/assets/images',
}
