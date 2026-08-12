import path from 'node:path'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import pluginCSS from 'rollup-plugin-css-only'
import postcss from 'rollup-plugin-postcss'
import typescript from 'rollup-plugin-typescript2'
import vue from 'rollup-plugin-vue'
import packageInfo from './package.json' with { type: 'json' }

const rootDir = path.dirname(fileURLToPath(import.meta.url))

function baseConfig(css, ssr, umd, min, cssFile) {
  return {
    input: 'src/FileUpload.vue',
    output: {
      format: umd ? 'umd' : 'esm',
      sourcemap: true,
      banner: umd ? `/*!
 Name: ${packageInfo.name}
 Component URI: ${packageInfo.homepage}
 Version: ${packageInfo.version}
 Author: ${packageInfo.author}
 License: ${packageInfo.license}
 Description: ${packageInfo.description}
 */` : '',
      globals: {
        vue: 'Vue',
      },
      name: 'VueUploadComponent',
    },
    external: ['vue'],
    plugins: [
      resolve({
        browser: true,
        mainFields: ['browser', 'module', 'main'],
      }),
      css && pluginCSS({
        output(styles) {
          writeFileSync(path.resolve(rootDir, 'dist', cssFile), `${styles.trimEnd()}\n`)
        },
      }),
      vue({
        preprocessStyles: true,
        css,
        target: ssr ? 'node' : 'browser',
      }),
      typescript({
        declaration: true,
        check: true,
        tsconfig: path.resolve(rootDir, 'tsconfig.json'),
        tsconfigOverride: {
          compilerOptions: {
            rootDir: path.resolve(rootDir, 'src'),
          },
        },
        cacheRoot: path.resolve(rootDir, 'node_modules/.rts2_cache'),
      }),
      postcss(),
      min && terser({
        format: {
          comments: /^!/,
        },
      }),
      commonjs({
        extensions: ['.js', '.ts', '.vue'],
      }),
    ],
  }
}

const config = baseConfig(false, false)
config.output.file = 'dist/vue-upload-component.js'

const configPart = baseConfig(true, false, false, false, 'vue-upload-component.part.css')
configPart.output.file = 'dist/vue-upload-component.part.js'

const configSSR = baseConfig(false, true, true)
configSSR.output.file = 'dist/vue-upload-component.ssr.js'

const configUmd = baseConfig(false, false, true)
configUmd.input = config.output.file
configUmd.output.file = config.output.file

const configPartUmd = baseConfig(false, false, true)
configPartUmd.input = configPart.output.file
configPartUmd.output.file = configPart.output.file

const configMin = baseConfig(false, false, true, true)
configMin.input = config.output.file
configMin.output.file = 'dist/vue-upload-component.min.js'

const configEsm = baseConfig(false, false, false)
configEsm.output.file = 'dist/vue-upload-component.esm.js'

const configEsmPart = baseConfig(true, false, false, false, 'vue-upload-component.esm.part.css')
configEsmPart.output.file = 'dist/vue-upload-component.esm.part.js'

const configEsmSSR = baseConfig(false, true, false)
configEsmSSR.output.file = 'dist/vue-upload-component.esm.ssr.js'

const configEsmUmd = baseConfig(false, false, false)
configEsmUmd.input = configEsm.output.file
configEsmUmd.output.file = configEsm.output.file

const configEsmPartUmd = baseConfig(false, false, false)
configEsmPartUmd.input = configEsmPart.output.file
configEsmPartUmd.output.file = configEsmPart.output.file

const configEsmMin = baseConfig(false, false, false, true)
configEsmMin.input = configEsm.output.file
configEsmMin.output.file = 'dist/vue-upload-component.esm.min.js'

export default [
  config,
  configPart,
  configSSR,
  configUmd,
  configPartUmd,
  configMin,
  configEsm,
  configEsmPart,
  configEsmSSR,
  configEsmUmd,
  configEsmPartUmd,
  configEsmMin,
]
