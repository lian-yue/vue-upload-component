import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import vue from 'rollup-plugin-vue'
import packageInfo from './package.json'


// const isDev = process.env.NODE_ENV === 'development'


function baseConfig() {
  return {
    output: {
      format: 'umd',
    },
    plugins: [
      resolve({
        jsnext: true,
        main: true,
        browser: true,
      }),
      commonjs({
        extensions: [
          '.js',
          '.jsx',
          '.json',
          // '.vue'
        ],
      }),
    ],
    banner: `/*!\n * Name: ${packageInfo.name}\n * Version: ${packageInfo.version}\n * Author: ${packageInfo.author}\n */`,
    sourcemap: true,
  }
}

let config = baseConfig()
config.input = 'src/index.js'
config.output.file = 'dist/vue-upload-component.js'
config.output.name = 'VueUploadComponent'
config.plugins.push(
  vue({
    autoStyles: false,
    css: true,
  }),
  babel()
)

let configMin = baseConfig()
configMin.input = 'src/index.js'
configMin.output.file = 'dist/vue-upload-component.min.js'
configMin.output.name = 'VueUploadComponent'
configMin.plugins.push(
  vue({
    autoStyles: false,
    css: true,
  }),
  babel(),
  uglify({
    output: {
      comments: /^!/,
    }
  })
)



let configPart = baseConfig()
configPart.input = 'src/index.js'
configPart.output.file = 'dist/vue-upload-component.part.js'
configPart.output.name = 'VueUploadComponent'
configPart.plugins.push(
  vue({
    autoStyles: false,
    css: 'dist/vue-upload-component.part.css',
  }),
  babel()
)


module.exports = [
  config,
  configMin,
  configPart,
]
